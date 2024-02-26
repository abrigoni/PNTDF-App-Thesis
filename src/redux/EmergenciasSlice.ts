import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '@/config/RootReducer';
import {format} from 'date-fns';
import {Position} from '@turf/helpers';
import {orderBy} from 'lodash';

export type PuntoEmergencia = {
  fecha: string;
  fecha_str: string;
  geojson: GeoJSON.Feature<GeoJSON.Point>;
};

export type ImagenEmergencia = {
  fecha: string;
  fecha_str: string;
  ruta: string;
};

type EmergenciasState = {
  puntoRegistrado: PuntoEmergencia | null;
  fotografias: ImagenEmergencia[];
};

const initialState: EmergenciasState = {
  puntoRegistrado: null,
  fotografias: [],
};

/**
 * SLICE
 */
const EmergenciasSlice = createSlice({
  name: 'emergencias',
  initialState,
  reducers: {
    agregarPuntoRegistrado: (state, action: PayloadAction<Position>) => {
      const now = new Date();
      const fecha = now.toISOString();
      const fecha_str = format(now, 'dd/MM/yyyy - HH:mm');
      const coords = action.payload;
      const punto: PuntoEmergencia = {
        geojson: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [coords[0], coords[1], 0.0],
          },
        },
        fecha,
        fecha_str,
      };
      state.puntoRegistrado = punto;
    },
    eliminarPuntoRegistrado: state => {
      state.puntoRegistrado = null;
    },
    agregarFotografia: (state, action: PayloadAction<string>) => {
      const now = new Date();
      const fecha = now.toISOString();
      const fecha_str = format(now, 'dd/MM/yyyy - HH:mm');
      const fotografia = {
        fecha,
        fecha_str,
        ruta: action.payload,
      };
      state.fotografias = [...state.fotografias, fotografia];
    },
    eliminarFotografia: (state, action: PayloadAction<string>) => {
      const images = state.fotografias;
      state.fotografias = images.filter(e => e.ruta != action.payload);
    },
  },
});

export const EmergenciasActions = EmergenciasSlice.actions;
export const EmergenciasSliceName = EmergenciasSlice.name;

export default EmergenciasSlice.reducer;

/**
 * SELECTORS
 */
export const EmergenciasSelectors = {
  getFotografias: (state: RootState): ImagenEmergencia[] =>
    orderBy(state.emergencias?.fotografias, ['fecha'], ['desc']),
  getPuntoRegistrado: (state: RootState): PuntoEmergencia | null =>
    state.emergencias?.puntoRegistrado,
};

/**
 * SAGAS
 */

/**
 * TRANSFORMS
 */
