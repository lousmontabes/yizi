import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, StyleSheet, Text, FlatList } from 'react-native';
import { Icon } from 'react-native-elements';
import * as Haptics from 'expo-haptics';

const Item = (props) => {
  const { card, anim } = props;

  const opacity = anim.interpolate({
    inputRange: [-100, 0, 1],
    outputRange: [0.5, 10, 10],
  });

  return (
    <Animated.View style={styles.item}>
      <Text style={styles.title}>{card.title}</Text>
      <Text style={styles.subtitle}>{card.subtitle}</Text>
    </Animated.View>
  );
};

const ItemsListView = (props) => {
  const { cards } = props;
  const [scrollY, setScrollY] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const renderItem = ({ item }) => {
    return <Item card={item} scrollY={scrollY} anim={fadeAnim} />;
  };

  const onViewRef = React.useRef(({ viewable, changed }) => {
    console.log('> changed:', changed);
    // Use viewable items in state or as intended
  });

  return (
    <FlatList
      data={cards}
      renderItem={renderItem}
      keyExtractor={(item) => item.title}
      scrollEventThrottle={16}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: fadeAnim } } }],
        { useNativeDriver: false }
      )}
      onViewableItemsChanged={onViewRef.current}
    />
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
