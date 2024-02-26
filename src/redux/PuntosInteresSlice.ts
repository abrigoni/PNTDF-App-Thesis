import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '@/config/RootReducer';
import {put, call, select} from 'redux-saga/effects';
import {Dictionary, isEmpty, keyBy} from 'lodash';
import {format} from 'date-fns';
import PuntosInteresService, {
  PuntoInteres,
} from '@/services/PuntosInteresService';
import {ApiResponse} from '@/services/RestApiBaseService';

type PuntosInteresPayload = {
  data: Dictionary<PuntoInteres>;
  lang: string;
};

type PuntosInteresState = {
  data: {
    [key: string]: Dictionary<PuntoInteres> | null;
  };
  updated_at: {
    [key: string]: string | null;
  };
  fetching: boolean;
  error: boolean;
};

const initialState: PuntosInteresState = {
  data: {es: null, en: null},
  updated_at: {es: null, en: null},
  fetching: false,
  error: false,
};

/**
 * SLICE
 */
const PuntosInteresSlice = createSlice({
  name: 'puntosInteres',
  initialState,
  reducers: {
    puntosInteresFetch: (state, action: PayloadAction<string>) => {
      state.fetching = true;
      state.error = false;
    },
    puntosInteresFetchFailure: state => {
      state.fetching = false;
      state.error = true;
    },
    puntosInteresFetchSuccess: (
      state,
      action: PayloadAction<PuntosInteresPayload>,
    ) => {
      const {data, lang} = action.payload;
      state.data[lang] = data;
      state.updated_at[lang] = format(new Date(), 'yyyy-MM-dd');
      state.fetching = false;
      state.error = false;
    },
  },
});

export const PuntosInteresActions = PuntosInteresSlice.actions;
export const PuntosInteresSliceName = PuntosInteresSlice.name;

export default PuntosInteresSlice.reducer;

/**
 * SELECTORS
 */
export const PuntosInteresSelectors = {
  getPuntosInteres: (state: RootState): Dictionary<PuntoInteres> =>
    state.puntosInteres.data[state.config?.idioma] ?? {},
  getPuntoInteresByID: (state: RootState, id: number): PuntoInteres | null =>
    state.puntosInteres?.data[state.config?.idioma]?.[id] ?? null,
  getUpdatedAt: (state: RootState) =>
    state.puntosInteres?.updated_at[state.config.idioma] ?? false,
  isFeching: (state: RootState) => state.puntosInteres?.fetching ?? false,
  hasError: (state: RootState) => state.puntosInteres?.error ?? false,
};

/**
 * SAGAS
 */
function* getPuntosInteres(
  api: PuntosInteresService,
  action: PayloadAction<string>,
) {
  try {
    const updated_at: string = yield select(
      PuntosInteresSelectors.getUpdatedAt,
    );
    const lang: string = action.payload;
    const response: ApiResponse<PuntoInteres> = yield call(
      api.getPuntosInteres,
      lang,
      updated_at,
    );

    const tData = transformObject(response.data.data);
    yield put(
      PuntosInteresActions.puntosInteresFetchSuccess({data: tData, lang}),
    );
  } catch (error) {
    yield put(PuntosInteresActions.puntosInteresFetchFailure());
  }
}
export const PuntosInteresSagas = {getPuntosInteres};

/**
 * TRANSFORMS
 */
const transformObject = (data: any[]): Dictionary<PuntoInteres> =>
  isEmpty(data)
    ? {}
    : keyBy(
        data.map<PuntoInteres>(({imagenes, lat, lng, ...item}) => {
          return {
            imagenPrincipal: imagenes?.shift(),
            imagenes,
            geojson: {
              type: 'Feature',
              properties: {
                id: item.id,
              },
              geometry: {
                type: 'Point',
                coordinates: [lng, lat, 0.0],
              },
            },
            ...item,
          };
        }),
        'id',
      );
