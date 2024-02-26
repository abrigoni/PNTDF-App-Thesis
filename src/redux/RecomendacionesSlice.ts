import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '@/config/RootReducer';
import {put, call, select} from 'redux-saga/effects';
import {Dictionary, isEmpty, keyBy} from 'lodash';
import {format} from 'date-fns';
import RecomendacionesService, {
  Recomendacion,
} from '@/services/RecomendacionesService';
import {ApiResponse} from '@/services/RestApiBaseService';
import {ConfiguracionSelectors} from './ConfiguracionSlice';

type RecomendacionesPayload = {
  data: Dictionary<Recomendacion>;
  lang: string;
};

type RecomendacionesState = {
  data: {
    [key: string]: Dictionary<Recomendacion> | null;
  };
  updated_at: {
    [key: string]: string | null;
  };
  fetching: boolean;
  error: boolean;
};

const initialState: RecomendacionesState = {
  data: {es: null, en: null},
  updated_at: {es: null, en: null},
  fetching: false,
  error: false,
};

/**
 * SLICE
 */
const RecomendacionesSlice = createSlice({
  name: 'recomendaciones',
  initialState,
  reducers: {
    recomendacionesFetch: (state, action: PayloadAction<string>) => {
      state.fetching = true;
      state.error = false;
    },
    recomendacionesFetchFailure: state => {
      state.fetching = false;
      state.error = true;
    },
    recomendacionesFetchSuccess: (
      state,
      action: PayloadAction<RecomendacionesPayload>,
    ) => {
      const {data, lang} = action.payload;
      state.data[lang] = data;
      state.updated_at[lang] = format(new Date(), 'yyyy-MM-dd');
      state.fetching = false;
      state.error = false;
    },
  },
});

export const RecomendacionesActions = RecomendacionesSlice.actions;
export const RecomendacionesSliceName = RecomendacionesSlice.name;

export default RecomendacionesSlice.reducer;

/**
 * SELECTORS
 */
export const RecomendacionesSelectors = {
  getRecomendaciones: (state: RootState): Recomendacion[] | null =>
    state.recomendaciones
      ? Object.values(state.recomendaciones.data[state.config.idioma] ?? {})
      : null,
  getRecomendacionByID: (state: RootState, id: number): Recomendacion | null =>
    state.recomendaciones?.data[state.config.idioma]?.[id] ?? null,
  getUpdatedAt: (state: RootState) =>
    state.recomendaciones?.updated_at[state.config.idioma] ?? false,
  isFeching: (state: RootState) => state.recomendaciones?.fetching ?? false,
  hasError: (state: RootState) => state.recomendaciones?.error ?? false,
};

/**
 * SAGAS
 */
function* getRecomendaciones(api: RecomendacionesService) {
  try {
    const updated_at: string = yield select(
      RecomendacionesSelectors.getUpdatedAt,
    );
    const lang: string = yield select(
      ConfiguracionSelectors.getIdiomaSeleccionado,
    );
    const response: ApiResponse<Recomendacion> = yield call(
      api.getRecomendaciones,
      lang,
      updated_at,
    );
    const tData = transformObject(response.data.data);
    yield put(
      RecomendacionesActions.recomendacionesFetchSuccess({data: tData, lang}),
    );
  } catch (error) {
    yield put(RecomendacionesActions.recomendacionesFetchFailure());
  }
}
export const RecomendacionesSagas = {getRecomendaciones};

/**
 * TRANSFORMS
 */
const transformObject = (data: any[]): Dictionary<Recomendacion> =>
  isEmpty(data) ? {} : keyBy(data, 'id');
