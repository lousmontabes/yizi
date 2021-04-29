import React, { useState, useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  View,
  StyleSheet,
  Text,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Header } from 'react-native-elements';

import SearchBar from './SearchBar';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const Item = (props) => {
  const { card } = props;

  return (
    <Animated.View style={styles.item}>
      <Text style={styles.title}>{card.title}</Text>
      <Text style={styles.subtitle}>{card.subtitle}</Text>
    </Animated.View>
  );
};

const ItemsListView = (props) => {
  const { cards } = props;
  const [data, setData] = useState(cards);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1.05, 1],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    const { setButton1, setButton2 } = props;
    setButton1({
      show: true,
      icon: 'x',
      onPress: () => hideView(),
    });
    setButton2({
      show: false,
      icon: 'x',
      onPress: () => {},
    });
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start();
  }, []);

  useEffect(() => {
    setData(cards);
  }, [cards]);

  const filterCards = (query) => {
    const result =
      query.length > 0
        ? cards.filter(
            ({ title, subtitle }) =>
              title.toLowerCase().includes(query.toLowerCase()) ||
              subtitle.toLowerCase().includes(query.toLowerCase())
          )
        : cards;
    setData(result);
  };

  const hideView = () => {
    const { hide, onHideOthers } = props;
    onHideOthers();
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => hide());
  };

  const renderItem = ({ item }) => {
    return <Item card={item} />;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <SafeAreaView style={styles.panel}>
        <Header
          barStyle="dark-content"
          placement="left"
          centerComponent={{ text: 'Your yizis', style: styles.header }}
          containerStyle={{
            backgroundColor: '#FFF',
            justifyContent: 'space-around',
            borderBottomWidth: 0,
            paddingVertical: 20,
          }}
        />
        <View style={styles.inner}>
          <SearchBar onSearch={filterCards} />
          <FlatList
            contentContainerStyle={styles.list}
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${index}-${item.title}`}
          />
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontFamily: 'Avenir',
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    paddingTop: 18,
    textShadowOffset: {
      width: 1,
      height: 2,
    },
    textShadowRadius: 0,
    marginHorizontal: 8,
  },
  container: {
    height: SCREEN_HEIGHT,
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: 34,
  },
  inner: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  panel: { height: SCREEN_HEIGHT, width: SCREEN_WIDTH, zIndex: 100 },
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
  icons: { position: 'absolute', right: 10, bottom: 50, zIndex: 10 },
  list: { paddingBottom: 50 },
});

export default ItemsListView;
