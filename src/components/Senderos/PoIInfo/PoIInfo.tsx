import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import I18n from '@/languages/i18n';

import Icon from 'react-native-vector-icons/FontAwesome5';
import {Dificultad} from '@/services/DificultadesService';
import {
  ConfiguracionActions,
  ConfiguracionSelectors,
} from '@/redux/ConfiguracionSlice';
import {Colors} from '@/theme';

export type PoIInfoProps = {
  poiID: number;
  title: string;
};

const PoIInfo: React.FC<PoIInfoProps> = ({poiID, title}) => {
  const idioma = useSelector(ConfiguracionSelectors.getIdiomaSeleccionado);
  const puntosInteresFav = useSelector((state: any) =>
    ConfiguracionSelectors.getFavoritos(state, 'puntosInteres'),
  );

  const dispatch = useDispatch();

  const onFavPress = () => {
    dispatch(
      ConfiguracionActions.updateFavorito({
        listado: 'senderos',
        id: poiID,
      }),
    );
  };

  return (
    <View style={styles.rowContent}>
      <Text textBreakStrategy="simple" style={styles.title}>
        {title}
      </Text>
      <Pressable onPress={onFavPress}>
        <Icon
          name="heart"
          size={30}
          color={Colors.white}
          solid={puntosInteresFav.includes(poiID)}
        />
      </Pressable>
    </View>
  );
};

export default PoIInfo;

const styles = StyleSheet.create({
  rowContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingRight: 30,
  },
  title: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: 'bold',
  },
});
