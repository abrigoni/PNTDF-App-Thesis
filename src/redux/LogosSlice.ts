import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '@/config/RootReducer';
import {put, call, select} from 'redux-saga/effects';
import {Dictionary, isEmpty, keyBy} from 'lodash';
import {format} from 'date-fns';
import LogosService, {Logo} from '@/services/LogosService';
import {ApiResponse} from '@/services/RestApiBaseService';
import {ConfiguracionSelectors} from './ConfiguracionSlice';

type LogosPayload = {
  data: Dictionary<Logo>;
  lang: string;
};

type LogosState = {
  data: {
    [key: string]: Dictionary<Logo> | null;
  };
  updated_at: {
    [key: string]: string | null;
  };
  fetching: boolean;
  error: boolean;
};

const initialState: LogosState = {
  data: {es: null, en: null},
  updated_at: {es: null, en: null},
  fetching: false,
  error: false,
};

/**
 * SLICE
 */
const LogosSlice = createSlice({
  name: 'logos',
  initialState,
  reducers: {
    logosFetch: state => {
      state.fetching = true;
      state.error = false;
    },
    logosFetchFailure: state => {
      state.fetching = false;
      state.error = true;
    },
    logosFetchSuccess: (state, action: PayloadAction<LogosPayload>) => {
      const {data, lang} = action.payload;
      state.data[lang] = data;
      state.updated_at[lang] = format(new Date(), 'yyyy-MM-dd');
      state.fetching = false;
      state.error = false;
    },
  },
});

export const LogosActions = LogosSlice.actions;
export const LogosSliceName = LogosSlice.name;

export default LogosSlice.reducer;

/**
 * SELECTORS
 */
export const LogosSelectors = {
  getLogos: (state: RootState): Logo[] | null =>
    state.logos
      ? Object.values(state.logos.data[state.config?.idioma] ?? {})
      : null,
  getLogoByID: (state: RootState, id: number): Logo | null =>
    state.logos?.data[state.config.idioma]?.[id] ?? null,
  getUpdatedAt: (state: RootState) =>
    state.logos?.updated_at[state.config.idioma] ?? false,
  isFeching: (state: RootState) => state.logos?.fetching ?? false,
  hasError: (state: RootState) => state.logos?.error ?? false,
};

/**
 * SAGAS
 */
function* getLogos(api: LogosService) {
  try {
    const updated_at: string = yield select(LogosSelectors.getUpdatedAt);
    const lang: string = yield select(
      ConfiguracionSelectors.getIdiomaSeleccionado,
    );
    const response: ApiResponse<Logo> = yield call(
      api.getLogos,
      lang,
      updated_at,
    );
    const tData = transformObject(response.data.data);
    yield put(LogosActions.logosFetchSuccess({data: tData, lang}));
  } catch (error) {
    yield put(LogosActions.logosFetchFailure());
  }
}
export const LogosSagas = {getLogos};

/**
 * TRANSFORMS
 */
const transformObject = (data: any[]): Dictionary<Logo> =>
  isEmpty(data) ? {} : keyBy(data, 'id');
