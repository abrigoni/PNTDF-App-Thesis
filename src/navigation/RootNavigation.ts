import {MutableRefObject, createRef} from 'react';
import {
  NavigationContainerRef,
  PartialState,
  NavigationState,
} from '@react-navigation/native';
// import Analytics from '@react-native-firebase/analytics';

export const navigationRef: MutableRefObject<NavigationContainerRef<any> | null> =
  createRef<NavigationContainerRef<any>>();

export function navigate(name: string, params?: object) {
  navigationRef?.current?.navigate(name, params);
}

export function reset(params: NavigationState | PartialState<NavigationState>) {
  navigationRef?.current?.reset(params);
}

export const routeNameRef: MutableRefObject<any | null> = createRef<any>();

export const onReadyNavigationContainer = () => {
  routeNameRef.current = navigationRef?.current?.getCurrentRoute()?.name;
};

export const onStateChangeNavigationContainer = () => {
  const previousRouteName = routeNameRef.current;
  const currentRouteName = navigationRef?.current?.getCurrentRoute()?.name;

  // if (previousRouteName !== currentRouteName) {
  //   Analytics().logScreenView({
  //     screen_name: currentRouteName,
  //     screen_class: currentRouteName,
  //   });
  // }

  // Save the current route name for later comparision
  routeNameRef.current = currentRouteName;
};
