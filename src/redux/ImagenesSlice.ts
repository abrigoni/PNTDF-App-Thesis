import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '@/config/RootReducer';
import {put, call, select} from 'redux-saga/effects';
import {Dictionary, isEmpty, keyBy} from 'lodash';
import {format} from 'date-fns';
import ImagenesService, {Imagen} from '@/services/ImagenesService';
import {ApiResponse} from '@/services/RestApiBaseService';

type ImagenesPayload = {
  data: Dictionary<Imagen>;
  lang: string;
};

type ImagenesState = {
  data: {
    [key: string]: Dictionary<Imagen> | null;
  };
  updated_at: {
    [key: string]: string | null;
  };
  fetching: boolean;
  error: boolean;
};

const initialState: ImagenesState = {
  data: {es: null, en: null},
  updated_at: {es: null, en: null},
  fetching: false,
  error: false,
};

/**
 * SLICE
 */
const ImagenesSlice = createSlice({
  name: 'imagenes',
  initialState,
  reducers: {
    imagenesFetch: (state, action: PayloadAction<string>) => {
      state.fetching = true;
      state.error = false;
    },
    imagenesFetchFailure: state => {
      state.fetching = false;
      state.error = true;
    },
    imagenesFetchSuccess: (state, action: PayloadAction<ImagenesPayload>) => {
      const {data, lang} = action.payload;
      state.data[lang] = data;
      state.updated_at[lang] = format(new Date(), 'yyyy-MM-dd');
      state.fetching = false;
      state.error = false;
    },
  },
});

export const ImagenesActions = ImagenesSlice.actions;
export const ImagenesSliceName = ImagenesSlice.name;

export default ImagenesSlice.reducer;

/**
 * SELECTORS
 */
export const ImagenesSelectors = {
  getImagenes: (state: RootState): Dictionary<Imagen> =>
    state.imagenes?.data[state.config?.idioma] ?? {},
  getImagenByID: (state: RootState, id: number): Imagen | null =>
    state.imagenes?.data[state.config.idioma]?.[id] ?? null,
  getUpdatedAt: (state: RootState) =>
    state.imagenes?.updated_at[state.config.idioma] ?? false,
  isFeching: (state: RootState) => state.imagenes?.fetching ?? false,
  hasError: (state: RootState) => state.imagenes?.error ?? false,
};

/**
 * SAGAS
 */
function* getImagenes(api: ImagenesService, action: PayloadAction<string>) {
  try {
    const updated_at: string = yield select(ImagenesSelectors.getUpdatedAt);
    const lang: string = action.payload;
    const response: ApiResponse<Imagen> = yield call(
      api.getImagenes,
      lang,
      updated_at,
    );
    const tData = transformObject(response.data.data);
    yield put(ImagenesActions.imagenesFetchSuccess({data: tData, lang}));
  } catch (error) {
    yield put(ImagenesActions.imagenesFetchFailure());
  }
}
export const ImagenesSagas = {getImagenes};

/**
 * TRANSFORMS
 */
const transformObject = (data: any[]): Dictionary<Imagen> =>
  isEmpty(data) ? {} : keyBy(data, 'id');
