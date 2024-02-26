import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '@/config/RootReducer';
import {put, call, select} from 'redux-saga/effects';
import {Dictionary, isEmpty, keyBy} from 'lodash';
import {format} from 'date-fns';
import DificultadesService, {Dificultad} from '@/services/DificultadesService';
import {ApiResponse} from '@/services/RestApiBaseService';
import {ConfiguracionSelectors} from './ConfiguracionSlice';

type DificultadesPayload = {
  data: Dictionary<Dificultad>;
  lang: string;
};

type DificultadesState = {
  data: {
    [key: string]: Dictionary<Dificultad> | null;
  };
  updated_at: {
    [key: string]: string | null;
  };
  fetching: boolean;
  error: boolean;
};

const initialState: DificultadesState = {
  data: {es: null, en: null},
  updated_at: {es: null, en: null},
  fetching: false,
  error: false,
};

/**
 * SLICE
 */
const DificultadesSlice = createSlice({
  name: 'dificultades',
  initialState,
  reducers: {
    dificultadesFetch: state => {
      state.fetching = true;
      state.error = false;
    },
    dificultadesFetchFailure: state => {
      state.fetching = false;
      state.error = true;
    },
    dificultadesFetchSuccess: (
      state,
      action: PayloadAction<DificultadesPayload>,
    ) => {
      const {data, lang} = action.payload;
      state.data[lang] = data;
      state.updated_at[lang] = format(new Date(), 'yyyy-MM-dd');
      state.fetching = false;
      state.error = false;
    },
  },
});

export const DificultadesActions = DificultadesSlice.actions;
export const DificultadesSliceName = DificultadesSlice.name;

export default DificultadesSlice.reducer;

/**
 * SELECTORS
 */
export const DificultadesSelectors = {
  getDificultades: (state: RootState): Dictionary<Dificultad> =>
    state.dificultades?.data[state.config.idioma] ?? {},
  getDificultadByID: (state: RootState, id: number): Dificultad | null =>
    state.dificultades?.data[state.config.idioma]?.[id] ?? null,
  getUpdatedAt: (state: RootState) =>
    state.dificultades?.updated_at[state.config.idioma] ?? false,
  isFeching: (state: RootState) => state.dificultades?.fetching ?? false,
  hasError: (state: RootState) => state.dificultades?.error ?? false,
};

/**
 * SAGAS
 */
function* getDificultades(api: DificultadesService) {
  try {
    const updated_at: string = yield select(DificultadesSelectors.getUpdatedAt);
    const lang: string = yield select(
      ConfiguracionSelectors.getIdiomaSeleccionado,
    );
    const response: ApiResponse<Dificultad> = yield call(
      api.getDificultades,
      lang,
      updated_at,
    );
    const tData = transformObject(response.data.data);
    yield put(
      DificultadesActions.dificultadesFetchSuccess({data: tData, lang}),
    );
  } catch (error) {
    yield put(DificultadesActions.dificultadesFetchFailure());
  }
}
export const DificultadesSagas = {getDificultades};

/**
 * TRANSFORMS
 */
const transformObject = (data: any[]): Dictionary<Dificultad> =>
  isEmpty(data) ? {} : keyBy(data, 'id');
