import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '@/config/RootReducer';

export type ListadoFav = 'senderos' | 'especies' | 'puntosInteres';

type FavoritoPayload = {
  id: number;
  listado: ListadoFav;
};

type ConfiguracionState = {
  favoritos: {
    [key: string]: number[];
  };
  requestIdioma: boolean;
  idioma: string;
};

const initialState: ConfiguracionState = {
  favoritos: {
    especies: [],
    senderos: [],
    puntosInteres: [],
  },
  requestIdioma: true,
  idioma: 'es',
};

/**
 * SLICE
 */
const ConfiguracionSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    updateFavorito: (state, action: PayloadAction<FavoritoPayload>) => {
      const {listado, id} = action.payload;
      const favs = state.favoritos[listado];
      if (!favs.includes(id)) {
        state.favoritos[listado] = [...favs, id];
      } else {
        state.favoritos[listado] = favs.filter(item => item !== id);
      }
    },
    disableRequestIdioma: state => {
      state.requestIdioma = false;
    },
    updateIdioma: (state, action: PayloadAction<string>) => {
      state.idioma = action.payload;
    },
  },
});

export const ConfiguracionActions = ConfiguracionSlice.actions;
export const ConfiguracionSliceName = ConfiguracionSlice.name;

export default ConfiguracionSlice.reducer;

/**
 * SELECTORS
 */
export const ConfiguracionSelectors = {
  getFavoritos: (state: RootState, listado: ListadoFav): number[] =>
    state.config.favoritos[listado],
  getIdiomaSeleccionado: (state: RootState): string => state.config.idioma,
  getRequestIdioma: (state: RootState): boolean => state.config.requestIdioma,
  isFav: (state: RootState, listado: ListadoFav, id: number): boolean =>
    state.config.favoritos[listado]?.[id] ? true : false,
};

/**
 * SAGAS
 */

/**
 * TRANSFORMS
 */
