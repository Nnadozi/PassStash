import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useState, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const Home = ({ navigation }) => {
  const [itemsArray, setItemsArray] = useState([]);

  const fetchItems = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      setItemsArray(keys);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchItems();
    }, [])
  );

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <FlatList
        style={{ width: "100%" }}
        data={itemsArray}
        renderItem={({ item, index }) =>
          <View style={[styles.item, index === itemsArray.length - 1 && styles.lastItem]}>
            <Text>{item.substring(0,item.indexOf("_"))}</Text>
            <Button title="→" onPress={() => navigation.navigate("View Item", { key: item })} />
          </View>
        }
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  item: {
    borderTopWidth: 1,
    borderColor: 'lightgray',
    backgroundColor: 'white',
    width: '100%',
    paddingVertical: '3%',
    paddingHorizontal: "5%",
    marginHorizontal: '3%',
    alignSelf: 'center',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastItem: {
    borderWidth: 1
  },
});
