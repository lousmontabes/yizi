import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Animated,
  PanResponder,
} from "react-native";
import { Icon } from "react-native-elements";
import * as Haptics from "expo-haptics";

import { confirmDistance } from "../../constants";
import { storeData, getData } from "../../utils/storage";

const CreateView = (props) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pan = useRef(new Animated.ValueXY()).current;

  const titleInputRef = useRef();
  const subtitleInputRef = useRef();

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      Animated.event([null, { dy: pan.y }], {
        useNativeDriver: false,
      })(e, gestureState);
    },
    onPanResponderRelease: () => {
      const d = pan.y._value;
      if (d < confirmDistance) {
        Animated.spring(
          pan, // Auto-multiplexed
          { toValue: { x: 0, y: 0 }, useNativeDriver: true }
        ).start();
      } else {
        hide();
      }
    },
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    // Update the document title using the browser API
    titleInputRef.current.focus();
  }, []);

  const hide = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(
        pan, // Auto-multiplexed
        {
          toValue: { x: 0, y: 1000 },
          duration: 150,
          useNativeDriver: true,
        }
      ),
    ]).start(() => {
      props.onBlackoutPress();
    });
  };

  const submitItem = () => {
    getData().then((currentItems) => {
      console.log(currentItems);
      currentItems.push({ title, subtitle });
      storeData(currentItems);
    });
    hide();
  };

  const onSubmitTitle = () => {
    subtitleInputRef.current.focus();
  };

  return (
    <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Animated.View
          style={{
            ...styles.inner,
            transform: [{ translateY: Animated.divide(pan.y, 3) }],
          }}
          onPress={() => {
            console.log("hi");
          }}
          {...panResponder.panHandlers}
        >
          <TextInput
            ref={titleInputRef}
            onChangeText={(text) => setTitle(text)}
            onSubmitEditing={onSubmitTitle}
            placeholder="Cool new word"
            placeholderTextColor="#999"
            selectionColor={"#000"}
            style={styles.titleInput}
          />
          <TextInput
            ref={subtitleInputRef}
            onChangeText={(text) => setSubtitle(text)}
            onSubmitEditing={submitItem}
            placeholder="Its deep meaning"
            placeholderTextColor="#999"
            selectionColor={"#000"}
            style={styles.subtitleInput}
          />
          <Icon
            containerStyle={styles.newButton}
            reverse
            raised
            size={28}
            type="feather"
            name="check"
            onPress={() => {
              Haptics.impactAsync();
              submitItem();
            }}
          />
        </Animated.View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 34,
    backgroundColor: "#FFF",
    height: "100%",
    width: "100%",
    position: "absolute",
  },
  inner: {
    height: 500,
    shadowColor: "#000",
    flex: 1,
    justifyContent: "center",
    zIndex: 34,
  },
  titleInput: {
    textAlign: "center",
    fontSize: 42,
    fontFamily: "Avenir",
    fontWeight: "500",
  },
  subtitleInput: {
    textAlign: "center",
    fontSize: 28,
    fontFamily: "Avenir",
  },
  newButton: {
    position: "absolute",
    right: 10,
    bottom: 10,
  },
});

export default CreateView;
