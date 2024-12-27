import { StyleSheet, Text } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';

const MyText = ({ children, style, bold, fontSize = 14, opacity }) => {
  const { colors } = useTheme();

  return (
    <Text
      style={[
        style,
        { color: colors.text },
        bold && { fontWeight: 'bold' }, 
        fontSize && { fontSize }, 
        opacity && { opacity },
      ]}
    >
      {children}
    </Text>
  );
};

export default MyText;

const styles = StyleSheet.create({});
