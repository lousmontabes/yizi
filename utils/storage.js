import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('@items', jsonValue);
  } catch (e) {
    // saving error
  }
};

const getItems = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@items');
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    // error reading value
  }
};

const addItem = async (item) => {
  const { title, subtitle } = item;
  getItems().then((currentItems) => {
    currentItems.push({
      title,
      subtitle,
    });
    storeData(currentItems);
  });
};

const deleteItem = async (item) => {
  getItems().then((currentItems) => {
    const toDelete = currentItems.findIndex(
      ({ title, subtitle }) =>
        title === item.title && subtitle === item.subtitle
    );
    console.log('deleting', toDelete);
    currentItems.splice(toDelete, 1);
    storeData(currentItems);
  });
};

const modifyItem = async (item, newItem) => {
  getItems().then((currentItems) => {
    const toModify = currentItems.findIndex(
      ({ title, subtitle }) =>
        title === item.title && subtitle === item.subtitle
    );
    currentItems[toModify].title = newItem.title;
    currentItems[toModify].subtitle = newItem.subtitle;
    storeData(currentItems);
  });
};

const clear = async () => {
  try {
    const jsonValue = await AsyncStorage.clear();
  } catch (e) {
    // error clearing
  }
};

export default {
  addItem,
  deleteItem,
  getItems,
  modifyItem,
};
