import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

type InfoHeaderProps = {
  text: string;
};

const InfoHeader: React.FC<InfoHeaderProps> = ({text}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default InfoHeader;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: '#187384',
    padding: 15,
  },
  text: {
    fontSize: 18,
    color: 'white',
    lineHeight: 24,
  },
});
