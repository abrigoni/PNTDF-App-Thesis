import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/core';
import {useSelector} from 'react-redux';

import {ImagenesSelectors} from '@/redux/ImagenesSlice';
import {PuntosInteresSelectors} from '@/redux/PuntosInteresSlice';
import {SenderosSelectors} from '@/redux/SenderosSlice';

import {Colors} from '@/theme';

import BaseMap from '@/components/ui/BaseMap';
import MapReferenceBlock from '@/components/Senderos/MapReferenceBlock';
import PoICard from '@/components/Senderos/PoICard';
import BaseAppScreen from '@/containers/BaseAppScreen';
import MapboxGL from '@rnmapbox/maps';

type routeParamsProps = {id: number};

const SenderosMapScreen: React.FC = props => {
  const route = useRoute();
  const senderoID = (route.params as routeParamsProps).id;
  const navigation = useNavigation();

  const [showPoI, setShowPoI] = useState<boolean>(false);
  const [selectedPoI, setSelectedPoI] = useState<number | null>(null);

  const imagenes = useSelector(ImagenesSelectors.getImagenes);
  const senderos = useSelector(SenderosSelectors.getSenderos);
  const sendero = senderos[senderoID];
  const puntosInteres = useSelector(PuntosInteresSelectors.getPuntosInteres);

  const goTo = (screenName: any, screenParams?: any) => () => {
    navigation.navigate(screenName, screenParams);
  };

  const onPoIPress = (poi: number) => () => {
    setSelectedPoI(poi);
    setShowPoI(true);
  };

  const onMapPress = () => {
    setSelectedPoI(null);
    setShowPoI(false);
  };

  if (!sendero?.geojson?.bbox || !sendero?.puntosAcceso) {
    return null;
  }

  return (
    <BaseAppScreen title={sendero?.nombre}>
      <BaseMap
        mapViewProps={{onPress: onMapPress}}
        cameraProps={{
          bounds: {
            ne: [sendero.geojson.bbox[0], sendero.geojson.bbox[1]],
            sw: [sendero.geojson.bbox[2], sendero.geojson.bbox[3]],
            paddingBottom: 50,
            paddingTop: 50,
            paddingLeft: 50,
            paddingRight: 50,
          },
        }}>
        {Object.values(senderos).map(trail => {
          if (trail.geojson && trail.puntosAcceso) {
            return (
              <View key={trail.id}>
                <MapboxGL.ShapeSource
                  id={`trailSource-${trail.id}`}
                  shape={trail.geojson}>
                  <MapboxGL.LineLayer
                    id={`trail-${trail.id}`}
                    style={{
                      lineDasharray: [1, 2],
                      lineColor:
                        sendero.id == trail.id
                          ? Colors.trailLine
                          : Colors.trailLineDisabled,
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
                      circleStrokeColor:
                        sendero.id == trail.id
                          ? Colors.trailAccess
                          : Colors.trailAccessDisabled,
                      circleStrokeWidth: 4,
                    }}
                  />
                </MapboxGL.ShapeSource>
              </View>
            );
          }
          return null;
        })}
        {sendero.pois.map(point => {
          const punto = puntosInteres[point];
          if (punto?.geojson) {
            return (
              <MapboxGL.ShapeSource
                key={`${punto.id}`}
                id={`poiShape-${punto.id}`}
                shape={punto.geojson}
                onPress={onPoIPress(punto.id)}>
                <MapboxGL.CircleLayer
                  id={`poi-${punto.id}`}
                  style={{
                    circleColor: Colors.trailPoI,
                    circleRadius: 6,
                    circleStrokeColor: Colors.white,
                    circleStrokeWidth: 2,
                  }}
                />
              </MapboxGL.ShapeSource>
            );
          }
          return null;
        })}
      </BaseMap>
      <MapReferenceBlock style={{top: 100}} />
      {showPoI && selectedPoI ? (
        <View style={styles.cardContainer}>
          <PoICard
            poiID={selectedPoI}
            title={puntosInteres[selectedPoI].nombre}
            image={
              imagenes[puntosInteres[selectedPoI].imagenPrincipal].large_url
            }
            onPress={goTo('PUNTO_INTERES_DETALLE', {id: selectedPoI})}
          />
        </View>
      ) : null}
    </BaseAppScreen>
  );
};

export default SenderosMapScreen;

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    padding: 20,
  },
});
