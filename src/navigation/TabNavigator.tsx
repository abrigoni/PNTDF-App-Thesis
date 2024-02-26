import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {ApplicationStyles, Colors} from '@/theme';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  EmergenciaStack,
  EspecieStack,
  FavoritoStack,
  HomeStack,
  SenderoStack,
} from './AppRoutes';
import i18n from '@/languages/i18n';
import {useSelector} from 'react-redux';
import {ConfiguracionSelectors} from '@/redux/ConfiguracionSlice';
import {Routes} from './types';

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  tabButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  labelStyle: {
    fontWeight: 'bold',
    fontSize: 10,
  },
  middleBtn: {
    ...ApplicationStyles.shadow,
    top: -30,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    padding: 15,
  },
  navigator: {
    height: 88,
    backgroundColor: Colors.primary,
    borderTopWidth: 0,
  },
  tabItemContainer: {
    paddingVertical: 10,
    gap: 2,
  },
});

const TabNavigator = () => {
  const idioma = useSelector(ConfiguracionSelectors.getIdiomaSeleccionado);
  return (
    <Tab.Navigator
      initialRouteName={Routes.HOME}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.activeTab,
        tabBarInactiveTintColor: Colors.inactiveTab,
        tabBarLabelStyle: styles.labelStyle,
        tabBarStyle: styles.navigator,
        tabBarItemStyle: styles.tabItemContainer,
      }}>
      <Tab.Screen
        name={Routes.HOME}
        component={HomeStack}
        options={{
          tabBarLabel: i18n.t('Explorar', {locale: idioma}).toUpperCase(),
          tabBarIcon: ({color, size}) => (
            <Icon name="search-location" color={color} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name={Routes.SENDEROS}
        component={SenderoStack}
        options={{
          tabBarLabel: i18n.t('Senderos', {locale: idioma}).toUpperCase(),
          tabBarIcon: ({color, size}) => (
            <Icon name="hiking" color={color} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name={Routes.EMERGENCIA}
        component={EmergenciaStack}
        options={{
          tabBarButton: props => (
            <Pressable {...props} style={styles.middleBtn}>
              <Icon name="exclamation-triangle" color={Colors.red} size={25} />
            </Pressable>
          ),
        }}
      />
      <Tab.Screen
        name={Routes.ESPECIES}
        component={EspecieStack}
        options={{
          tabBarLabel: i18n.t('Especies', {locale: idioma}).toUpperCase(),
          tabBarIcon: ({color, size}) => (
            <Icon name="paw" color={color} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="FAVORITOS"
        component={FavoritoStack}
        options={{
          tabBarLabel: i18n.t('Favoritos', {locale: idioma}).toUpperCase(),
          tabBarIcon: ({color, size}) => (
            <Icon name="heart" color={color} size={20} solid />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
