import React, {useState} from 'react';
import {Text, View, Pressable} from 'react-native';
import {useSelector} from 'react-redux';

import {ConfiguracionSelectors} from '@/redux/ConfiguracionSlice';
import {PuntoEmergencia} from '@/redux/EmergenciasSlice';

import {Colors} from '@/theme';
import styles from './styles';

import I18n from '@/languages/i18n';
import Icon from 'react-native-vector-icons/FontAwesome5';

type EmergencyHeaderProps = {
  emergencyPoint: PuntoEmergencia | null;
  onCameraPress: () => void;
  onNewPointPress: () => void;
  onDeletePointPress: () => void;
};

const EmergencyHeader: React.FC<EmergencyHeaderProps> = ({
  emergencyPoint,
  onCameraPress,
  onNewPointPress,
  onDeletePointPress,
}) => {
  const idioma = useSelector(ConfiguracionSelectors.getIdiomaSeleccionado);
  const [expanded, setExpanded] = useState<boolean>(true);

  const invertExpanded = () => {
    setExpanded(!expanded);
  };

  const renderButton = (icon: string, text: string, action: () => void) => {
    return (
      <Pressable style={styles.btn} onPress={action}>
        <Icon
          name={icon}
          size={21}
          color={Colors.white}
          style={styles.btnIcon}
        />
        <Text style={styles.btnText}>{I18n.t(text, {locale: idioma})}</Text>
      </Pressable>
    );
  };

  const renderInfo = () => {
    if (!expanded) {
      return (
        <Pressable
          style={[styles.hide, {backgroundColor: Colors.blue}]}
          onPress={invertExpanded}>
          <Icon name="info" color={Colors.white} size={25} />
        </Pressable>
      );
    }

    return (
      <View style={[styles.header, {backgroundColor: Colors.blue}]}>
        <Pressable
          style={styles.btnHide}
          hitSlop={{bottom: 15, left: 15, right: 15, top: 15}}
          onPress={invertExpanded}>
          <Icon name="times" size={25} color={Colors.white} />
        </Pressable>
        <Text style={styles.text}>
          {I18n.t('InfoHeaderEmergency', {locale: idioma})}
        </Text>
        <View style={styles.btnContainer}>
          {renderButton('map-pin', 'GPS', onNewPointPress)}
          <View style={{width: 30}} />
          {renderButton('camera', 'Cámara', onCameraPress)}
        </View>
      </View>
    );
  };

  const renderEmergency = () => {
    if (!expanded) {
      return (
        <Pressable
          style={[styles.hide, {backgroundColor: Colors.red}]}
          onPress={invertExpanded}>
          <Icon name="map-pin" color={Colors.white} size={25} />
        </Pressable>
      );
    }

    return (
      <View style={[styles.header, {backgroundColor: Colors.red}]}>
        <Pressable
          style={styles.btnHide}
          hitSlop={{bottom: 15, left: 15, right: 15, top: 15}}
          onPress={invertExpanded}>
          <Icon name="times" size={25} color={Colors.white} />
        </Pressable>
        <View style={styles.emergencyContent}>
          <Icon
            name="map-pin"
            size={50}
            color={Colors.white}
            style={{marginHorizontal: 20}}
          />
          <View>
            <Text style={styles.title}>
              {I18n.t('Posición registrada', {locale: idioma})}
            </Text>
            <Text style={styles.coords}>
              [{emergencyPoint?.geojson.geometry.coordinates[0]},{' '}
              {emergencyPoint?.geojson.geometry.coordinates[1]}]
            </Text>
            <Text style={styles.date}>
              {I18n.t('Fecha', {locale: idioma})}: {emergencyPoint?.fecha_str}
            </Text>
          </View>
        </View>
        <View style={styles.btnContainer}>
          {renderButton('map-pin', 'Quitar punto', onDeletePointPress)}
          <View style={{width: 30}} />
          {renderButton('camera', 'Cámara', onCameraPress)}
        </View>
      </View>
    );
  };

  if (emergencyPoint) {
    return renderEmergency();
  }
  return renderInfo();
};

export default EmergencyHeader;
