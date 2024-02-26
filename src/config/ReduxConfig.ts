import AsyncStorage from '@react-native-async-storage/async-storage';
import {configureStore, EnhancedStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer, PersistConfig} from 'redux-persist';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '@/config/SagasConfig';
import RootReducer, {RootState} from '@/config/RootReducer';

const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage: AsyncStorage,
  stateReconciler: hardSet,
  blacklist: [],
};

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

const persistedReducer = persistReducer<RootState>(persistConfig, RootReducer);

const store: EnhancedStore = configureStore({
  reducer: persistedReducer,
  middleware,
});
const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

// @ts-ignore
global.store = store;
// @ts-ignore
global.persistor = persistor;

export default {store, persistor};
