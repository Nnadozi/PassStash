import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './screens/Home';
import AddItem from './screens/AddItem';
import ViewItem from './screens/ViewItem';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const Stack = createNativeStackNavigator();

function AddItemIcon() {
  const navigation = useNavigation();
  return (
    <Ionicons
      onPress={() => navigation.navigate('Add Item')}
      name="add"
      size={20}
      color="#007AFF"
    />
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          gestureEnabled: false,
        }}
      >
        <Stack.Screen
          name="Items"
          component={Home}
          options={{
            headerTitle: 'Items',
            headerLeft: () => <AddItemIcon />
          }}
        />
        <Stack.Screen name="Add Item" component={AddItem} options={{presentation:"modal"}} />
        <Stack.Screen name="View Item" component={ViewItem} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
