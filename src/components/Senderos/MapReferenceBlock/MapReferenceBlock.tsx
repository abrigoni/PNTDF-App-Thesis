import React from 'react';
import {Text, View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useSelector} from 'react-redux';
import I18n from '@/languages/i18n';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {ConfiguracionSelectors} from '@/redux/ConfiguracionSlice';
import {ApplicationStyles} from '@/theme';

type MapReferenceBlockProps = {
  emergency?: boolean;
  style?: StyleProp<ViewStyle>;
};

const MapReferenceBlock: React.FC<MapReferenceBlockProps> = ({
  emergency = false,
  style,
}) => {
  const idioma = useSelector(ConfiguracionSelectors.getIdiomaSeleccionado);

  return (
    <View style={[styles.infoContainer, style]}>
      <View style={styles.rowContainer}>
        <View style={{...styles.circle, backgroundColor: '#187384'}} />
        <Text>{I18n.t('Tu ubicación', {locale: idioma}).toUpperCase()}</Text>
      </View>
      <View style={styles.rowContainer}>
        <View
          style={{
            ...styles.circle,
            backgroundColor: 'lightblue',
            borderStyle: 'dashed',
            borderColor: '#187384',
            borderWidth: 2,
          }}
        />
        <Text>
          {I18n.t('Caminata de 10 min', {locale: idioma}).toUpperCase()}
        </Text>
      </View>
      <View style={styles.rowContainer}>
        <View
          style={{
            ...styles.circle,
            backgroundColor: 'white',
            borderColor: '#CB2F2F',
            borderWidth: 5,
          }}
        />
        <Text>{I18n.t('Punto de acceso', {locale: idioma}).toUpperCase()}</Text>
      </View>
      {emergency ? (
        <View style={styles.rowContainer}>
          <Icon
            name="crosshairs"
            color="#CB2F2F"
            size={18}
            style={{marginRight: 10}}
          />
          <Text>
            {I18n.t('Posición registrada', {locale: idioma}).toUpperCase()}
          </Text>
        </View>
      ) : (
        <View style={styles.rowContainer}>
          <View style={{...styles.circle, backgroundColor: '#CB2F2F'}} />
          <Text>
            {I18n.t('Punto de interés', {locale: idioma}).toUpperCase()}
          </Text>
        </View>
      )}
    </View>
  );
};

export default MapReferenceBlock;

const styles = StyleSheet.create({
  infoContainer: {
    ...ApplicationStyles.shadow,
    zIndex: 1,
    position: 'absolute',
    left: 0,
    backgroundColor: 'white',
    alignItems: 'flex-start',
    padding: 5,
  },
  rowContainer: {
    marginHorizontal: 5,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    borderRadius: 9,
    width: 18,
    height: 18,
    marginRight: 10,
  },
});
