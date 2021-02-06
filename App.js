import React, { useState, useEffect } from "react";
import Main from "./components/Main";
import { getData, clear } from "./utils/storage";

const App = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    getData().then((data) => {
      console.log(cards);
      setCards(data);
    });
  }, []);

  return <Main cards={cards}></Main>;
};

export default App;
