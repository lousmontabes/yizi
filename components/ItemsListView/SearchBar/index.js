import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
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

const styles = StyleSheet.create({
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

export default SearchBar;
