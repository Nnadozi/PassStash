import React, { useState, useCallback } from 'react';
import { StyleSheet, View, SectionList, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { useTheme } from '@react-navigation/native';
import Account from '../components/Account.js';
import MyText from "../components/MyText.js";
import MyInput from "../components/MyInput.js"

const Home = ({ navigation }) => {
    const { colors } = useTheme();
    const [itemsArray, setItemsArray] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

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

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const groupedData = itemsArray.reduce((acc, item) => {
        const firstLetter = item.identifier[0].toUpperCase();
        const existingSection = acc.find(section => section.title === firstLetter);
        if (existingSection) {
            existingSection.data.push(item);
        } else {
            acc.push({ title: firstLetter, data: [item] });
        }
        return acc;
    }, []);

    const filteredData = groupedData.map(section => ({
        title: section.title,
        data: section.data.filter(item => item.identifier.toLowerCase().includes(searchQuery.toLowerCase()))
    })).filter(section => section.data.length > 0);

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <MyInput
                style = {{padding:"3%"}}
                    placeholder="Search..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>
            {filteredData.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MyText opacity={0.5}>You have no accounts.</MyText>
                    <MyText opacity={0.5}>Press "+" to get started.</MyText>
                </View>
            ) : (
                <SectionList
                    style={styles.list}
                    sections={filteredData}
                    renderItem={({ item, index, section }) => (
                        <Account
                            extraStyle={
                                index === section.data.length - 1
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
                    renderSectionHeader={({ section }) => (
                        <View style={{ padding: "3%" }}>
                            <MyText bold={true}>{section.title}</MyText>
                        </View>
                    )}
                    keyExtractor={(item) => item.key}
                    contentContainerStyle={styles.contentContainer}
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
    searchContainer: {
        width: '100%',
        padding: '2%',
    },
    searchBar: {
        width: '95%',
        height: 40,
        borderRadius: 5,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    emptyContainer: {
        position: 'absolute',
        top: '45%',
        alignItems: 'center',
    },
    list: {
        flex: 1,
        width: '100%',
    },
    contentContainer: {
        paddingBottom: "25%",
    },
    lastItem: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
});
