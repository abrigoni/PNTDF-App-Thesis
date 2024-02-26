import {takeLatest, all, spawn, ForkEffect} from 'redux-saga/effects';
import config from '@/config/ConfigVariables';
import codePush, {CodePushOptions} from 'react-native-code-push';
import codePushSaga from 'react-native-code-push-saga';
import i18n from '@/languages/i18n';
import {codepushStatusListener} from '@/features/AppUpdate/AppUpdateUtils';
import EspeciesService from '@/services/EspeciesService';
import ImagenesService from '@/services/ImagenesService';
import SenderosService from '@/services/SenderosService';
import PuntosInteresService from '@/services/PuntosInteresService';
import RecomendacionesService from '@/services/RecomendacionesService';
import IdiomasService from '@/services/IdiomasService';
import {EspeciesActions, EspeciesSagas} from '@/redux/EspeciesSlice';
import {
  PuntosInteresActions,
  PuntosInteresSagas,
} from '@/redux/PuntosInteresSlice';
import {IdiomasActions, IdiomasSagas} from '@/redux/IdiomasSlice';
import {SenderosActions, SenderosSagas} from '@/redux/SenderosSlice';
import {ImagenesActions, ImagenesSagas} from '@/redux/ImagenesSlice';
import {
  RecomendacionesActions,
  RecomendacionesSagas,
} from '@/redux/RecomendacionesSlice';
import CategoriasService from '@/services/CategoriasService';
import DificultadesService from '@/services/DificultadesService';
import LogosService from '@/services/LogosService';
import {CategoriasActions, CategoriasSagas} from '@/redux/CategoriasSlice';
import {
  DificultadesActions,
  DificultadesSagas,
} from '@/redux/DificultadesSlice';
import {LogosActions, LogosSagas} from '@/redux/LogosSlice';
import {
  ContenidosPDFActions,
  ContenidosPDFSagas,
} from '@/redux/ContenidosPDFSlice';
import ContenidosPDFService from '@/services/ContenidosPDFService';

const idiomasService = new IdiomasService();
const senderosService = new SenderosService();
const puntosInteresService = new PuntosInteresService();
const especiesService = new EspeciesService();
const imagenesService = new ImagenesService();
const recomendacionesService = new RecomendacionesService();
const categoriasService = new CategoriasService();
const dificultadesService = new DificultadesService();
const logosService = new LogosService();
const contenidosPDFService = new ContenidosPDFService();

export default function* rootSaga() {
  let rootSagas: ForkEffect[] = [
    takeLatest(
      IdiomasActions.idiomasFetch,
      IdiomasSagas.getIdiomas,
      idiomasService,
    ),
    takeLatest(
      SenderosActions.senderosFetch,
      SenderosSagas.getSenderos,
      senderosService,
    ),
    takeLatest(
      PuntosInteresActions.puntosInteresFetch,
      PuntosInteresSagas.getPuntosInteres,
      puntosInteresService,
    ),
    takeLatest(
      EspeciesActions.especiesFetch,
      EspeciesSagas.getEspecies,
      especiesService,
    ),
    takeLatest(
      ContenidosPDFActions.contenidosPDFFetch,
      ContenidosPDFSagas.getContenidosPDF,
      contenidosPDFService,
    ),
    takeLatest(
      ImagenesActions.imagenesFetch,
      ImagenesSagas.getImagenes,
      imagenesService,
    ),
    takeLatest(
      RecomendacionesActions.recomendacionesFetch,
      RecomendacionesSagas.getRecomendaciones,
      recomendacionesService,
    ),
    takeLatest(
      CategoriasActions.categoriasFetch,
      CategoriasSagas.getCategorias,
      categoriasService,
    ),
    takeLatest(
      DificultadesActions.dificultadesFetch,
      DificultadesSagas.getDificultades,
      dificultadesService,
    ),
    takeLatest(LogosActions.logosFetch, LogosSagas.getLogos, logosService),
  ];

  // codepush saga
  if (!__DEV__ || (__DEV__ && config.CODEPUSH_ENABLED_IN_DEV)) {
    const syncOptions: CodePushOptions = {
      checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
      deploymentKey: config.CODEPUSH_DEPLOYMENT_KEY,
      installMode: codePush.InstallMode.IMMEDIATE,
      mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
      updateDialog: {
        descriptionPrefix: i18n.t('codepush.descriptionPrefix'),
        mandatoryContinueButtonLabel: i18n.t(
          'codepush.mandatoryContinueButtonLabel',
        ),
        mandatoryUpdateMessage: i18n.t('codepush.mandatoryUpdateMessage'),
        optionalIgnoreButtonLabel: i18n.t('codepush.optionalIgnoreButtonLabel'),
        optionalInstallButtonLabel: i18n.t(
          'codepush.optionalInstallButtonLabel',
        ),
        optionalUpdateMessage: i18n.t('codepush.optionalUpdateMessage'),
        title: i18n.t('codepush.title'),
      },
    };
    rootSagas = rootSagas.concat([
      // https://github.com/Microsoft/react-native-code-push/blob/master/docs/api-js.md#codepushoptions
      spawn(codePushSaga, {
        syncOptions,
        codePushStatusDidChange: codepushStatusListener,
      }),
    ]);
  }

  yield all(rootSagas);
}
