import React from 'react';
import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Appbar} from 'react-native-paper';
import {ApplicationStyles, Colors, Images} from '../../../theme';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome5';

const styles = StyleSheet.create({
  header: {
    zIndex: 10,
    elevation: 0,
  },
  title: {...ApplicationStyles.headerTitle},
  optionsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export type AppHeaderOption = {
  icon: string;
  onPress: () => void;
};

export type AppHeaderPropTypes = {
  title?: string;
  headerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  statusColor?: string;
  options?: AppHeaderOption[];
  home?: boolean;
  homeIcon?: boolean;
  menuColor?: string;
  customGoBack?: () => void;
  children?: React.ReactNode;
};

const defaultProps: Partial<AppHeaderPropTypes> = {
  headerStyle: styles.header,
  titleStyle: styles.title,
  title: '',
  options: [],
  home: false,
  homeIcon: false,
};

const AppHeader: React.FC<AppHeaderPropTypes> = propsArgs => {
  const props = {...defaultProps, ...propsArgs};
  const navigation = useNavigation();

  const goBack = () => {
    navigation.goBack();
  };

  const {
    headerStyle,
    titleStyle,
    title,
    home,
    homeIcon,
    menuColor,
    options,
    customGoBack,
  } = props;

  const innerContent = props.children ? (
    props.children
  ) : (
    <View style={styles.optionsContainer}>
      <Appbar.Content
        titleStyle={titleStyle}
        title={title}
        color={menuColor ?? Colors.primary}
      />
      {options?.map((option, index) => (
        <Pressable
          key={index}
          onPressIn={option.onPress}
          style={{marginRight: 10}}>
          <Icon name={option.icon} size={25} color={Colors.white} />
        </Pressable>
      ))}
    </View>
  );

  return (
    <Appbar.Header
      style={[
        {
          backgroundColor: Colors.header,
        },
        headerStyle,
      ]}>
      {home && (
        <Image
          source={Images.apnLogo}
          style={{height: 35, width: 35, marginHorizontal: 15 }}
          resizeMode={'contain'}
        />
      )}
      {!home && !homeIcon && (
        <Appbar.BackAction
          onPress={customGoBack || goBack}
          color={menuColor ?? Colors.white}
          size={30}
          style={{marginRight: 0}}
        />
      )}
      {innerContent}
    </Appbar.Header>
  );
};

export default AppHeader;
