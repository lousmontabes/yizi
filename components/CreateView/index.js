import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Animated,
  PanResponder,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import * as Haptics from "expo-haptics";

import { confirmDistance } from "../../constants";
import { storeData, getData } from "../../utils/storage";

const CreateView = (props) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pan = useRef(new Animated.Value(0)).current;
  const nextAnim = useRef(new Animated.Value(0)).current;
  const nextOpacity = useRef(new Animated.Value(1)).current;
  const titleShake = useRef(new Animated.Value(0)).current;
  const subtitleShake = useRef(new Animated.Value(0)).current;

  const startShake = (shakeAnimation) => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const titleInputRef = useRef();
  const subtitleInputRef = useRef();

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      Animated.event([null, { dy: pan }], {
        useNativeDriver: false,
      })(e, gestureState);
    },
    onPanResponderRelease: () => {
      const d = pan._value;
      if (d < confirmDistance) {
        Animated.spring(
          pan, // Auto-multiplexed
          { toValue: 0, useNativeDriver: true }
        ).start();
      } else {
        hideView(false);
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

  const hideView = (itemAdded) => {
    titleInputRef.current.isFocused() && titleInputRef.current.blur();
    subtitleInputRef.current.isFocused() && subtitleInputRef.current.blur();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(pan, {
        toValue: 1000,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      props.hide(itemAdded);
    });
  };

  const sanitizeInput = () => {};

  const isInputValid = (input) => {
    return input.trim() !== "";
  };

  const submitItem = () => {
    const isTitleValid = isInputValid(title);
    const isSubtitleValid = isInputValid(subtitle);

    if (isTitleValid && isSubtitleValid) {
      Haptics.impactAsync();

      getData().then((currentItems) => {
        currentItems.push({ title, subtitle });
        storeData(currentItems);
      });
      showNextInput();
    } else {
      !isTitleValid && startShake(titleShake);
      !isSubtitleValid && startShake(subtitleShake);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  const showNextInput = () => {
    Animated.timing(nextAnim, {
      toValue: -1000,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      resetInputs();
      titleInputRef.current.focus();
      nextAnim.setValue(0);
      nextOpacity.setValue(0);
      Animated.timing(nextOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const resetInputs = () => {
    setTitle("");
    setSubtitle("");
  };

  const onSubmitTitle = () => {
    subtitleInputRef.current.focus();
  };

  const onInputSubtitle = (text) => {
    // Remove user-input line breaks
    setSubtitle(text.replace("\n", ""));
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
            transform: [{ translateY: Animated.divide(pan, 3) }],
          }}
          {...panResponder.panHandlers}
        >
          <Animated.View
            style={{
              transform: [{ translateY: nextAnim }],
              opacity: nextOpacity,
            }}
          >
            <Animated.View
              style={{
                transform: [{ translateX: titleShake }],
              }}
            >
              <TextInput
                autoFocus
                ref={titleInputRef}
                value={title}
                maxLength={25}
                onChangeText={(text) => setTitle(text)}
                onSubmitEditing={onSubmitTitle}
                placeholder="New yizi"
                placeholderTextColor="#999"
                selectionColor={"#000"}
                style={styles.titleInput}
                returnKeyType="next"
                spellCheck={false}
              />
            </Animated.View>
            <Animated.View
              style={{
                transform: [{ translateX: subtitleShake }],
              }}
            >
              <TextInput
                ref={subtitleInputRef}
                value={subtitle}
                maxLength={50}
                multiline={true}
                onChangeText={onInputSubtitle}
                onSubmitEditing={submitItem}
                placeholder="Its deep meaning"
                placeholderTextColor="#999"
                selectionColor={"#000"}
                style={styles.subtitleInput}
                enablesReturnKeyAutomatically
                returnKeyType="done"
                scrollEnabled={false}
              />
            </Animated.View>
          </Animated.View>
          <View style={styles.icons}>
            <Icon
              containerStyle={styles.newButton}
              size={28}
              reverse
              color="white"
              reverseColor="black"
              type="feather"
              name="x"
              onPress={() => {
                Haptics.impactAsync();
                hideView(false);
              }}
            />
            <Icon
              containerStyle={styles.newButton}
              reverse
              raised
              size={28}
              type="feather"
              name="check"
              onPress={() => {
                submitItem();
              }}
            />
          </View>
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
    backgroundColor: "#FFF",
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
    marginHorizontal: 15,
  },
  subtitleInput: {
    textAlign: "center",
    fontSize: 28,
    fontFamily: "Avenir",
    marginHorizontal: 15,
  },
  newButton: {},
  icons: { position: "absolute", right: 10, bottom: 10 },
});

export default CreateView;
