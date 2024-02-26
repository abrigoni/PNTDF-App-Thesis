import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import config from '@/config/ConfigVariables';
// import {useFCMNotifications} from '@/features/FCM/FCMService';
import FastImage, {Source} from 'react-native-fast-image';
import MapboxGL from '@rnmapbox/maps';
MapboxGL.setAccessToken(config.MAPBOX_ACCESS_TOKEN);

import SplashScreen from '@/screens/SplashScreen';
import AppUpdatingScreen from '@/features/AppUpdate/AppUpdatingScreen';

import {ImagenesActions, ImagenesSelectors} from '@/redux/ImagenesSlice';

import {SenderosActions} from '@/redux/SenderosSlice';
import {PuntosInteresActions} from '@/redux/PuntosInteresSlice';
import {ConfiguracionSelectors} from '@/redux/ConfiguracionSlice';
import {RecomendacionesActions} from '@/redux/RecomendacionesSlice';
import {IdiomasActions} from '@/redux/IdiomasSlice';
import {EspeciesActions} from '@/redux/EspeciesSlice';
import {CategoriasActions} from '@/redux/CategoriasSlice';
import {DificultadesActions} from '@/redux/DificultadesSlice';
import {InformacionActions} from '@/redux/InformacionSlice';

import AppNavigator from './AppNavigator';
import {ContenidosPDFActions} from '@/redux/ContenidosPDFSlice';
import {Imagen} from '@/services/ImagenesService';
import {Dictionary} from 'lodash';
import { loadModel } from '@/ml-model/ImageClassifier';

const MainStack = createNativeStackNavigator();

const forFade = ({current}: any) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const loadMap = async () => {
  MapboxGL.setTelemetryEnabled(false);
  const offlinePack = await MapboxGL.offlineManager.getPack('ParqueTDF');
  if (offlinePack == undefined) {
    await MapboxGL.offlineManager.createPack({
      name: 'ParqueTDF',
      styleURL: config.MAPBOX_STYLE_URL,
      minZoom: 11,
      maxZoom: 13,
      bounds: [
        [-68.32, -54.741],
        [-68.61, -54.9],
      ],
    });
  }
};

const preloadImages = (images: Dictionary<Imagen>) => {
  let imagesUris: Source[] = [];

  if (images) {
    let values = Object.values(images);
    values.forEach(imagen => {
      /* imagesUris.push({uri: imagen.thumb_url}); */
      imagesUris.push({uri: imagen.large_url});
    });
  }

  // if (logos) {
  //   logos.forEach((logo) => {
  //     imagesUris.push({uri: logo.thumb_url});
  //     imagesUris.push({uri: logo.large_url});
  //   });
  // }

  FastImage.preload(imagesUris);
};

const MainNavigator: React.FC = () => {
  // useFCMNotifications();

  const idioma = useSelector(ConfiguracionSelectors.getIdiomaSeleccionado);
  const images = useSelector(ImagenesSelectors.getImagenes);
  // const logos = useSelector(LogosSelectors.getLogos);
  const dispatch = useDispatch();

  useEffect(() => {
    loadMap();
    preloadImages(images);
    loadModel();
  }, []);

  useEffect(() => {
    dispatch(IdiomasActions.idiomasFetch(idioma));
    dispatch(CategoriasActions.categoriasFetch());
    dispatch(DificultadesActions.dificultadesFetch());
    dispatch(InformacionActions.informacionFetch());
    dispatch(SenderosActions.senderosFetch(idioma));
    dispatch(PuntosInteresActions.puntosInteresFetch(idioma));
    dispatch(EspeciesActions.especiesFetch(idioma));
    dispatch(ImagenesActions.imagenesFetch(idioma));
    dispatch(RecomendacionesActions.recomendacionesFetch(idioma));
    dispatch(ContenidosPDFActions.contenidosPDFFetch(idioma));
    /* dispatch(LogosActions.logosFetch()); */
  }, []);

  return (
    <MainStack.Navigator
      initialRouteName="SPLASH"
      screenOptions={{cardStyleInterpolator: forFade, headerShown: false}}>
      <MainStack.Screen name="SPLASH" component={SplashScreen} />
      <MainStack.Screen name="APP_UPDATING" component={AppUpdatingScreen} />
      <MainStack.Screen name="APP_NAVIGATOR" component={AppNavigator} />
    </MainStack.Navigator>
  );
};

export default MainNavigator;
