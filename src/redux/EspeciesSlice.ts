import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '@/config/RootReducer';
import {put, call, select} from 'redux-saga/effects';
import {Dictionary, isEmpty, keyBy} from 'lodash';
import {format} from 'date-fns';
import EspeciesService, {Especie} from '@/services/EspeciesService';
import {ApiResponse} from '@/services/RestApiBaseService';

type EspeciesPayload = {
  data: Dictionary<Especie>;
  lang: string;
};

type EspeciesState = {
  data: {
    [key: string]: Dictionary<Especie> | null;
  };
  updated_at: {
    [key: string]: string | null;
  };
  fetching: boolean;
  error: boolean;
};

const initialState: EspeciesState = {
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
const EspeciesSlice = createSlice({
  name: 'especies',
  initialState,
  reducers: {
    especiesFetch: (state, action: PayloadAction<string>) => {
      state.fetching = true;
      state.error = false;
    },
    especiesFetchFailure: state => {
      state.fetching = false;
      state.error = true;
    },
    especiesFetchSuccess: (state, action: PayloadAction<EspeciesPayload>) => {
      const {data, lang} = action.payload;
      state.data[lang] = data;
      state.updated_at[lang] = format(new Date(), 'yyyy-MM-dd');
      state.fetching = false;
      state.error = false;
    },
  },
});

export const EspeciesActions = EspeciesSlice.actions;
export const EspeciesSliceName = EspeciesSlice.name;

export default EspeciesSlice.reducer;

/**
 * SELECTORS
 */
export const EspeciesSelectors = {
  getEspecies: (state: RootState): Dictionary<Especie> =>
    state.especies?.data[state.config.idioma] ?? {},
  getEspecieByID: (state: RootState, id: number): Especie | null =>
    state.especies?.data[state.config.idioma]?.[id] ?? null,
  getUpdatedAt: (state: RootState) =>
    state.especies?.updated_at[state.config.idioma] ?? false,
  isFeching: (state: RootState) => state.especies?.fetching ?? false,
  hasError: (state: RootState) => state.especies?.error ?? false,
};

/**
 * SAGAS
 */
function* getEspecies(api: EspeciesService, action: PayloadAction<string>) {
  try {
    const updated_at: string = yield select(EspeciesSelectors.getUpdatedAt);
    const lang: string = action.payload;
    const response: ApiResponse<Especie> = yield call(
      api.getEspecies,
      lang,
      updated_at,
    );
    const tData = transformObject(response.data.data);
    yield put(EspeciesActions.especiesFetchSuccess({data: tData, lang}));
  } catch (error) {
    yield put(EspeciesActions.especiesFetchFailure());
  }
}
export const EspeciesSagas = {getEspecies};

/**
 * TRANSFORMS
 */
const transformObject = (data: any[]): Dictionary<Especie> =>
  isEmpty(data)
    ? {}
    : keyBy(
        data.map<Especie>(({imagenes, ...item}) => {
          return {
            imagenPrincipal: imagenes?.shift(),
            imagenes,
            ...item,
          };
        }),
        'id',
      );
