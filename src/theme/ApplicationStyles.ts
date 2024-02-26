import {TextStyle, ViewStyle} from 'react-native';
import Colors from './Colors';

// This file is for a reusable grouping of Theme items.
// Similar to an XML fragment layout in Android

type ApplicationStylesProps = {
  mainContainer: ViewStyle;
  container: ViewStyle;
  shadow: object;
  headerTitle: TextStyle;
  title: TextStyle;
  subtitle: TextStyle;
  text: TextStyle;
  backgroundImage: ViewStyle;
  titleText: TextStyle;
  textError: TextStyle;
  textErrorBlueBackground: TextStyle;
  [key: string]: ViewStyle | TextStyle;
};

const ApplicationStyles: ApplicationStylesProps = {
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    padding: 20,
    paddingTop: 35,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  headerTitle: {
    fontSize: 18,
    color: Colors.white,
  },
  title: {
    marginBottom: 45,
    fontSize: 32,
    lineHeight: 40,
    color: Colors.darkGrey,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 25,
    fontWeight: 'bold',
    color: Colors.darkGrey,
  },
  text: {
    fontSize: 18,
    color: Colors.darkGrey,
    lineHeight: 25,
    marginBottom: 30,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  titleText: {
    fontSize: 14,
    color: Colors.darkGrey,
  },
  textError: {
    fontSize: 18,
    color: Colors.red,
  },
  textErrorBlueBackground: {
    fontSize: 18,
    color: Colors.red,
  },
};

export default ApplicationStyles;
