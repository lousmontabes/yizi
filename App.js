import React, { useState, useEffect } from "react";
import Main from "./components/Main";
import { getData, clear } from "./utils/storage";

const App = () => {
  const [cards, setCards] = useState([]);

  loadItems = () => {
    getData().then((data) => {
      console.log(cards);
      setCards(data);
    });
  };

  useEffect(() => {
    loadItems();
  }, []);

  return <Main cards={cards} refresh={loadItems}></Main>;
};

export default App;
