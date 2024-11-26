import React, { useState } from 'react';
import { Modal, View, StyleSheet, Switch, Button } from 'react-native';
import MyInput from './MyInput';
import MyText from "./MyText"
import { useTheme } from '@react-navigation/native';

const PasswordCustomizationModal = ({ visible, onClose, onGenerate }) => {
  const [passwordLength, setPasswordLength] = useState('');
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);

  const handleLengthChange = (text) => {
    const numericValue = Math.min(Number(text), 50)
    setPasswordLength(numericValue || 0);
  };

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyz" +
      (includeUppercase ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "") +
      (includeNumbers ? "0123456789" : "") +
      (includeSymbols ? "!@#$%^&*()_+[]{}|;:,.<>?" : "");

    if (!charset) {
      onClose();
      return;
    }

    const password = Array.from({ length: passwordLength }, () =>
      charset[Math.floor(Math.random() * charset.length)]
    ).join('');

    onGenerate(password);
    onClose();
  };

  const { colors } = useTheme()
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, {backgroundColor:colors.card}]}>
          <MyText style={{marginVertical:"5%"}} fontSize={20} bold = {true}>Customize Password</MyText>
          <MyInput
            value={passwordLength.toString()}
            onChangeText={handleLengthChange}
            borderWith={1}
            keyboardType="numeric"
            maxLength={2} 
            placeholder="Password Length (Max: 50"
          />
          <View style={styles.optionRow}>
            <MyText>Include Symbols</MyText>
            <Switch value={includeSymbols} onValueChange={setIncludeSymbols} />
          </View>
          <View style={styles.optionRow}>
            <MyText>Include Numbers</MyText>
            <Switch value={includeNumbers} onValueChange={setIncludeNumbers} />
          </View>
          <View style={styles.optionRow}>
            <MyText>Include Uppercase</MyText>
            <Switch value={includeUppercase} onValueChange={setIncludeUppercase} />
          </View>
          <View style={styles.modalButtonContainer}>
            <Button title = "Generate" onPress={generatePassword}/>
            <Button title = "Cancel" onPress={onClose}/>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PasswordCustomizationModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: "5%",
    borderRadius: 10,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: "2%",
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap:10,
    width: '100%',
    marginTop: "5%",
  },
});
