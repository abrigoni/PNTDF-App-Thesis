import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {
  ConfiguracionActions,
  ConfiguracionSelectors,
} from '@/redux/ConfiguracionSlice';
import {ImagenesSelectors} from '@/redux/ImagenesSlice';
import {Categoria} from '@/services/CategoriasService';

import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';

import {ApplicationStyles, Colors, Images} from '@/theme';

type SpeciesCardProps = {
  speciesID: number;
  title: string;
  subtitle: string;
  description: string;
  image: number | null;
  category: Categoria;
  onPress: () => void;
};

const SpeciesCard: React.FC<SpeciesCardProps> = ({
  speciesID,
  title,
  subtitle,
  description,
  image,
  category,
  onPress,
}) => {
  const dispatch = useDispatch();
  const especiesFav = useSelector((state: any) =>
    ConfiguracionSelectors.getFavoritos(state, 'especies'),
  );
  const imagen = image
    ? useSelector((state: any) => ImagenesSelectors.getImagenByID(state, image))
    : null;

  const [lines, setLines] = useState<number>(5);

  const onFavPress = () => {
    dispatch(
      ConfiguracionActions.updateFavorito({
        listado: 'especies',
        id: speciesID,
      }),
    );
  };

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.cardImage}>
        <FastImage
          source={imagen ? {uri: imagen.large_url} : Images.senderos}
          style={styles.image}
          resizeMode="cover">
          <LinearGradient colors={Colors.lightGradient} style={{flex: 1}} />
          <View style={styles.categoryContainer}>
            <Text style={styles.category}>{category.nombre.toUpperCase()}</Text>
            <Pressable onPress={onFavPress}>
              <Icon
                name="heart"
                size={30}
                color={Colors.white}
                solid={especiesFav.includes(speciesID)}
              />
            </Pressable>
          </View>
        </FastImage>
      </View>
      <View style={styles.cardInfo}>
        <View
          onLayout={props => {
            const {height} = props.nativeEvent.layout;
            const lines = Math.trunc(((180 - Math.trunc(height)) * 5) / 137);

            if (height > 44) {
              setLines(lines);
            }
          }}>
          <Text style={styles.title}>{title.toUpperCase()}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={{flex: 1}}>
          <Text
            numberOfLines={lines}
            style={styles.text}
            textBreakStrategy="simple">
            {description}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default SpeciesCard;

const styles = StyleSheet.create({
  card: {
    ...ApplicationStyles.shadow,
    flex: 1,
    flexDirection: 'row',
    height: 180,
    margin: 10,
    borderRadius: 5,
    backgroundColor: Colors.white,
  },
  cardImage: {
    flex: 1,
    width: 180,
  },
  cardInfo: {
    flex: 1,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    padding: 15,
    paddingBottom: 10,
  },
  image: {
    ...ApplicationStyles.shadow,
    flex: 1,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  categoryContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    paddingHorizontal: 10,
  },
  category: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.white,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  text: {
    flex: 1,
    paddingTop: 10,
    fontSize: 13,
    lineHeight: 20,
  },
});
