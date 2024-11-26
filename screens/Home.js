import React, { useState, useCallback } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { useTheme } from '@react-navigation/native';
import Account from '../components/Account.js';
import MyText from "../components/MyText.js"

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
            console.error('Failed to fetch items:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchItems();
        }, [])
    );

    return (
        <View style={styles.container}>
            {itemsArray.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MyText opacity={0.5}>You have no accounts.</MyText>
                    <MyText opacity={0.5}>Press "+" to get started.</MyText>
                </View>
            ) : (
                <FlatList
                    style={styles.list}
                    data={itemsArray}
                    renderItem={({ item, index }) => (
                        <Account
                            extraStyle={
                                index === itemsArray.length - 1
                                    ? styles.lastItem
                                    : index === 0
                                    ? styles.firstItem
                                    : null
                            }
                            buttonPress={() => navigation.navigate('View Item', { key: item.key })}
                            createdAt={item.createdAt}
                        >
                            {item.identifier}
                        </Account>
                    )}
                    keyExtractor={(item) => item.key}
                />
            )}
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
    container: {
        flex: 1,
        alignItems: 'center',
    },
    emptyContainer: {
        position: 'absolute',
        top: '45%',
        alignItems: 'center',
    },
    list: {
        width: '100%',
    },
    lastItem: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
});
