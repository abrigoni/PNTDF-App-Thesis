import React, {MutableRefObject} from 'react';
import MapboxGL, {
  // CameraProps,
  MapViewProps,
} from '@rnmapbox/maps';
import config from '@/config/ConfigVariables';
import {Geometry, Feature, FeatureCollection, GeoJsonProperties} from 'geojson';

type BaseMapProps = {
  cameraRef?: MutableRefObject<MapboxGL.Camera | null>;
  userCircleShape?:
    | Geometry
    | Feature<Geometry, GeoJsonProperties>
    | FeatureCollection<Geometry, GeoJsonProperties>;
  cameraProps?: any;
  mapViewProps?: MapViewProps;
  onUserLocationUpdate?: (location: MapboxGL.Location) => void;
  children?: any;
};

const BaseMap: React.FC<BaseMapProps> = ({
  cameraRef,
  userCircleShape,
  onUserLocationUpdate,
  cameraProps,
  mapViewProps,
  children,
}) => {
  return (
    <MapboxGL.MapView
      style={{flex: 1}}
      styleURL={config.MAPBOX_STYLE_URL}
      {...mapViewProps}>
      <MapboxGL.Camera
        ref={cameraRef}
        minZoomLevel={1}
        maxZoomLevel={15}
        bounds={{ne: [-68.61, -54.9], sw: [-68.32, -54.741]}}
        {...cameraProps}
        /* maxBounds={{ne: [-68.32, -54.741], sw: [-68.61, -54.9]}} */
        /* maxBounds={{ne: [-68.61, -54.90], sw: [-68.32, -54.741]}} */
      />
      <MapboxGL.UserLocation
        visible={true}
        onUpdate={onUserLocationUpdate}
        renderMode="normal">
        <MapboxGL.CircleLayer
          id="innerCircle"
          sourceLayerID="innerCircle"
          style={{
            circleColor: '#187384',
            circleRadius: 7,
            circleStrokeColor: 'white',
            circleStrokeWidth: 2,
          }}
        />
      </MapboxGL.UserLocation>
      {userCircleShape ? (
        <MapboxGL.ShapeSource id="circleShapeSource" shape={userCircleShape}>
          <MapboxGL.FillLayer
            id="outerCircle"
            sourceLayerID="outerCircle"
            belowLayerID="innerCircle"
            style={{
              fillColor: 'lightblue',
              fillOpacity: 0.45,
            }}
          />
          <MapboxGL.LineLayer
            id="dashedLine"
            sourceLayerID="dashedLine"
            style={{
              lineDasharray: [2, 2],
              lineColor: '#187384',
              lineWidth: 2,
            }}
          />
        </MapboxGL.ShapeSource>
      ) : null}
      {children}
    </MapboxGL.MapView>
  );
};

export default BaseMap;
