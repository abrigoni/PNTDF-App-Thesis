import React, {useRef, useState} from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/core';

import {ConfiguracionSelectors} from '@/redux/ConfiguracionSlice';
import {SenderosSelectors} from '@/redux/SenderosSlice';
import {
  EmergenciasActions,
  EmergenciasSelectors,
} from '@/redux/EmergenciasSlice';

import I18n from '@/languages/i18n';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Colors, Images} from '@/theme';
import {CameraOptions, launchCamera} from 'react-native-image-picker/src/index';

import MapboxGL from '@rnmapbox/maps';
import Circle from '@turf/circle';
import {Position} from '@turf/helpers';

import {AppHeaderOption} from '@/components/ui/AppHeader/AppHeader';
import BaseMap from '@/components/ui/BaseMap';
import EmergencyHeader from '@/components/Emergencias/EmergencyHeader';
// todo move to UI
import MapReferenceBlock from '@/components/Senderos/MapReferenceBlock';
import BaseAppScreen from '@/containers/BaseAppScreen';
import {Routes} from '@/navigation/types';

const circleCalc = Circle([0, 0], 0.385, {
  units: 'kilometers',
  properties: {foo: 'bar'},
});

let update = 2;

const EmergenciaScreen: React.FC = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const senderos = useSelector(SenderosSelectors.getSenderos);
  const idioma = useSelector(ConfiguracionSelectors.getIdiomaSeleccionado);
  const puntoRegistrado = useSelector(EmergenciasSelectors.getPuntoRegistrado);

  const cameraRef = useRef<MapboxGL.Camera | null>(null);

  const [shape, setShape] = useState(circleCalc);
  const [userPos, setUserPos] = useState<Position>();
  const [userInMap, setUserInMap] = useState<Position>();

  const galleryBtn: AppHeaderOption = {
    icon: 'images',
    onPress: () => navigation.navigate(Routes.EMERGENCIA_GALERIA),
  };

  const showPointInMap = () => {
    if (!puntoRegistrado) {
      return null;
    }
    cameraRef.current?.flyTo(
      puntoRegistrado.geojson.geometry.coordinates,
      2000,
    );
    setTimeout(() => cameraRef.current?.zoomTo(13, 500), 2000);
  };

  const onUserLocationUpdate = (location: MapboxGL.Location) => {
    const pos: Position = [location.coords.longitude, location.coords.latitude];
    setUserPos(pos);
    if (update === 2) {
      const circle = Circle(pos, 0.37, {
        units: 'kilometers',
        properties: {foo: 'bar'},
      });
      setShape(circle);
      update = 0;
    }
    update++;
    if (!userInMap) {
      setUserInMap(pos);
    }
  };

  const showUserInMap = (): void => {
    if (!userPos) {
      return;
    }
    cameraRef.current?.flyTo(userPos, 2000);
    setTimeout(() => cameraRef.current?.zoomTo(13, 500), 2000);
  };

  const registrarPunto = () => {
    if (userPos) {
      dispatch(EmergenciasActions.agregarPuntoRegistrado(userPos));
      setTimeout(showPointInMap, 350);
    }
  };

  const eliminarPunto = () => {
    dispatch(EmergenciasActions.eliminarPuntoRegistrado());
  };

  const openCamera = () => {
    let options: CameraOptions = {
      mediaType: 'photo',
      maxHeight: 1000,
      maxWidth: 1000,
      quality: 1,
      saveToPhotos: true,
    };
    launchCamera(options, response => {
      if (!response?.assets) {
        if (response.didCancel) {
          console.log('User cancelled camera picker');
        } else if (response.errorCode) {
          console.log(response.errorCode, response.errorMessage);
        }
        return;
      }

      dispatch(
        EmergenciasActions.agregarFotografia(response?.assets[0].uri ?? ''),
      );
    });
  };

  return (
    <BaseAppScreen
      title={I18n.t('Emergencias', {locale: idioma})}
      headerProps={{options: [galleryBtn]}}>
      <View style={styles.container}>
        <EmergencyHeader
          emergencyPoint={puntoRegistrado}
          onCameraPress={openCamera}
          onNewPointPress={registrarPunto}
          onDeletePointPress={eliminarPunto}
        />
        <View style={styles.container}>
          <BaseMap
            cameraRef={cameraRef}
            cameraProps={{
              zoomLevel: 13,
              centerCoordinate: puntoRegistrado
                ? puntoRegistrado.geojson.geometry.coordinates
                : userInMap,
            }}
            userCircleShape={shape}
            onUserLocationUpdate={onUserLocationUpdate}>
            {Object.values(senderos).map(trail => {
              if (trail.geojson && trail.puntosAcceso) {
                return (
                  <View key={trail.id}>
                    <MapboxGL.ShapeSource
                      id={`trail-${trail.id}`}
                      shape={trail.geojson}>
                      <MapboxGL.LineLayer
                        id={`trail-${trail.id}`}
                        style={{
                          lineDasharray: [1, 2],
                          lineColor: Colors.trailLine,
                          lineWidth: 3,
                          lineJoin: 'round',
                          lineCap: 'round',
                        }}
                      />
                    </MapboxGL.ShapeSource>
                    <MapboxGL.ShapeSource
                      id={`accessPoints-${trail.id}`}
                      shape={trail.puntosAcceso}>
                      <MapboxGL.CircleLayer
                        id={`point-${trail.id}`}
                        style={{
                          circleColor: Colors.white,
                          circleRadius: 4,
                          circleStrokeColor: Colors.trailAccess,
                          circleStrokeWidth: 4,
                        }}
                      />
                    </MapboxGL.ShapeSource>
                  </View>
                );
              }
              return null;
            })}
            {puntoRegistrado ? (
              <MapboxGL.ShapeSource
                id="point-emergency"
                shape={puntoRegistrado.geojson}>
                <MapboxGL.SymbolLayer
                  id="point-emergency-icon"
                  style={{
                    iconImage: Images.puntoRegistrado,
                    iconSize: 0.65,
                    iconAllowOverlap: true,
                  }}
                />
              </MapboxGL.ShapeSource>
            ) : null}
          </BaseMap>
          <MapReferenceBlock emergency style={{bottom: 60}} />
          <View style={styles.buttonsContainer}>
            {puntoRegistrado ? (
              <Pressable
                style={[styles.buttonIcon, {backgroundColor: Colors.red}]}
                onPress={showPointInMap}>
                <Icon name="crosshairs" color={Colors.white} size={25} />
              </Pressable>
            ) : null}
            <Pressable
              style={[styles.buttonIcon, {backgroundColor: Colors.blue}]}
              onPress={showUserInMap}>
              <Icon name="map-marker-alt" color={Colors.white} size={25} />
            </Pressable>
          </View>
        </View>
      </View>
    </BaseAppScreen>
  );
};

export default EmergenciaScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonsContainer: {
    zIndex: 2,
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
  buttonIcon: {
    width: 50,
    height: 50,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
});
