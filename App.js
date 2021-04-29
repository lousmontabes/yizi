import React, { useState, useEffect } from 'react';
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

export default App;
