import React, { useRef, useState } from 'react';
import { Animated, View, TextInput, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import * as Haptics from 'expo-haptics';

const SearchBar = (props) => {
  const { onSearch } = props;
  const [query, setQuery] = useState('');

  const pressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.975, 1],
  });
  const borderColor = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)'],
  });

  const onEnterQuery = (query) => {
    setQuery(query);
    handleSearch(query);
  };

  const handleSearch = (query) => {
    onSearch(query);
  };

  const onFocus = () => {
    Haptics.impactAsync();
    Animated.spring(pressAnim, {
      toValue: 1,
      speed: 20,
      useNativeDriver: false,
    }).start();
  };

  const onBlur = () => {
    Haptics.impactAsync();
    Animated.spring(pressAnim, {
      toValue: 0,
      speed: 20,
      useNativeDriver: false,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.searchBarWrapper,
        {
          borderColor: borderColor,
          shadowOpacity: pressAnim,
          shadowColor: 'rgba(0, 0, 0, 0.05)',
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
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
        onFocus={onFocus}
        onBlur={onBlur}
      ></TextInput>
    </Animated.View>
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
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 25,
    borderWidth: 1,
    borderRadius: 6,
  },
  searchBarInput: { fontSize: 22, marginLeft: 10, flex: 1 },
});

export default SearchBar;
