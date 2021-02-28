import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, StyleSheet, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import * as Haptics from 'expo-haptics';

const Item = (props) => {
  const { card } = props;
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{card.title}</Text>
      <Text style={styles.subtitle}>{card.subtitle}</Text>
    </View>
  );
};

const ItemsListView = (props) => {
  const { cards } = props;
  console.log(cards);

  return (
    <View>
      {cards.map((card) => (
        <Item card={card} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  item: { marginHorizontal: 35, marginVertical: 10 },
  title: {
    fontSize: 28,
    fontFamily: 'Avenir',
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 22,
    fontFamily: 'Avenir',
  },
});

export default ItemsListView;
