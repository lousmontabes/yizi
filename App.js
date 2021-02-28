import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Main from './components/Main';
import storage from './utils/storage';

const App = () => {
  const [cards, setCards] = useState([]);

  const loadItems = () => {
    storage.getItems().then((data) => {
      setCards(data);
    });
  };

  useEffect(() => {
    loadItems();
  }, []);

  return <Main cards={cards} refresh={loadItems}></Main>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
