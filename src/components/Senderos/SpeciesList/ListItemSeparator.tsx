import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {Colors} from '@/theme';

import Icon from 'react-native-vector-icons/FontAwesome5';

type ListItemSeparatorProps = {
  title: string;
  icon?: string;
};

const ListItemSeparator: React.FC<ListItemSeparatorProps> = ({title, icon}) => {
  return (
    <View style={styles.separator}>
      {icon ? (
        <Icon name={icon} size={25} color={Colors.white} style={styles.icon} />
      ) : null}
      <Text style={styles.title}>{title.toUpperCase()}</Text>
    </View>
  );
};

export default ListItemSeparator;

const styles = StyleSheet.create({
  separator: {
    flex: 1,
    height: 50,
    flexDirection: 'row',
    backgroundColor: Colors.listSeparator,
    marginBottom: 2,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 15,
  },
  title: {
    fontSize: 18,
    color: Colors.white,
    fontWeight: 'bold',
  },
});
