import { Button, FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import React, { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { useTheme } from '@react-navigation/native';
import Account from "../components/Account.js";

const Home = ({ navigation }) => {
    const { colors } = useTheme();
    const [itemsArray, setItemsArray] = useState([]);

    const fetchItems = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const items = await Promise.all(
                keys.map(async (key) => {
                    const item = JSON.parse(await AsyncStorage.getItem(key));
                    return { key, ...item };
                })
            );
            setItemsArray(items);
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
            {
                itemsArray.length === 0
                    ?
                    <View style={{ position: "absolute", top: "45%" }}>
                        <Text style={[styles.emptyText, { color: colors.text }]}>You have no accounts.</Text>
                        <Text style={[styles.emptyText, { color: colors.text }]}>Press "+" to get started.</Text>
                    </View>
                    :
                    <FlatList
                        style={{ width: "100%" }}
                        data={itemsArray}
                        renderItem={({ item, index }) =>
                            <Account
                                extraStyle={index === itemsArray.length - 1 ? styles.lastItem :
                                    index === 0 ? styles.firstItem : null}
                                buttonPress={() => navigation.navigate("View Item", { key: item.key })}
                                createdAt={item.createdAt} 
                            >
                                {item.identifier}
                            </Account>
                        }
                        keyExtractor={(item) => item.key}
                    />
            }
            <View style={{ position: "absolute", bottom: "0%" }}>
                <BannerAd
                    unitId={process.env.EXPO_PUBLIC_UNIT_ID}
                    size={BannerAdSize.BANNER}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: true,
                    }}
                />
            </View>
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    item: {
        borderTopWidth: 1,
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
        borderTopWidth: 1,
        borderBottomWidth: 1
    },
    firstItem: {},
    emptyText: {
        opacity: 0.25,
        textAlign: "center"
    }
});
