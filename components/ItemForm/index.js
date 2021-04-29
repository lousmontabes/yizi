import React, { useRef } from 'react';
import { StyleSheet, TextInput, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';

import theme from '../../constants/themes';

const ItemForm = (props) => {
  const { onChangeTitle, onChangeSubtitle, onSubmit, title, subtitle } = props;

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

  const presentInput = (input) => {
    return input.trimLeft().replace('\n', '');
  };

  const onSubmitTitle = () => {
    subtitleInputRef.current.focus();
  };

  const isInputValid = (input) => {
    return input.trim() !== '';
  };

  const submit = () => {
    const isTitleValid = isInputValid(title);
    const isSubtitleValid = isInputValid(subtitle);

    if (isTitleValid && isSubtitleValid) {
      Haptics.impactAsync();
      onSubmit();
    } else {
      !isTitleValid && startShake(titleShake);
      !isSubtitleValid && startShake(subtitleShake);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  return (
    <>
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
          onChangeText={(text) => {
            onChangeTitle(presentInput(text));
          }}
          onSubmitEditing={onSubmitTitle}
          placeholder="New yizi"
          placeholderTextColor={theme.text}
          selectionColor={theme.selection}
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
          onChangeText={(text) => {
            onChangeSubtitle(presentInput(text));
          }}
          onSubmitEditing={submit}
          placeholder="Its deep meaning"
          placeholderTextColor={theme.text}
          selectionColor={theme.selection}
          style={styles.subtitleInput}
          enablesReturnKeyAutomatically
          returnKeyType="done"
          scrollEnabled={false}
        />
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  titleInput: {
    textAlign: 'center',
    fontSize: 42,
    fontFamily: 'Avenir',
    fontWeight: '500',
    marginHorizontal: 15,
    color: theme.text,
  },
  subtitleInput: {
    textAlign: 'center',
    fontSize: 28,
    fontFamily: 'Avenir',
    marginHorizontal: 15,
    color: theme.text,
    opacity: 0.8,
  },
});

export default ItemForm;
