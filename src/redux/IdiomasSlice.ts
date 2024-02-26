import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '@/config/RootReducer';
import {put, call, select} from 'redux-saga/effects';
import {Dictionary, isEmpty, keyBy} from 'lodash';
import {format} from 'date-fns';
import IdiomasService, {Idioma} from '@/services/IdiomasService';
import {ApiResponse} from '@/services/RestApiBaseService';

type IdiomaPayload = {
  data: Dictionary<Idioma>;
  lang: string;
};

type IdiomasState = {
  data: {
    [key: string]: Dictionary<Idioma> | null;
  };
  updated_at: {
    [key: string]: string | null;
  };
  fetching: boolean;
  error: boolean;
};

const initialState: IdiomasState = {
  data: {
    es: null,
    en: null,
  },
  updated_at: {es: null, en: null},
  fetching: false,
  error: false,
};

/**
 * SLICE
 */
const IdiomasSlice = createSlice({
  name: 'idiomas',
  initialState,
  reducers: {
    idiomasFetch: (state, action: PayloadAction<string>) => {
      state.fetching = true;
      state.error = false;
    },
    idiomasFetchFailure: state => {
      state.fetching = false;
      state.error = true;
    },
    idiomasFetchSuccess: (state, action: PayloadAction<IdiomaPayload>) => {
      const {data, lang} = action.payload;
      state.data[lang] = data;
      state.updated_at[lang] = format(new Date(), 'yyyy-MM-dd');
      state.fetching = false;
      state.error = false;
    },
  },
});

export const IdiomasActions = IdiomasSlice.actions;
export const IdiomasSliceName = IdiomasSlice.name;

export default IdiomasSlice.reducer;

/**
 * SELECTORS
 */
export const IdiomasSelectors = {
  getIdiomas: (state: RootState): Idioma[] | null =>
    state.idiomas.data
      ? Object.values(state.idiomas.data[state.config.idioma] ?? {})
      : null,
  getIdiomaByID: (state: RootState, id: number): Idioma | null =>
    state.idiomas?.data[state.config.idioma]?.[id] ?? null,
  getUpdatedAt: (state: RootState) =>
    state.idiomas?.updated_at[state.config.idioma] ?? false,
  isFeching: (state: RootState) => state.idiomas?.fetching ?? false,
  hasError: (state: RootState) => state.idiomas?.error ?? false,
};

/**
 * SAGAS
 */
function* getIdiomas(api: IdiomasService, action: PayloadAction<string>) {
  try {
    const updated_at: string = yield select(IdiomasSelectors.getUpdatedAt);
    const lang: string = action.payload;
    console.log(lang);
    const response: ApiResponse<Idioma> = yield call(
      api.getIdiomas,
      lang,
      updated_at,
    );
    const tData = transformObject(response.data.data);
    yield put(IdiomasActions.idiomasFetchSuccess({data: tData, lang}));
  } catch (error) {
    console.error(error);
    yield put(IdiomasActions.idiomasFetchFailure());
  }
}
export const IdiomasSagas = {getIdiomas};

/**
 * TRANSFORMS
 */
const transformObject = (data: any[]): Dictionary<Idioma> =>
  isEmpty(data) ? {} : keyBy(data, 'langcode');
