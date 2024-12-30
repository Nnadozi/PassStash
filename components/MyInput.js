import { StyleSheet, TextInput } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';

const MyInput = (props) => {
  const { colors } = useTheme();

  return (
    <TextInput
      value={props.value} 
      onChangeText={props.onChangeText} 
      style={[
        styles.input,
        {
          borderColor: colors.card, 
          color: colors.text, 
          backgroundColor: colors.card,
          borderWidth: 1, 
          borderColor: colors.border,
          ...(props.thin ? { height: "12%", padding: "3%" } : {}) 
        },
        props.style
      ]}
      placeholder={props.placeholder}
      placeholderTextColor={"gray"}
      maxLength={props.maxLength}
      textAlign="left"
      keyboardType={props.keyboardType}
      secureTextEntry={props.secureTextEntry}
    />
  );
};

export default MyInput;

const styles = StyleSheet.create({
  input: {
    width: '100%',
    marginVertical: '2%',
    borderRadius: 5,
    padding: '5%', // Default padding
  },
});
