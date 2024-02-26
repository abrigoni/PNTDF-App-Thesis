import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';

import {ImagenesSelectors} from '@/redux/ImagenesSlice';
import {ApplicationStyles, Colors, Images} from '@/theme';

import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

import TrailInfo, {TrailInfoProps} from '@/components/Senderos/TrailInfo';
import I18n from '@/languages/i18n';
import {ConfiguracionSelectors} from '@/redux/ConfiguracionSlice';

type TrailCardProps = {
  authorization: boolean;
  background: number | null;
  onPress: () => void;
};

const TrailCard: React.FC<TrailCardProps & TrailInfoProps> = ({
  authorization,
  background,
  onPress,
  ...props
}) => {
  const idioma = useSelector(ConfiguracionSelectors.getIdiomaSeleccionado);
  const imagen = background
    ? useSelector((state: any) =>
        ImagenesSelectors.getImagenByID(state, background),
      )
    : null;

  return (
    <View style={styles.card}>
      <Pressable style={{flex: 1}} onPress={onPress}>
        <FastImage
          source={imagen ? {uri: imagen.large_url} : Images.senderos}
          style={styles.image}
          resizeMode="cover">
          {authorization ? (
            <View style={styles.auth}>
              <Text style={styles.authLabel}>
                {I18n.t('Requiere registro previo', {lang: idioma})}
              </Text>
            </View>
          ) : null}
          <LinearGradient colors={Colors.darkGradient} style={styles.content}>
            <TrailInfo {...props} />
          </LinearGradient>
        </FastImage>
      </Pressable>
    </View>
  );
};

export default TrailCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 200,
    flexDirection: 'row',
    margin: 10,
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: Colors.white,
    ...ApplicationStyles.shadow,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 15,
  },
  image: {
    backgroundColor: Colors.white,
    ...ApplicationStyles.shadow,
    flex: 1,
    borderRadius: 10,
  },
  auth: {
    alignItems: 'center',
    backgroundColor: Colors.red,
    paddingVertical: 6,
  },
  authLabel: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
