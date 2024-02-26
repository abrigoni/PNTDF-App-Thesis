import {Colors, Metrics} from '@/theme';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

type EmptyContentProps = {
  icon: string;
  text: string;
};

const EmptyContent: React.FC<EmptyContentProps> = ({icon, text}) => {
  return (
    <View style={styles.cardEmpty}>
      <Icon name={icon} size={60} color={Colors.secondary} />
      <View style={styles.containerTextEmpty}>
        <Text style={styles.textEmpty}>{text}</Text>
      </View>
    </View>
  );
};

export default EmptyContent;

const styles = StyleSheet.create({
  cardEmpty: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 30,
    margin: 20,
    paddingHorizontal: Metrics.screenWidth / 5,
    borderStyle: 'dashed',
    borderColor: Colors.secondary,
    borderWidth: 2,
    borderRadius: 10,
  },
  textEmpty: {
    color: Colors.secondary,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  containerTextEmpty: {
    marginTop: 10,
  },
});
