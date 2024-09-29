import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';

const Account = ({ children, buttonPress, extraStyle, createdAt }) => {
    const { colors } = useTheme();
    return (
        <View style={[styles.con, extraStyle, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <View style={{ width: "80%" }}>
                <Text style={[styles.myText, { color: colors.text, fontWeight: "bold" }]}>{children}</Text>
                <View style = {{flexDirection:"row", opacity:0.5, alignItems:"center"}}>
                    <Entypo name="calendar" size={11} color={colors.text} />
                    <Text style={[styles.mySubText, { color: colors.text }]}>
                        Created {new Date(createdAt).toLocaleDateString()} 
                    </Text>
                </View>
            </View>
            <TouchableOpacity onPress={buttonPress}>
                <AntDesign name="arrowright" size={20} color={colors.text} />
            </TouchableOpacity>
        </View>
    );
}

export default Account;

const styles = StyleSheet.create({
    myText: {
    fontSize:16
    },
    mySubText: {
        maxWidth: "90%",
        fontSize: 12,
        marginHorizontal:"1%"
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
