import React, {useState} from 'react';
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StatusBarProps,
  StyleSheet,
  View,
} from 'react-native';
import FocusAwareStatusBar from '../components/ui/FocusAwareStatusBar';
import {Colors, Images, Metrics} from '../theme';
import AppHeader from '@/components/ui/AppHeader';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/core';
import {Appbar} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {ImagenesSelectors} from '../redux/ImagenesSlice';
import LinearGradient from 'react-native-linear-gradient';

export type ParallaxAppScreenProps = {
  title: string;
  headerComponent: JSX.Element;
  parallaxImage: number | null;
  statusBarProps?: StatusBarProps;
  children: any;
};

const ParallaxAppScreen: React.FC<ParallaxAppScreenProps> = ({
  title,
  children,
  parallaxImage,
  headerComponent,
  statusBarProps,
}) => {
  const navigation = useNavigation();
  const [scrollY, setScrollY] = useState<Animated.Value>(new Animated.Value(0));

  const imagen = parallaxImage
    ? useSelector((state: any) =>
        ImagenesSelectors.getImagenByID(state, parallaxImage),
      )
    : null;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 360 / 2, 360],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  const parallaxOpacity = scrollY.interpolate({
    inputRange: [0, 360 / 2, 360],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const onBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <FocusAwareStatusBar
        backgroundColor={Colors.primary}
        barStyle={'light-content'}
        {...statusBarProps}
      />
      <Animated.View style={[styles.animatedHeader, {opacity: headerOpacity}]}>
        <AppHeader title={title} />
      </Animated.View>
      <Appbar.BackAction
        onPress={onBack}
        color={Colors.white}
        size={30}
        style={{position: 'absolute', marginLeft: 10, paddingBottom: 1}}
      />
      <FastImage
        source={imagen ? {uri: imagen.large_url} : Images.senderos}
        style={styles.image}
        resizeMode="cover">
        <LinearGradient
          colors={[
            'rgba(255,255,255,0.1)',
            'rgba(100,100,100,0.1)',
            'rgba(80,80,80,0.9)',
          ]}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={{flex: 1}}
        />
      </FastImage>
      <ScrollView
        style={{flex: 1}}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}>
        <Animated.View style={[styles.parallax, {opacity: parallaxOpacity}]}>
          <View style={styles.parallaxContainer}>{headerComponent}</View>
        </Animated.View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ParallaxAppScreen;

const styles = StyleSheet.create({
  parallax: {
    height: 310,
  },
  parallaxContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  image: {
    flex: 1,
    zIndex: -1,
    position: 'absolute',
    width: Metrics.screenWidth,
    height: 375,
  },
  animatedHeader: {
    zIndex: 10,
  },
});
