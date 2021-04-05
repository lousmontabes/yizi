import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  View,
  StyleSheet,
  Text,
  FlatList,
  TextInput,
} from 'react-native';
import { Icon } from 'react-native-elements';

const SearchBar = (props) => {
  const { onSearch } = props;
  const [query, setQuery] = useState('');

  const onEnterQuery = (query) => {
    setQuery(query);
    handleSearch(query);
  };

  const handleSearch = (query) => {
    onSearch(query);
  };

  return (
    <View style={styles.searchBarWrapper}>
      <View style={styles.searchBarIcon}>
        <Icon size={20} type="feather" name="search" />
      </View>
      <TextInput
        style={styles.searchBarInput}
        placeholder="Search"
        clearButtonMode="always"
        autoCorrect={false}
        value={query}
        onChangeText={onEnterQuery}
        selectionColor={'#000'}
      ></TextInput>
    </View>
  );
};

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

  const renderItem = ({ item }) => {
    return <Item card={item} />;
  };

  return (
    <View style={styles.container}>
      <SearchBar onSearch={filterCards} />
      <FlatList
        style={styles.list}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.title}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { display: 'flex', height: '100%' },
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
  searchBarWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'rgb(240, 240, 240)',
    borderRadius: 6,
  },
  searchBarInput: { fontSize: 22, marginLeft: 10, flex: 1 },
});

export default ItemsListView;
