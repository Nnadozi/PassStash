import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useTheme } from '@react-navigation/native';
import Home from './screens/Home';
import AddItem from './screens/AddItem';
import ViewItem from './screens/ViewItem';
import { useNavigation, DarkTheme,DefaultTheme } from '@react-navigation/native';
import { Button,TouchableOpacity,useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Stack = createNativeStackNavigator();

function AddItemIcon() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity activeOpacity={0.75}>
      <MaterialIcons 
      name="add" size={27} color={useTheme().colors.text}
      onPress={() => navigation.navigate('Add Item')}
      />
    </TouchableOpacity>
  );
}

export default function App() {
  const scheme = useColorScheme();
  return (
    <>
    <StatusBar />
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator
        screenOptions={{
          gestureEnabled: false,
        }}
      >
        <Stack.Screen
          name="Items"
          component={Home}
          options={{
            headerTitle: 'My Credentials',
            headerLeft: () => <AddItemIcon />,
            headerTitleAlign:"center"
          }}
        />
        <Stack.Screen
           name="Add Item" 
           component={AddItem} 
           options={{
            presentation:"modal",  
            headerTitleAlign:"center",
            headerBackVisible:false,
            headerTitle:"Add Account"
          }}
        />
        <Stack.Screen name="View Item" component={ViewItem} options ={{  
          headerTitleAlign:"center",
          headerTitle: 'Account Credentials',
          headerBackTitle:"Back"
          }} />
      </Stack.Navigator>
    </NavigationContainer>
    </>
  );
}
