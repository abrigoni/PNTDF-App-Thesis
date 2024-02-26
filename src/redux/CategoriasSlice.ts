import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '@/config/RootReducer';
import {put, call, select} from 'redux-saga/effects';
import {Dictionary, isEmpty, keyBy} from 'lodash';
import {format} from 'date-fns';
import CategoriasService, {Categoria} from '@/services/CategoriasService';
import {ApiResponse} from '@/services/RestApiBaseService';
import {ConfiguracionSelectors} from './ConfiguracionSlice';

type CategoriasPayload = {
  data: Dictionary<Categoria>;
  lang: string;
};

type CategoriasState = {
  data: {
    [key: string]: Dictionary<Categoria> | null;
  };
  updated_at: {
    [key: string]: string | null;
  };
  fetching: boolean;
  error: boolean;
};

const initialState: CategoriasState = {
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
const CategoriasSlice = createSlice({
  name: 'categorias',
  initialState,
  reducers: {
    categoriasFetch: state => {
      state.fetching = true;
      state.error = false;
    },
    categoriasFetchFailure: state => {
      state.fetching = false;
      state.error = true;
    },
    categoriasFetchSuccess: (
      state,
      action: PayloadAction<CategoriasPayload>,
    ) => {
      const {data, lang} = action.payload;
      state.data[lang] = data;
      state.updated_at[lang] = format(new Date(), 'yyyy-MM-dd');
      state.fetching = false;
      state.error = false;
    },
  },
});

export const CategoriasActions = CategoriasSlice.actions;
export const CategoriasSliceName = CategoriasSlice.name;

export default CategoriasSlice.reducer;

/**
 * SELECTORS
 */
export const CategoriasSelectors = {
  getCategorias: (state: RootState): Dictionary<Categoria> =>
    state.categorias?.data[state.config.idioma] ?? {},
  getCategoriaByID: (state: RootState, id: number): Categoria | null =>
    state.categorias?.data[state.config.idioma]?.[id] ?? null,
  getUpdatedAt: (state: RootState) =>
    state.categorias?.updated_at[state.config.idioma] ?? false,
  isFeching: (state: RootState) => state.categorias?.fetching ?? false,
  hasError: (state: RootState) => state.categorias?.error ?? false,
};

/**
 * SAGAS
 */
function* getCategorias(api: CategoriasService) {
  try {
    const updated_at: string = yield select(CategoriasSelectors.getUpdatedAt);
    const lang: string = yield select(
      ConfiguracionSelectors.getIdiomaSeleccionado,
    );
    const response: ApiResponse<Categoria> = yield call(
      api.getCategorias,
      lang,
      updated_at,
    );
    const tData = transformObject(response.data.data);
    yield put(CategoriasActions.categoriasFetchSuccess({data: tData, lang}));
  } catch (error) {
    yield put(CategoriasActions.categoriasFetchFailure());
  }
}
export const CategoriasSagas = {getCategorias};

/**
 * TRANSFORMS
 */
const transformObject = (data: any[]): Dictionary<Categoria> =>
  isEmpty(data) ? {} : keyBy(data, 'id');
