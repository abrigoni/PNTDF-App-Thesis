import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '@/config/RootReducer';
import {put, call, select} from 'redux-saga/effects';
import {Dictionary, isEmpty, keyBy} from 'lodash';
import {format} from 'date-fns';
import SenderosService, {Sendero} from '@/services/SenderosService';
import {ApiResponse} from '@/services/RestApiBaseService';
import {FeatureCollection, Feature, Point} from 'geojson';
import {Position} from '@turf/helpers';
import bbox from '@turf/bbox';

type SenderosPayload = {
  data: Dictionary<Sendero>;
  lang: string;
};

type SenderosState = {
  data: {
    [key: string]: Dictionary<Sendero> | null;
  };
  updated_at: {
    [key: string]: string | null;
  };
  fetching: boolean;
  error: boolean;
};

const initialState: SenderosState = {
  data: {es: null, en: null},
  updated_at: {es: null, en: null},
  fetching: false,
  error: false,
};

/**
 * SLICE
 */
const SenderosSlice = createSlice({
  name: 'senderos',
  initialState,
  reducers: {
    senderosFetch: (state, action: PayloadAction<string>) => {
      state.fetching = true;
      state.error = false;
    },
    senderosFetchFailure: state => {
      state.fetching = false;
      state.error = true;
    },
    senderosFetchSuccess: (state, action: PayloadAction<SenderosPayload>) => {
      const {data, lang} = action.payload;
      state.data[lang] = data;
      state.updated_at[lang] = format(new Date(), 'yyyy-MM-dd');
      state.fetching = false;
      state.error = false;
    },
  },
});

export const SenderosActions = SenderosSlice.actions;
export const SenderosSliceName = SenderosSlice.name;

export default SenderosSlice.reducer;

/**
 * SELECTORS
 */
export const SenderosSelectors = {
  getSenderos: (state: RootState): Dictionary<Sendero> =>
    state.senderos?.data[state.config.idioma] ?? {},
  getSenderoByID: (state: RootState, id: number): Sendero | null =>
    state.senderos?.data[state.config.idioma]?.[id] ?? null,
  getUpdatedAt: (state: RootState) =>
    state.senderos?.updated_at[state.config.idioma] ?? false,
  isFeching: (state: RootState) => state.senderos?.fetching ?? false,
  hasError: (state: RootState) => state.senderos?.error ?? false,
};

/**
 * SAGAS
 */
function* getSenderos(api: SenderosService, action: PayloadAction<string>) {
  try {
    const updated_at: string = yield select(SenderosSelectors.getUpdatedAt);
    const lang: string = action.payload;
    const response: ApiResponse<Sendero> = yield call(
      api.getSenderos,
      lang,
      updated_at,
    );
    const tData = transformObject(response.data.data);
    yield put(SenderosActions.senderosFetchSuccess({data: tData, lang}));
  } catch (error) {
    console.log(error);
    yield put(SenderosActions.senderosFetchFailure());
  }
}
export const SenderosSagas = {getSenderos};

/**
 * TRANSFORMS
 */
const getPoint = (coords: Position[], pos: number): Feature<Point> => {
  return {
    properties: null,
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [coords[pos][0], coords[pos][1]],
    },
  };
};

const getAccessPoints = (features: Feature[]): FeatureCollection<Point> => {
  let puntosAcceso: FeatureCollection<Point> = {
    type: 'FeatureCollection',
    features: [],
  };

  if (!features) {
    return puntosAcceso;
  }

  features.forEach(feature => {
    if (feature?.geometry?.type === 'LineString') {
      puntosAcceso.features.push(getPoint(feature.geometry.coordinates, 0));
      puntosAcceso.features.push(
        getPoint(
          feature.geometry.coordinates,
          feature.geometry.coordinates.length - 1,
        ),
      );
    } else if (feature.geometry.type === 'MultiLineString') {
      feature.geometry.coordinates.forEach(itemGeo => {
        puntosAcceso.features.push(getPoint(itemGeo, 0));
        puntosAcceso.features.push(getPoint(itemGeo, itemGeo.length - 1));
      });
    }
  });

  return puntosAcceso;
};

const transformObject = (data: any[]): Dictionary<Sendero> =>
  isEmpty(data)
    ? {}
    : keyBy(
        data.map<Sendero>(({geojson, poi, imagenes, ...item}) => {
          geojson = JSON.parse(geojson);
          if (geojson?.features) {
            geojson.bbox = bbox(geojson.features[0]);
          }
          return {
            ...item,
            imagenPrincipal: imagenes?.shift(),
            puntosAcceso: getAccessPoints(geojson?.features),
            imagenes,
            geojson,
            pois: poi,
          };
        }),
        'id',
      );
