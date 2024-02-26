import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useSelector} from 'react-redux';

import {ConfiguracionSelectors} from '@/redux/ConfiguracionSlice';
import {CategoriasSelectors} from '@/redux/CategoriasSlice';
import {EspeciesSelectors} from '@/redux/EspeciesSlice';

import {Especie} from '@/services/EspeciesService';

import I18n from '@/languages/i18n';
import {Colors} from '@/theme';
import {isEmpty, orderBy, pipe} from 'lodash/fp';

import ListItemSeparator from './ListItemSeparator';
import SpeciesCard from './SpeciesCard';

type SpeciesListProps = {
  speciesID: number[];
};

const SpeciesList: React.FC<SpeciesListProps> = ({speciesID}) => {
  const navigation = useNavigation();
  const idioma = useSelector(ConfiguracionSelectors.getIdiomaSeleccionado);
  const categorias = useSelector(CategoriasSelectors.getCategorias);
  const especies = useSelector(EspeciesSelectors.getEspecies);

  const goTo = (screenName: any, screenParams?: any) => () => {
    navigation.navigate(screenName, screenParams);
  };

  const orderSpecies = (): Especie[] => {
    let orderedSpe = speciesID.map(id => especies[id]);
    return pipe(orderBy(['orden', 'nombre'], ['asc', 'asc']))(orderedSpe);
  };

  if (isEmpty(speciesID)) {
    return null;
  }

  return (
    <View style={styles.listContainer}>
      <ListItemSeparator
        title={I18n.t('Especies que podrías ver', {
          locale: idioma,
        }).toUpperCase()}
        icon="binoculars"
      />
      {orderSpecies().map(especie => (
        <SpeciesCard
          key={especie.id}
          speciesID={especie.id}
          title={especie.nombre}
          subtitle={especie.nombre_cientifico}
          description={especie.resumen}
          category={categorias[especie.categoria]}
          image={especie.imagenPrincipal}
          onPress={goTo('ESPECIE_DETALLE', {id: especie.id})}
        />
      ))}
    </View>
  );
};

export default SpeciesList;

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: Colors.background,
  },
});
