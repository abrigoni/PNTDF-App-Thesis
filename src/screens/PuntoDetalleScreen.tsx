import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
/* import {HeaderPuntoInteres} from '../Components'; */
import Description from '@/components/Senderos/Description';
import Gallery from '@/components/Senderos/Gallery';
import {PuntosInteresSelectors} from '@/redux/PuntosInteresSlice';
import {ImagenesSelectors} from '@/redux/ImagenesSlice';
import {useRoute} from '@react-navigation/core';
import {
  ConfiguracionActions,
  ConfiguracionSelectors,
} from '@/redux/ConfiguracionSlice';
import ParallaxAppScreen from '@/containers/ParallaxAppScreen';
import PoIInfo from '@/components/Senderos/PoIInfo';

type routeParamsProps = {id: number};

const PuntoInteresDetalleScreen: React.FC = props => {
  const route = useRoute();
  const imagenes = useSelector(ImagenesSelectors.getImagenes);
  const puntoInteres = useSelector((state: any) =>
    PuntosInteresSelectors.getPuntoInteresByID(
      state,
      (route.params as routeParamsProps).id,
    ),
  );

  const dispatch = useDispatch();

  if (!puntoInteres) {
    return null;
  }

  const onFavPress = () => {
    dispatch(
      ConfiguracionActions.updateFavorito({
        listado: 'puntosInteres',
        id: puntoInteres.id,
      }),
    );
  };

  return (
    <ParallaxAppScreen
      title={puntoInteres.nombre}
      parallaxImage={puntoInteres.imagenPrincipal}
      headerComponent={
        <PoIInfo poiID={puntoInteres.id} title={puntoInteres.nombre} />
      }>
      <Description
        resume={puntoInteres.descripcion}
        /* content={puntoInteres.descripcion} */
      />
      <Gallery imagesID={puntoInteres.imagenes} />
    </ParallaxAppScreen>
  );
  /* return (
    <HeaderPuntoInteres
      title={puntoInteres.nombre}
      image={imagenes[puntoInteres.imagenPrincipal].large_url}
      liked={isFav}
      onPressFav={onFavPress}>
    </HeaderPuntoInteres>
  ); */
};

export default PuntoInteresDetalleScreen;

/* PuntoInteresShowScreen.navigationOptions = {
  headerTintColor: 'white',
  headerTransparent: true,
}

const mapStateToProps = (state) => {
  return {
    idiomaSeleccionado: ConfigSelectors.getIdiomaSeleccionado(state),
    puntoInteres: PuntosInteresSelectors.getPuntoDeInteresSeleccionado(state),
    imagenes: ImagenesSelectors.getData(state),
    puntosInteresFavoritos: ConfigSelectors.getPuntosInteresFavoritos(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    agregarFavorito: (tipo, id) => dispatch(ConfigActions.agregarFavorito(tipo, id)),
    quitarFavorito: (tipo, id) => dispatch(ConfigActions.quitarFavorito(tipo, id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PuntoInteresShowScreen) */
