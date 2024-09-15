import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';

const Account = ({ children, buttonPress, extraStyle, createdAt }) => {
    const { colors } = useTheme();
    return (
        <View style={[styles.con, extraStyle, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <View style={{ width: "80%" }}>
                <Text style={[styles.myText, { color: colors.text, fontWeight: "bold" }]}>{children}</Text>
                <Text style={[styles.mySubText, { color: colors.text }]}>
                    Created {new Date(createdAt).toLocaleDateString()} 
                </Text>
            </View>
            <TouchableOpacity onPress={buttonPress}>
                <AntDesign name="arrowright" size={23} color={colors.text} />
            </TouchableOpacity>
        </View>
    );
}

export default Account;

const styles = StyleSheet.create({
    myText: {
        maxWidth: "80%",
    },
    mySubText: {
        maxWidth: "80%",
        fontSize: 12,
        opacity: 0.5
    },
    con: {
        borderTopWidth: 1,
        width: '100%',
        paddingVertical: '4%',
        paddingHorizontal: "5%",
        marginHorizontal: '3%',
        alignSelf: 'center',
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    }
});
