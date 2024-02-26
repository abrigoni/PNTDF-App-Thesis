import React from 'react';
import {SectionList, SectionListRenderItemInfo} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/core';

import {ConfiguracionSelectors} from '@/redux/ConfiguracionSlice';
import {CategoriasSelectors} from '@/redux/CategoriasSlice';
import {EspeciesSelectors} from '@/redux/EspeciesSlice';
import {DificultadesSelectors} from '@/redux/DificultadesSlice';
import {ImagenesSelectors} from '@/redux/ImagenesSlice';
import {PuntosInteresSelectors} from '@/redux/PuntosInteresSlice';
import {SenderosSelectors} from '@/redux/SenderosSlice';

import I18n from '@/languages/i18n';

import EmptyContent from '@/components/ui/EmptyContent';
import TrailCard from '@/components/Senderos/TrailCard';
import PoICard from '@/components/Senderos/PoICard';
import ListItemSeparator from '@/components/Senderos/SpeciesList/ListItemSeparator';
import SpeciesCard from '@/components/Especies/SpeciesCard';
import BaseAppScreen from '@/containers/BaseAppScreen';

const FavoritosScreen: React.FC = props => {
  const navigation = useNavigation();

  const idioma = useSelector(ConfiguracionSelectors.getIdiomaSeleccionado);
  const categorias = useSelector(CategoriasSelectors.getCategorias);
  const dificultades = useSelector(DificultadesSelectors.getDificultades);
  const senderos = useSelector(SenderosSelectors.getSenderos);
  const puntosInteres = useSelector(PuntosInteresSelectors.getPuntosInteres);
  const especies = useSelector(EspeciesSelectors.getEspecies);
  const imagenes = useSelector(ImagenesSelectors.getImagenes);
  const senderosFav = useSelector((state: any) =>
    ConfiguracionSelectors.getFavoritos(state, 'senderos'),
  );
  const especiesFav = useSelector((state: any) =>
    ConfiguracionSelectors.getFavoritos(state, 'especies'),
  );
  const puntosInteresFav = useSelector((state: any) =>
    ConfiguracionSelectors.getFavoritos(state, 'puntosInteres'),
  );

  const goTo = (screenName: any, screenParams?: any) => () => {
    navigation.navigate(screenName, screenParams);
  };

  let allFavorites = [];

  const renderEmpty = () => (
    <EmptyContent
      icon="heart-broken"
      text={I18n.t('Sin Favoritos', {locale: idioma})}
    />
  );

  const renderHeader = (title: string) => {
    return (
      <ListItemSeparator
        title={I18n.t(title, {locale: idioma}).toUpperCase()}
      />
    );
  };

  const renderTrail = (senderoID: number) => {
    const sendero = senderos[senderoID];

    return (
      <TrailCard
        trailID={senderoID}
        title={sendero.nombre}
        background={sendero.imagenPrincipal}
        difficulty={dificultades[sendero.dificultad]}
        distance={sendero.longitud}
        time={sendero.duracion}
        open={sendero.habilitado}
        authorization={sendero.autorizacion}
        onPress={goTo('SENDERO_DETALLE', {id: senderoID})}
      />
    );
  };

  const renderSpecie = (especieID: number) => {
    const especie = especies[especieID];

    return (
      <SpeciesCard
        speciesID={especieID}
        title={especie.nombre}
        subtitle={especie.nombre_cientifico}
        description={especie.resumen}
        category={categorias[especie.categoria]}
        image={especie.imagenPrincipal}
        onPress={goTo('ESPECIE_DETALLE', {id: especieID})}
      />
    );
  };

  const renderPoI = (poiID: number) => {
    return (
      <PoICard
        poiID={poiID}
        title={puntosInteres[poiID].nombre}
        image={imagenes[puntosInteres[poiID].imagenPrincipal].large_url}
        onPress={goTo('PUNTO_INTERES_DETALLE', {id: poiID})}
      />
    );
  };

  const renderComponent = ({
    item,
    section,
  }: SectionListRenderItemInfo<
    number,
    {
      title: string;
      data: number[];
    }
  >) => {
    switch (section.title) {
      case 'Senderos':
        return renderTrail(item);
      case 'Especies':
        return renderSpecie(item);
      case 'Puntos de interés':
        return renderPoI(item);
      default:
        return null;
    }
  };

  if (senderosFav.length > 0) {
    allFavorites.push({
      title: 'Senderos',
      data: senderosFav,
    });
  }
  if (especiesFav.length > 0) {
    allFavorites.push({
      title: 'Especies',
      data: especiesFav,
    });
  }
  if (puntosInteresFav.length > 0) {
    allFavorites.push({
      title: 'Puntos de interés',
      data: puntosInteresFav,
    });
  }

  return (
    <BaseAppScreen title={I18n.t('Favoritos', {locale: idioma})}>
      <SectionList
        keyExtractor={(item, index) => `${index}`}
        sections={allFavorites}
        renderItem={renderComponent}
        renderSectionHeader={({section: {title}}) => renderHeader(title)}
        initialNumToRender={8}
        ListEmptyComponent={renderEmpty}
        stickySectionHeadersEnabled
      />
    </BaseAppScreen>
  );
};

export default FavoritosScreen;
