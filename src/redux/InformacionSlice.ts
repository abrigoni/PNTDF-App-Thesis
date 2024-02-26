import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '@/config/RootReducer';
import {put, call, select} from 'redux-saga/effects';
import {Dictionary, isEmpty, keyBy} from 'lodash';
import {format} from 'date-fns';
import InformacionService, {BloqueInfo} from '@/services/InformacionService';
import {ApiResponse} from '@/services/RestApiBaseService';

type InformacionPayload = {
  bloquesInfo: Dictionary<BloqueInfo>;
  lang: string;
};

type InformacionState = {
  data: {
    [key: string]: Dictionary<BloqueInfo> | null;
  };
  updated_at: {
    [key: string]: string | null;
  };
  fetching: boolean;
  error: boolean;
};

const initialState: InformacionState = {
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
const InformacionSlice = createSlice({
  name: 'informacion',
  initialState,
  reducers: {
    informacionFetch: state => {
      state.fetching = true;
      state.error = false;
    },
    informacionFetchFailure: state => {
      state.fetching = false;
      state.error = true;
    },
    informacionFetchSuccess: (
      state,
      action: PayloadAction<InformacionPayload>,
    ) => {
      const {bloquesInfo, lang} = action.payload;
      state.data[lang] = bloquesInfo;
      state.updated_at[lang] = format(new Date(), 'yyyy-MM-dd');
      state.fetching = false;
      state.error = false;
    },
  },
});

export const InformacionActions = InformacionSlice.actions;
export const InformacionSliceName = InformacionSlice.name;

export default InformacionSlice.reducer;

/**
 * SELECTORS
 */
export const InformacionSelectors = {
  getInformacion: (state: RootState): BloqueInfo[] | null =>
    state.informacion
      ? Object.values(state.informacion.data[state.config?.idioma] ?? {})
      : null,
  getInformacionByID: (state: RootState, id: number): BloqueInfo | null =>
    state.informacion?.data[state.config.idioma]?.[id] ?? null,
  getUpdatedAt: (state: RootState) =>
    state.informacion?.updated_at[state.config.idioma] ?? false,
  isFeching: (state: RootState) => state.informacion?.fetching ?? false,
  hasError: (state: RootState) => state.informacion?.error ?? false,
};

/**
 * SAGAS
 */
function* getInformacion(
  api: InformacionService,
  action: PayloadAction<string>,
) {
  try {
    const updated_at: string = yield select(InformacionSelectors.getUpdatedAt);
    const lang: string = action.payload;
    const response: ApiResponse<BloqueInfo> = yield call(
      api.getInformacion,
      lang,
      updated_at,
    );
    const tData = transformObject(response.data.data);
    yield put(
      InformacionActions.informacionFetchSuccess({
        bloquesInfo: tData,
        lang,
      }),
    );
  } catch (error) {
    yield put(InformacionActions.informacionFetchFailure());
  }
}
export const InformacionSagas = {getInformacion};

/**
 * TRANSFORMS
 */
const transformObject = (data: any[]): Dictionary<BloqueInfo> =>
  isEmpty(data) ? {} : keyBy(data, 'id');
