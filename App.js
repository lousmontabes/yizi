import React, { useState, createRef } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Header, Icon } from "react-native-elements";
import * as Haptics from "expo-haptics";

import Pile from "./components/Pile";
import CreateView from "./components/CreateView";

const cards = [
  { title: "桌子 Zhuōzi", description: "Table" },
  { title: "床 Chuáng", description: "Bed" },
  { title: "房间 Fángjiān", description: "Room" },
];

const App = () => {
  const [showCreateView, setShowCreateView] = useState(false);

  const textInputRef = createRef();

  return (
    <SafeAreaProvider>
      <Header
        barStyle="light-content" // or directly
        placement="center"
        centerComponent={{ text: "yizi", style: styles.logo }}
        containerStyle={{
          backgroundColor: "#FFF",
          justifyContent: "space-around",
          borderBottomWidth: 0,
          paddingVertical: 20,
        }}
      />
      <Pile cards={cards}></Pile>
      <Icon
        containerStyle={styles.newButton}
        reverse
        raised
        size={28}
        type="feather"
        name="edit-2"
        onPress={() => {
          Haptics.notificationAsync();
          setShowCreateView(true);
          textInputRef.current.focus();
        }}
      />
      {/* <CreateView
        show={showCreateView}
        textInputRef={textInputRef}
      ></CreateView> */}
      <StatusBar barStyle="default" />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    padding: 20,
    paddingLeft: 30,
    paddingTop: 50,
    width: "100%",
  },
  logo: {
    fontFamily: "American Typewriter",
    fontSize: 28,
    fontWeight: "500",
    color: "#BBB",
    textShadowOffset: {
      width: 1,
      height: 2,
    },
    textShadowRadius: 0,
  },
  item: { flex: 2 },
  controls: { flex: 1 },
  emptyMessage: {},
  komo: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  emptyMessageText: {
    fontFamily: "Avenir",
    fontSize: 22,
    fontWeight: "500",
  },
  newButton: {
    position: "absolute",
    right: 10,
    bottom: 50,
  },
});

export default App;
