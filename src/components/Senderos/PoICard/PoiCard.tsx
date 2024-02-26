import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {
  ConfiguracionActions,
  ConfiguracionSelectors,
} from '@/redux/ConfiguracionSlice';
import {Colors, Images} from '@/theme';

import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';

type PoICardProps = {
  poiID: number;
  title: string;
  image: string;
  onPress: () => void;
};

const PoICard: React.FC<PoICardProps> = ({poiID, title, image, onPress}) => {
  const puntosInteresFav = useSelector((state: any) =>
    ConfiguracionSelectors.getFavoritos(state, 'puntosInteres'),
  );
  const dispatch = useDispatch();

  const onFavPress = () => {
    dispatch(
      ConfiguracionActions.updateFavorito({
        listado: 'puntosInteres',
        id: poiID,
      }),
    );
  };

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <FastImage
        source={image ? {uri: image} : Images.senderos}
        style={styles.image}
        resizeMode="cover">
        <LinearGradient colors={Colors.darkGradient} style={styles.gradient}>
          <View style={styles.cardContent}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onFavPress}>
              <Icon
                name="heart"
                size={30}
                color={Colors.white}
                solid={puntosInteresFav.includes(poiID)}
              />
            </Pressable>
          </View>
        </LinearGradient>
      </FastImage>
    </Pressable>
  );
};

export default PoICard;

const styles = StyleSheet.create({
  card: {
    height: 185,
    backgroundColor: Colors.white,
    borderRadius: 10,
    margin: 10,
  },
  cardContent: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    borderRadius: 10,
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    flex: 1,
    fontSize: 20,
    color: Colors.white,
    fontWeight: 'bold',
  },
});
