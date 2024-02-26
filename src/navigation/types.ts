export enum Routes {
  HOME = 'HOME',
  SENDEROS = 'SENDEROS',
  ESPECIES = 'ESPECIES',
  EMERGENCIA = 'EMERGENCIA',
  CLIMA_FUEGO = 'CLIMA_FUEGO',
  SERVICIOS = 'SERVICIOS',
  RECOMENDACIONES = 'RECOMENDACIONES',
  SOBRE_APP = 'SOBRE_APP',
  IDIOMAS = 'IDIOMAS',
  SENDERO_DETALLE = 'SENDERO_DETALLE',
  SENDERO_MAPA = 'SENDERO_MAPA',
  ESPECIE_DETALLE = 'ESPECIE_DETALLE',
  PUNTO_INTERES_DETALLE = 'PUNTO_INTERES_DETALLE',
  EMERGENCIA_GALERIA = 'EMERGENCIA_GALERIA',
  FAVORITOS = 'FAVORITOS',
  SPLASH = 'SPLASH',
  APP_UPDATING = 'APP_UPDATING',
  APP_NAVIGATOR = 'APP_NAVIGATOR',
  CLASIFICADOR = 'CLASIFICADOR',
}

export type AppNavigatorStackParamList = {
  [Routes.HOME]?: undefined;
  [Routes.IDIOMAS]?: undefined;
  [Routes.RECOMENDACIONES]?: undefined;
  [Routes.SERVICIOS]?: undefined;
  [Routes.CLIMA_FUEGO]?: undefined;
  [Routes.SOBRE_APP]?: undefined;
  [Routes.SENDEROS]?: undefined;
  [Routes.SENDERO_DETALLE]?: undefined;
  [Routes.SENDERO_MAPA]?: undefined;
  [Routes.ESPECIE_DETALLE]?: undefined;
  [Routes.PUNTO_INTERES_DETALLE]?: undefined;
  [Routes.EMERGENCIA]: undefined;
  [Routes.EMERGENCIA_GALERIA]?: undefined;
  [Routes.FAVORITOS]?: undefined;
  [Routes.SPLASH]?: undefined;
  [Routes.APP_UPDATING]?: undefined;
  [Routes.APP_NAVIGATOR]?: undefined;
  [Routes.CLASIFICADOR]?: undefined;
};
declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppNavigatorStackParamList {}
  }
}
