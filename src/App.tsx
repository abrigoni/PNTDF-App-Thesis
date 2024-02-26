import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import ReduxConfig from './config/ReduxConfig';
import {
  navigationRef,
  onReadyNavigationContainer,
  onStateChangeNavigationContainer,
} from './navigation/RootNavigation';
import {torch} from 'react-native-pytorch-core';
import MainNavigator from './navigation/MainNavigator';

console.log('typeof torch', typeof torch);
console.log(torch.rand([2, 3]).toString());

const App: React.FC = () => {
  return (
    <Provider store={ReduxConfig.store}>
      <PersistGate persistor={ReduxConfig.persistor}>
        <NavigationContainer
          ref={navigationRef}
          onReady={onReadyNavigationContainer}
          onStateChange={onStateChangeNavigationContainer}>
          <MainNavigator />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};
export default App;
