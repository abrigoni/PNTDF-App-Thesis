import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from '@/screens/HomeScreen';
import ServiciosScreen from '@/screens/ServiciosScreen';
import {Routes} from './types';
import RecomendacionesScreen from '@/screens/RecomendacionesScreen';
import ClimaFuegoScreen from '@/screens/ClimaFuegoScreen';
import SobreAppScreen from '@/screens/SobreAppScreen';
import IdiomasScreen from '@/screens/IdiomasScreen';
import SenderosScreen from '@/screens/SenderosScreen';
import SenderoDetalleScreen from '@/screens/SenderoDetalleScreen';
import SenderosMapScreen from '@/screens/SenderosMapScreen';
import EspecieDetalleScreen from '@/screens/EspecieDetalleScreen';
import PuntoInteresDetalleScreen from '@/screens/PuntoDetalleScreen';
import GaleriaEmergenciaScreen from '@/screens/GaleriaEmergenciasScreen';
import EspeciesScreen from '@/screens/EspeciesScreen';
import EmergenciaScreen from '@/screens/EmergenciasScreen';
import FavoritosScreen from '@/screens/FavoritosScreen';
import ClasificadorScreen from '@/screens/ClasificadorScreen';
import { Colors } from '@/theme';
// import SenderosScreen from '@/Screens/SenderosScreen';
// import SenderoDetalleScreen from '@/Screens/SenderoDetalleScreen';
// import EspeciesScreen from '@/Screens/EspeciesScreen';
// import EspecieDetalleScreen from '@/Screens/EspecieDetalleScreen';
// import SenderosMapScreen from '@/Screens/SenderosMapScreen';
// import PuntoInteresDetalleScreen from '@/Screens/PuntoInteresDetalleScreen';
// import SobreAppScreen from '@/Screens/SobreAppScreen';
// import IdiomasScreen from '@/Screens/IdiomasScreen';
// import EmergenciaScreen from '@/Screens/EmergenciasScreen';
// import GaleriaEmergenciaScreen from '@/Screens/GaleriaEmergenciasScreen';
// import FavoritosScreen from '@/Screens/FavoritosScreen';
// import RecomendacionesScreen from '@/Screens/RecomendacionesScreen';
// import ServiciosScreen from '@/Screens/ServiciosScreen';
// import ClimaFuegoScreen from '@/Screens/ClimaFuegoScreen';

const AppStack = createNativeStackNavigator();

export const HomeStack: React.FC = () => {
  return (
    <AppStack.Navigator
      initialRouteName="HOME"
      screenOptions={{
        headerShown: false,
      }}>
      <AppStack.Screen name={Routes.HOME} component={HomeScreen} />
      <AppStack.Screen
        name="RECOMENDACIONES"
        component={RecomendacionesScreen}
      />
      <AppStack.Screen name={Routes.SERVICIOS} component={ServiciosScreen} />
      <AppStack.Screen name={Routes.CLIMA_FUEGO} component={ClimaFuegoScreen} />
      <AppStack.Screen name={Routes.SOBRE_APP} component={SobreAppScreen} />
      <AppStack.Screen name={Routes.IDIOMAS} component={IdiomasScreen} />
      <AppStack.Screen
        options={{
          headerShown: true,
          headerStyle: {backgroundColor: Colors.primary},
          headerTitleStyle: {color: Colors.white},
        }}
        name={Routes.CLASIFICADOR}
        component={ClasificadorScreen}
      />
    </AppStack.Navigator>
  );
};

export const SenderoStack: React.FC = () => {
  return (
    <AppStack.Navigator
      initialRouteName="SENDEROS"
      screenOptions={{
        headerShown: false,
      }}>
      <AppStack.Screen name={Routes.SENDEROS} component={SenderosScreen} />
      <AppStack.Screen
        name={Routes.SENDERO_DETALLE}
        component={SenderoDetalleScreen}
      />
      <AppStack.Screen
        name={Routes.SENDERO_MAPA}
        component={SenderosMapScreen}
      />
      <AppStack.Screen
        name={Routes.ESPECIE_DETALLE}
        component={EspecieDetalleScreen}
      />
      <AppStack.Screen
        name={Routes.PUNTO_INTERES_DETALLE}
        component={PuntoInteresDetalleScreen}
      />
    </AppStack.Navigator>
  );
};

export const EmergenciaStack: React.FC = () => {
  return (
    <AppStack.Navigator
      initialRouteName={Routes.EMERGENCIA}
      screenOptions={{
        headerShown: false,
      }}>
      <AppStack.Screen name={Routes.EMERGENCIA} component={EmergenciaScreen} />
      <AppStack.Screen
        name={Routes.EMERGENCIA_GALERIA}
        component={GaleriaEmergenciaScreen}
      />
    </AppStack.Navigator>
  );
};

export const EspecieStack: React.FC = () => {
  return (
    <AppStack.Navigator
      initialRouteName={Routes.ESPECIES}
      screenOptions={{
        headerShown: false,
      }}>
      <AppStack.Screen name={Routes.ESPECIES} component={EspeciesScreen} />
      <AppStack.Screen
        name={Routes.ESPECIE_DETALLE}
        component={EspecieDetalleScreen}
      />
    </AppStack.Navigator>
  );
};

export const FavoritoStack: React.FC = () => {
  return (
    <AppStack.Navigator
      initialRouteName={Routes.FAVORITOS}
      screenOptions={{
        headerShown: false,
      }}>
      <AppStack.Screen name={Routes.FAVORITOS} component={FavoritosScreen} />
      <AppStack.Screen
        name={Routes.ESPECIE_DETALLE}
        component={EspecieDetalleScreen}
      />
      <AppStack.Screen
        name={Routes.SENDERO_DETALLE}
        component={SenderoDetalleScreen}
      />
      <AppStack.Screen name="SENDERO_MAPA" component={SenderosMapScreen} />
      <AppStack.Screen
        name={Routes.PUNTO_INTERES_DETALLE}
        component={PuntoInteresDetalleScreen}
      />
    </AppStack.Navigator>
  );
};
