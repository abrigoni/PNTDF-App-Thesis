import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';

import {ConfiguracionSelectors} from '@/redux/ConfiguracionSlice';

import IdiomasScreen from '@/screens/IdiomasScreen';
import TabNavigator from './TabNavigator';
import {Routes} from './types';

const AppStack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  const requestIdioma = useSelector(ConfiguracionSelectors.getRequestIdioma);

  const getInitialRoute = () => {
    if (requestIdioma) {
      return Routes.IDIOMAS;
    }

    return Routes.HOME;
  };

  return (
    <AppStack.Navigator
      initialRouteName={getInitialRoute()}
      screenOptions={{headerShown: false}}>
      <AppStack.Screen name={Routes.HOME} component={TabNavigator} />
      <AppStack.Screen name={Routes.IDIOMAS} component={IdiomasScreen} />
    </AppStack.Navigator>
  );
};

export default AppNavigator;
