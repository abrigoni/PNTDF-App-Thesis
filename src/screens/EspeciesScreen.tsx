import React from 'react';
import {SectionList, ListRenderItemInfo} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/core';
import {orderBy, pipe} from 'lodash/fp';

import {ConfiguracionSelectors} from '@/redux/ConfiguracionSlice';
import {CategoriasSelectors} from '@/redux/CategoriasSlice';
import {EspeciesSelectors} from '@/redux/EspeciesSlice';

import {Categoria} from '@/services/CategoriasService';
import {Especie} from '@/services/EspeciesService';

import I18n from '@/languages/i18n';

import EmptyContent from '@/components/ui/EmptyContent';
// move to species
import SpeciesCard from '@/components/Especies/SpeciesCard';
import ListItemSeparator from '@/components/Senderos/SpeciesList/ListItemSeparator';
import InfoHeader from '@/components/ui/InfoHeader';
import BaseAppScreen from '@/containers/BaseAppScreen';

const EspeciesScreen: React.FC = props => {
  const navigation = useNavigation();

  const idioma = useSelector(ConfiguracionSelectors.getIdiomaSeleccionado);
  const categorias = useSelector(CategoriasSelectors.getCategorias);
  const especies = useSelector(EspeciesSelectors.getEspecies);

  const goTo = (screenName: any, screenParams?: any) => () => {
    navigation.navigate(screenName, screenParams);
  };

  const orderItems = () => {
    return pipe(orderBy(['nombre'], ['asc']))(especies);
  };

  const orderCategories = () => {
    return pipe(orderBy(['orden'], ['asc']))(categorias);
  };

  const renderItem = ({item}: ListRenderItemInfo<Especie>) => {
    return (
      <SpeciesCard
        speciesID={item.id}
        title={item.nombre}
        subtitle={item.nombre_cientifico}
        description={item.resumen}
        category={categorias[item.categoria]}
        image={item.imagenPrincipal}
        onPress={goTo('ESPECIE_DETALLE', {id: item.id})}
      />
    );
  };

  const renderHeader = (title: string) => {
    return <ListItemSeparator title={title} />;
  };

  const rendeSeparator = () => {
    return null;
  };

  const renderEmpty = () => (
    <EmptyContent
      icon="download"
      text={I18n.t('Descargando', {locale: idioma})}
    />
  );

  let especiesOrdenadas: Especie[] = orderItems();
  let categoriasOrdenadas: Categoria[] = orderCategories();
  let especiesCategoria: any[] = [];

  Object.values(categoriasOrdenadas).forEach(categoria => {
    especiesCategoria.push({
      title: categoria.nombre,
      data: especiesOrdenadas.filter(
        especie => especie.categoria === categoria.id,
      ),
    });
  });

  return (
    <BaseAppScreen title={I18n.t('Especies', {locale: idioma})}>
      <SectionList
        ListHeaderComponent={
          <InfoHeader text={I18n.t('InfoHeaderSpecies', {locale: idioma})} />
        }
        keyExtractor={item => `${item.id}`}
        sections={especiesCategoria}
        renderItem={renderItem}
        initialNumToRender={10}
        renderSectionHeader={({section: {title}}) => renderHeader(title)}
        ItemSeparatorComponent={rendeSeparator}
        ListEmptyComponent={renderEmpty}
        stickySectionHeadersEnabled
      />
    </BaseAppScreen>
  );
};

export default EspeciesScreen;
