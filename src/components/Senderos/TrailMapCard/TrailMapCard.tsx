import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Pressable,
} from 'react-native';
import {useSelector} from 'react-redux';
import I18n from '@/languages/i18n';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {ConfiguracionSelectors} from '@/redux/ConfiguracionSlice';
import MapboxGL from '@rnmapbox/maps';
import BaseMap from '@/components/ui/BaseMap';
import {PuntoInteres} from '@/services/PuntosInteresService';
import {Colors} from '@/theme';

type TrailMapCardProps = {
  trail: GeoJSON.FeatureCollection<GeoJSON.LineString>;
  pois: PuntoInteres[];
  accessPoints: GeoJSON.FeatureCollection<GeoJSON.Point>;
  style?: StyleProp<ViewStyle>;
  onAmplifyPress?: () => void;
};

const TrailMapCard: React.FC<TrailMapCardProps> = ({
  trail,
  pois,
  accessPoints,
  style,
  onAmplifyPress,
}) => {
  const idioma = useSelector(ConfiguracionSelectors.getIdiomaSeleccionado);

  return (
    <View style={{height: 250, zIndex: -1}}>
      <BaseMap
        cameraProps={{
          bounds: trail.bbox
            ? {
                ne: [trail.bbox[0], trail.bbox[1]],
                sw: [trail.bbox[2], trail.bbox[3]],
                paddingBottom: 50,
                paddingTop: 50,
                paddingLeft: 50,
                paddingRight: 50,
              }
            : undefined,
        }}>
        <MapboxGL.ShapeSource id="trailSource" shape={trail}>
          <MapboxGL.LineLayer
            id="trail"
            style={{
              lineDasharray: [1, 2],
              lineColor: Colors.trailLine,
              lineWidth: 3,
              lineJoin: 'round',
              lineCap: 'round',
            }}
          />
        </MapboxGL.ShapeSource>
        <MapboxGL.ShapeSource id="accessPoints" shape={accessPoints}>
          <MapboxGL.CircleLayer
            id="point"
            style={{
              circleColor: Colors.white,
              circleRadius: 4,
              circleStrokeColor: Colors.trailAccess,
              circleStrokeWidth: 4,
            }}
          />
        </MapboxGL.ShapeSource>
        {pois.map(punto => (
          <MapboxGL.ShapeSource
            key={`${punto.id}`}
            id={`poiShape-${punto.id}`}
            shape={punto.geojson}>
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
        ))}
      </BaseMap>
      {onAmplifyPress ? (
        <Pressable style={styles.mapBtn} onPress={onAmplifyPress}>
          <View style={styles.labelMapContainer}>
            <Text style={styles.labelMapBtn}>
              {I18n.t('Ampliar', {locale: idioma}).toUpperCase()}
            </Text>
            <Icon name="search-plus" size={20} color={Colors.darkGrey} />
          </View>
        </Pressable>
      ) : null}
    </View>
  );
};

export default TrailMapCard;

const styles = StyleSheet.create({
  mapBtn: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255,255,255, 0.4)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderColor: Colors.white,
    borderWidth: 2,
    borderRadius: 4,
  },
  labelMapBtn: {
    textAlignVertical: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.darkGrey,
    marginRight: 5,
  },
  labelMapContainer: {
    flexDirection: 'row',
  },
});
