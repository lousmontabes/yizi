import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, StyleSheet, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import * as Haptics from 'expo-haptics';

import ItemForm from '../ItemForm';
import storage from '../../utils/storage';

// TODO: Move this to constants
const colors = {
  green: 'rgba(116, 198, 157, 1)',
  black: 'rgba(0, 0, 0, 1)',
  red: 'rgba(217, 119, 119, 1)',
};

const EditView = (props) => {
  const {
    index,
    title,
    subtitle,
    onDelete,
    onFinishEditing,
    revealed,
    editable,
    onEdited,
  } = props;

  const [newTitle, setNewTitle] = useState(title);
  const [newSubtitle, setNewSubtitle] = useState(subtitle);

  const AnimatedIcon = Animated.createAnimatedComponent(Icon);
  const fadeInAnim = useRef(new Animated.Value(0)).current;

  const showDeleteAlert = () => {
    Alert.alert(
      `${title} - ${subtitle}`,
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          onPress: () => {
            fadeInAnim.setValue(0);
            storage.deleteItem({ title, subtitle });
            onDelete();
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const onChangeTitle = (text) => {
    setNewTitle(text);
  };

  const onChangeSubtitle = (text) => {
    setNewSubtitle(text);
  };

  const onSubmit = () => {
    onFinishEditing(newTitle, newSubtitle);
  };

  const storeChanges = () => {
    storage.modifyItem(index, { title: newTitle, subtitle: newSubtitle });
  };

  useEffect(() => {
    setNewTitle(title);
    setNewSubtitle(subtitle);
  }, [title, subtitle]);

  useEffect(() => {
    storeChanges();
    onEdited(newTitle, newSubtitle);
  }, [newTitle, newSubtitle]);

  useEffect(() => {
    if (editable) {
      Animated.timing(fadeInAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeInAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [editable]);

  return (
    <>
      <Animated.View style={{ ...styles.button, opacity: fadeInAnim }}>
        <AnimatedIcon
          size={28}
          reverse
          color="transparent"
          reverseColor={colors.red}
          type="feather"
          name="trash-2"
          onPress={() => {
            Haptics.selectionAsync();
            showDeleteAlert();
          }}
        />
      </Animated.View>
      <ItemForm
        title={editable ? newTitle : title}
        subtitle={editable ? newSubtitle : subtitle}
        onChangeTitle={onChangeTitle}
        onChangeSubtitle={onChangeSubtitle}
        onSubmit={onSubmit}
        editable={editable}
        revealed={revealed || editable}
      />
    </>
  );
};

const Card = (props) => {
  const {
    index,
    title,
    subtitle,
    color,
    revealed,
    editMode,
    onDelete,
    onFinishEditing,
  } = props;

  const [editedTitle, setEditedTitle] = useState(title);
  const [editedSubtitle, setEditedSubtitle] = useState(subtitle);

  const revealAnim = useRef(new Animated.Value(0)).current;

  const revealScale = revealAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  const textColor = color.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [colors.red, colors.black, colors.green],
  });

  const onEdited = (newTitle, newSubtitle) => {
    setEditedTitle(newTitle);
    setEditedSubtitle(newSubtitle);
  };

  /* useEffect(() => {
    onEdited(title, subtitle);
  }, [title, subtitle]); */

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <EditView
          index={index}
          title={editedTitle ? editedTitle : title}
          subtitle={editedSubtitle ? editedSubtitle : subtitle}
          onDelete={onDelete}
          revealed={revealed}
          editable={editMode}
          onEdited={onEdited}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    fontFamily: 'Menlo',
  },
  card: {
    backgroundColor: '#FFF',
    height: 500,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 24,
    borderRadius: 5,
    borderColor: '#EEE',
    borderWidth: 1,
    justifyContent: 'center',
    zIndex: 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 42,
    fontFamily: 'Avenir',
    fontWeight: '500',
  },
  description: {
    textAlign: 'center',
    fontSize: 28,
    fontFamily: 'Avenir',
  },
  titleInput: {
    textAlign: 'center',
    fontSize: 42,
    fontFamily: 'Avenir',
    fontWeight: '500',
    marginHorizontal: 15,
  },
  subtitleInput: {
    textAlign: 'center',
    fontSize: 28,
    fontFamily: 'Avenir',
    marginHorizontal: 15,
  },
  button: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

export default Card;
