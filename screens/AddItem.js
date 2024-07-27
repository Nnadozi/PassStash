import { StyleSheet, TextInput, View, Button } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const AddItem = () => {
  const navigation = useNavigation();
  const [identifier, setIdentifier] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  async function setItem() {
    try {
      const item = {
        identifier: identifier,
        userName: userName,
        password: password,
      };
      await AsyncStorage.setItem(`${identifier}_info`, JSON.stringify(item));
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        value={identifier}
        onChangeText={text => setIdentifier(text)}
        style={styles.input}
        placeholder='Identifier (ex: Youtube)'
        placeholderTextColor={"lightgray"}
        maxLength={50}
      />
      <TextInput
        value={userName}
        onChangeText={text => setUserName(text)}
        style={styles.input}
        placeholder='Username / Email (ex: JohnDoe237)'
        placeholderTextColor={"lightgray"}
        maxLength={50}
      />
      <TextInput
        value={password}
        onChangeText={text => setPassword(text)}
        style={styles.input}
        placeholder='Password (ex: Password123)'
        placeholderTextColor={"lightgray"}
        maxLength={50}
      />
      <View style = {{marginVertical:"3%"}} />
      <Button disabled = {
        identifier.length === 0 || userName.length === 0 || password.length === 0 ? true : false
        } title="Create" onPress={() => setItem() }/>
      <View style = {{margin:'2%'}}></View>
      <Button color={"red"} title = "Cancel" onPress={() => navigation.goBack()} />
    </View>
  );
}

export default AddItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: "10%",
    backgroundColor: '#fff'
  },
  input: {
    width: '100%',
    paddingVertical: "5%",
    paddingHorizontal: "2%",
    marginVertical: "2%",
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: "gray"
  },
});
