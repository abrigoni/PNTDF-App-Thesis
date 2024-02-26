import {Metrics} from '@/theme';
import React from 'react';
import {
  Pressable,
  Text,
  View,
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  Image,
} from 'react-native';
// import FastImage, {Source} from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

type HomeCardProps = {
  title: string;
  size?: 'small' | 'large';
  logo?: ImageSourcePropType;
  background: ImageSourcePropType;
  onPress: () => void;
};

const HomeCard: React.FC<HomeCardProps> = ({
  title,
  size = 'small',
  logo,
  onPress,
  background,
}) => {
  return (
    <View style={size == 'small' ? styles.card : styles.cardLarge}>
      <Pressable style={{flex: 1}} onPress={onPress}>
        <ImageBackground
          source={background}
          style={{flex: 1, borderRadius: 5}}
          resizeMode="stretch">
          <LinearGradient
            colors={[
              'rgba(255,255,255,0.1)',
              'rgba(100,100,100,0.1)',
              'rgba(30,30,30,0.9)',
            ]}
            style={{flex: 1, borderRadius: 5}}>
            <View
              style={
                size == 'small' ? styles.cardContent : styles.cardContentLarge
              }>
              <Text style={size == 'small' ? styles.title : styles.titleLarge}>
                {title}
              </Text>
              {size == 'large' && logo ? (
                <Image source={logo} style={styles.logo} resizeMode="stretch" />
              ) : null}
            </View>
          </LinearGradient>
        </ImageBackground>
      </Pressable>
    </View>
  );
};

export default HomeCard;

const styles = StyleSheet.create({
  card: {
    width: Metrics.screenWidth - Metrics.screenWidth / 2 - 5,
    height: Metrics.screenWidth - Metrics.screenWidth / 2 - 5,
    margin: 2,
    borderRadius: 5,
  },
  cardLarge: {
    width: Metrics.screenWidth,
    height: Metrics.screenWidth / 2,
    marginBottom: 2,
    borderRadius: 5,
  },
  logo: {
    width: 140,
    height: 140,
    alignSelf: 'center',
  },
  cardContent: {
    position: 'absolute',
    bottom: 15,
    paddingLeft: 15,
  },
  cardContentLarge: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 15,
  },
  rowContent: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 19,
    color: 'white',
    fontWeight: 'bold',
  },
  titleLarge: {
    fontSize: 26,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlignVertical: 'bottom',
  },
});
