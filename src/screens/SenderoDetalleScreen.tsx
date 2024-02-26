import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/core';
import {useSelector} from 'react-redux';
import {DificultadesSelectors} from '@/redux/DificultadesSlice';
import {SenderosSelectors} from '@/redux/SenderosSlice';
import {PuntosInteresSelectors} from '@/redux/PuntosInteresSlice';
import ParallaxAppScreen from '@/containers/ParallaxAppScreen';
import TrailInfo, {isLate} from '@/components/Senderos/TrailInfo';
import Description from '@/components/Senderos/Description';
import Gallery from '@/components/Senderos/Gallery';
import TrailMapCard from '@/components/Senderos/TrailMapCard';
import SpeciesList from '@/components/Senderos/SpeciesList';
import Recommendations from '@/components/Senderos/Recommendations';
import ModalAlert from '@/components/ui/ModalAlert';
import {Colors} from '@/theme';
import {ConfiguracionSelectors} from '@/redux/ConfiguracionSlice';
import I18n from '@/languages/i18n';
import {isEmpty} from 'lodash';

type routeParamsProps = {id: number};

const SenderoDetalleScreen = (props: any) => {
  const route = useRoute();
  const navigation = useNavigation();

  const idioma = useSelector(ConfiguracionSelectors.getIdiomaSeleccionado);
  const dificultades = useSelector(DificultadesSelectors.getDificultades);
  const puntosInteres = useSelector(PuntosInteresSelectors.getPuntosInteres);
  const sendero = useSelector((state: any) =>
    SenderosSelectors.getSenderoByID(
      state,
      (route.params as routeParamsProps).id,
    ),
  );

  const goTo = (screenName: any, screenParams?: any) => () => {
    navigation.navigate(screenName, screenParams);
  };

  if (!sendero) {
    return null;
  }

  const [modalVisible, setModalVisible] = useState<boolean>(
    isLate(sendero.duracion),
  );

  const closeModal = () => {
    setModalVisible(false);
  };

  const getPoIs = () => {
    if (isEmpty(puntosInteres)) {
      return [];
    }
    return sendero.pois.map(poiID => puntosInteres[poiID]);
  };

  return (
    <ParallaxAppScreen
      title={sendero.nombre}
      parallaxImage={sendero.imagenPrincipal}
      headerComponent={
        <View style={styles.headerContainer}>
          <TrailInfo
            trailID={sendero.id}
            title={sendero.nombre}
            difficulty={dificultades[sendero.dificultad]}
            distance={sendero.longitud}
            time={sendero.duracion}
            open={sendero.habilitado}
          />
        </View>
      }>
      <ModalAlert visible={modalVisible} onClose={closeModal} />
      {sendero.autorizacion ? (
        <View style={styles.authContainer}>
          <Text style={styles.authLabel}>
            {I18n.t('Requiere registro previo', {lang: idioma})}
          </Text>
        </View>
      ) : null}
      <Recommendations options={sendero.recomendaciones} />
      <Description resume={sendero.resumen} content={sendero.descripcion} />
      {sendero.geojson && sendero.puntosAcceso ? (
        <TrailMapCard
          trail={sendero.geojson}
          accessPoints={sendero.puntosAcceso}
          pois={getPoIs()}
          onAmplifyPress={goTo('SENDERO_MAPA', {id: sendero.id})}
        />
      ) : null}
      <Gallery imagesID={sendero.imagenes} />
      <SpeciesList speciesID={sendero.especies} />
    </ParallaxAppScreen>
  );
};

export default SenderoDetalleScreen;

const styles = StyleSheet.create({
  headerContainer: {
    padding: 25,
  },
  authContainer: {
    flex: 1,
    backgroundColor: Colors.red,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  authLabel: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
