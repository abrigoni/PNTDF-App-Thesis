import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {
  ConfiguracionActions,
  ConfiguracionSelectors,
} from '@/redux/ConfiguracionSlice';
import {Colors} from '@/theme';

import Icon from 'react-native-vector-icons/FontAwesome5';

type SpeciesHeaderProps = {
  speciesID: number;
  title: string;
  subtitle: string;
};

const SpeciesHeader: React.FC<SpeciesHeaderProps> = ({
  speciesID,
  title,
  subtitle,
}) => {
  const dispatch = useDispatch();
  const especiesFav = useSelector((state: any) =>
    ConfiguracionSelectors.getFavoritos(state, 'especies'),
  );

  const onFavPress = () => {
    dispatch(
      ConfiguracionActions.updateFavorito({
        listado: 'especies',
        id: speciesID,
      }),
    );
  };

  return (
    <View style={styles.rowContainer}>
      <View>
        <Text style={styles.title}>{title.toUpperCase()}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <Pressable onPress={onFavPress}>
        <Icon
          name="heart"
          size={30}
          color={Colors.white}
          solid={especiesFav.includes(speciesID)}
        />
      </Pressable>
    </View>
  );
};

export default SpeciesHeader;

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    fontStyle: 'italic',
    color: 'white',
  },
});
