import React from 'react';
import {FlatList, ListRenderItemInfo} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/core';

import {ConfiguracionSelectors} from '@/redux/ConfiguracionSlice';
import {DificultadesSelectors} from '@/redux/DificultadesSlice';
import {SenderosSelectors} from '@/redux/SenderosSlice';
import {Sendero} from '@/services/SenderosService';

import I18n from '@/languages/i18n';

import EmptyContent from '@/components/ui/EmptyContent';
import TrailCard from '@/components/Senderos/TrailCard';
import BaseAppScreen from '@/containers/BaseAppScreen';
import {Routes} from '@/navigation/types';

const SenderosScreen: React.FC = props => {
  const navigation = useNavigation();
  const idioma = useSelector(ConfiguracionSelectors.getIdiomaSeleccionado);

  const dificultades = useSelector(DificultadesSelectors.getDificultades);
  const senderos = useSelector(SenderosSelectors.getSenderos);

  const goTo = (screenName: any, screenParams?: any) => () => {
    navigation.navigate(screenName, screenParams);
  };

  const renderEmpty = () => (
    <EmptyContent
      icon="download"
      text={I18n.t('Descargando', {locale: idioma})}
    />
  );

  const renderItem = ({item}: ListRenderItemInfo<Sendero>) => {
    return (
      <TrailCard
        trailID={item.id}
        title={item.nombre}
        background={item.imagenPrincipal}
        difficulty={dificultades[item.dificultad]}
        distance={item.longitud}
        time={item.duracion}
        authorization={item.autorizacion}
        open={item.habilitado}
        onPress={goTo(Routes.SENDERO_DETALLE, {id: item.id})}
      />
    );
  };

  return (
    <BaseAppScreen title={I18n.t('Senderos', {locale: idioma})}>
      <FlatList
        keyExtractor={item => `${item.id}`}
        data={Object.values(senderos)}
        renderItem={renderItem}
        initialNumToRender={8}
        ListEmptyComponent={renderEmpty}
      />
    </BaseAppScreen>
  );
};

export default SenderosScreen;
