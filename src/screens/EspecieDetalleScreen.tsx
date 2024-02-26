import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {useRoute} from '@react-navigation/core';

import {EspeciesSelectors} from '@/redux/EspeciesSlice';

import Gallery from '@/components/Senderos/Gallery';
import Description from '@/components/Senderos/Description';
import SpeciesHeader from '@/components/Senderos/SpeciesHeader';
import ParallaxAppScreen from '@/containers/ParallaxAppScreen';

type routeParamsProps = {id: number};

const EspecieDetalleScreen: React.FC = props => {
  const route = useRoute();
  const especie = useSelector((state: any) =>
    EspeciesSelectors.getEspecieByID(
      state,
      (route.params as routeParamsProps).id,
    ),
  );

  if (!especie) {
    return null;
  }

  return (
    <ParallaxAppScreen
      title={especie.nombre}
      parallaxImage={especie.imagenPrincipal}
      headerComponent={
        <View style={styles.headerContainer}>
          <SpeciesHeader
            speciesID={especie.id}
            title={especie.nombre}
            subtitle={especie.nombre_cientifico}
          />
        </View>
      }>
      <Description resume={especie.resumen} content={especie.descripcion} />
      <Gallery imagesID={especie.imagenes} />
    </ParallaxAppScreen>
  );
};

export default EspecieDetalleScreen;

const styles = StyleSheet.create({
  headerContainer: {
    padding: 25,
  },
});
