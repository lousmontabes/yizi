import React, { createRef } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  Button,
} from "react-native";

const CreateView = (props) => {
  const { title, description } = props;

  const [value, onChangeText] = React.useState("Useless Placeholder");

  //textInputRef.current.focus();
  const show = props.show ? "1" : "0";
  console.log(show);

  return (
    <View style={{ ...styles.container, opacity: show }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        onPress={() => console.log("hi")}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <TextInput
              ref={props.textInputRef}
              placeholder="Username"
              style={styles.textInput}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 34,
    backgroundColor: "#000000AA",
    height: "100%",
    width: "100%",
    position: "absolute",
  },
  inner: {
    height: 500,
    shadowColor: "#000",
    flex: 1,
    justifyContent: "space-around",
    zIndex: 34,
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  textInput: {
    height: 40,
    borderColor: "#000000",
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  btnContainer: {
    backgroundColor: "white",
    marginTop: 12,
  },
  card: {
    backgroundColor: "#FFF",
    marginVertical: 8,
    marginHorizontal: 16,
    height: 500,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 24,
    borderRadius: 5,
    borderColor: "#DDD",
    borderWidth: 1,
    justifyContent: "center",
  },
});

export default CreateView;
