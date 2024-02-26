import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '@/config/RootReducer';
import {put, call, select} from 'redux-saga/effects';
import {Dictionary, isEmpty, keyBy} from 'lodash';
import {isAfter, parse} from 'date-fns';
import ContenidosPDFService, {
  ContenidoPDF,
} from '@/services/ContenidosPDFService';
import {ApiResponse} from '@/services/RestApiBaseService';
import RNFetchBlob from 'react-native-blob-util';
import {Platform} from 'react-native';

type ContenidosPDFPayload = {
  contenidos: Dictionary<ContenidoPDF>;
  lang: string;
  date: string;
};

type ContenidosPDFState = {
  data: {
    [key: string]: Dictionary<ContenidoPDF> | null;
  };
  updated_at: {
    [key: string]: string | null;
  };
  fetching: boolean;
  error: boolean;
};

const initialState: ContenidosPDFState = {
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
const ContenidosPDFSlice = createSlice({
  name: 'contenidosPDF',
  initialState,
  reducers: {
    contenidosPDFFetch: (state, action: PayloadAction<string>) => {
      state.fetching = true;
      state.error = false;
    },
    contenidosPDFFetchFailure: state => {
      state.fetching = false;
      state.error = true;
    },
    contenidosPDFFetchSuccess: (
      state,
      action: PayloadAction<ContenidosPDFPayload>,
    ) => {
      const {contenidos, lang, date} = action.payload;
      state.data[lang] = {...state.data[lang], ...contenidos};
      state.updated_at[lang] = date;
      state.fetching = false;
      state.error = false;
    },
  },
});

export const ContenidosPDFActions = ContenidosPDFSlice.actions;
export const ContenidosPDFSliceName = ContenidosPDFSlice.name;

export default ContenidosPDFSlice.reducer;

/**
 * SELECTORS
 */
export const ContenidosPDFSelectors = {
  getContenidosPDF: (state: RootState): ContenidoPDF[] | null =>
    state.contenidosPDF
      ? Object.values(state.contenidosPDF.data[state.config?.idioma] ?? {})
      : null,
  getContenidosPDFBySlug: (
    state: RootState,
    slug: string,
  ): ContenidoPDF | null =>
    state.contenidosPDF?.data[state.config.idioma]?.[slug] ?? null,
  getPath: (state: RootState, slug: string): string | null =>
    state.contenidosPDF?.data[state.config.idioma]?.[slug]?.file?.path ?? null,
  getUpdatedAt: (state: RootState) =>
    state.contenidosPDF?.updated_at[state.config.idioma] ?? false,
  isFeching: (state: RootState) => state.contenidosPDF?.fetching ?? false,
  hasError: (state: RootState) => state.contenidosPDF?.error ?? false,
};

/**
 * SAGAS
 */
function* getContenidosPDF(
  api: ContenidosPDFService,
  action: PayloadAction<string>,
) {
  try {
    const oldData: ContenidoPDF[] = yield select(
      ContenidosPDFSelectors.getContenidosPDF,
    );
    const updated_at: string = yield select(
      ContenidosPDFSelectors.getUpdatedAt,
    );
    const lang: string = action.payload;

    const response: ApiResponse<ContenidoPDF> = yield call(
      api.getContenidos,
      lang,
      updated_at,
    );
    const downloadedData: any[] = yield downloadFiles(
      response.data.data,
      oldData,
      updated_at,
    );
    const tData: Dictionary<ContenidoPDF> = transformObject(downloadedData);

    /* console.warn(tData); */
    if (!isEmpty(tData)) {
      const date = new Date().toISOString();
      yield put(
        ContenidosPDFActions.contenidosPDFFetchSuccess({
          contenidos: tData,
          lang,
          date,
        }),
      );
    }
  } catch (error) {
    yield put(ContenidosPDFActions.contenidosPDFFetchFailure());
  }
}
export const ContenidosPDFSagas = {getContenidosPDF};

/**
 * TRANSFORMS
 */
const downloadFiles = async (
  newData: ContenidoPDF[],
  oldData: ContenidoPDF[],
  lastUpdate: string,
): Promise<any[]> => {
  const dLastUpdate = new Date(lastUpdate);

  const filtered = newData.filter(contenido => {
    if (contenido?.file?.Modificacion && dLastUpdate) {
      const fileUpdated = parse(
        contenido.file.Modificacion,
        'yyyy-MM-dd HH:mm:ss',
        new Date(),
      );

      /* console.log(fileUpdated, dLastUpdate, contenido.slug); */

      // Si el documento de la api se modificó después de la última descarga
      if (isAfter(fileUpdated, dLastUpdate)) {
        const oldContenido = oldData.filter(
          item => item.slug == contenido.slug,
        )?.[0];

        if (oldContenido?.file?.path) {
          // Elimino el archivo físico anterior
          RNFetchBlob.fs
            .unlink(oldContenido.file.path)
            .then(() => {
              /* console.log(
                oldContenido.slug,
                oldContenido.file.path,
                ' pdf removed',
              ); */
            })
            .catch(error => {
              console.log(error);
            });
        }
        // Lo mantengo en el arreglo para su descarga
        return true;
      }

      // No se modificó, por lo tanto no se descarga
      return false;
    }

    // Es la primera carga de contenidos
    return true;
  });

  await Promise.all(
    filtered.map(async contenido => {
      let newContent: ContenidoPDF = {...contenido};

      await RNFetchBlob.config({fileCache: true, appendExt: 'pdf'})
        .fetch('GET', contenido.file.url)
        .then(res => {
          /* console.log('Se descargó: ', contenido.slug); */
          newContent.file.path =
            (Platform.OS == 'android' ? 'file://' : '') + res.path();
        })
        .catch(error => {
          console.log(error);
        });

      return newContent;
    }),
  );

  return filtered;
};

const transformObject = (data: any[]): Dictionary<ContenidoPDF> =>
  isEmpty(data) ? {} : keyBy(data, 'slug');
