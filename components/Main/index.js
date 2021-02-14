import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { Header, Icon } from "react-native-elements";
import * as Haptics from "expo-haptics";

import Pile from "../../components/Pile";
import CreateView from "../../components/CreateView";

const Main = (props) => {
  const [createViewVisible, setCreateViewVisible] = useState(false);
  const { cards, refresh } = props;

  const showCreateView = () => {
    Haptics.impactAsync();
    setCreateViewVisible(true);
  };

  const hideCreateView = (createdNew) => {
    createdNew && refresh();
    setCreateViewVisible(false);
  };

  return (
    <>
      <Header
        barStyle="light-content"
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
      <View style={styles.icons}>
        <Icon
          size={28}
          reverse
          color="white"
          reverseColor="black"
          type="feather"
          name="refresh-ccw"
          onPress={props.refresh}
        />
        <Icon
          reverse
          raised
          size={28}
          type="feather"
          name="edit-2"
          onPress={showCreateView}
        />
      </View>
      {createViewVisible && <CreateView hide={hideCreateView}></CreateView>}
      <StatusBar barStyle="default" />
    </>
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
  icons: { position: "absolute", right: 10, bottom: 50, zIndex: 10 },
});

export default Main;
