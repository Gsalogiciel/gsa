import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, RefreshControl, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { Button } from 'react-native-elements';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Stock2 = () => {
    const [responseData, setResponseData] = useState([]);
    const [key2, setKey] = useState('');
    const [user, setUser] = useState('');
    const [search, setSearch] = useState('');
    const [num, setNum] = useState(100);
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        handleapiSpecial();

        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    };

    useEffect(() => {
        const checkItem = async () => {
            try {
                const username2 = await AsyncStorage.getItem('username');
                const value5 = await AsyncStorage.getItem('mac');
                setKey(value5);
                setUser(username2);
            } catch (error) {
                console.error('Failed to get item:', error);
            }
        };
        checkItem();
    }, []);

    const handleSearch = async (searchValue) => {
        setSearch(searchValue);
        if (searchValue === '') {
            handleapiSpecial();
        } else {
            const response2 = await axios.post(
                'https://gsaaouabdia.com/GSAsoftware/Admin_Gsa/page_administration/apis/search.php',
                JSON.stringify({ search: searchValue, key2: key2 })
            );
            setResponseData(response2.data);
        }
    };

    const handleapiSpecial = async () => {
        fetch('https://gsaaouabdia.com/GSAsoftware/Admin_Gsa/page_administration/apis/index.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key2: key2 })
        })
            .then(response => response.json())
            .then(data => setResponseData(data))
            .catch(error => console.error('Error:', error));
    };


    useEffect(() => {
        handleapiSpecial();
    }, [key2])


    const uniqueData = Array.from(new Set(responseData.map(item => item.ref0)))
        .map(ref => {
            return responseData.find(item => item.ref0 === ref)
        });

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate("Ajouter au Liste", {
                des: item.des0,
                ref: item.ref0,
                prixG: item.prixG,
                qty0: item.qty0,
                section: item.section0,
                mac: item.mac0,
                user: user
            })}
            style={styles.itemContainer}
        >
            <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>{item.des0}</Text>
                <Text style={styles.itemSubtitle}>{item.ref0}</Text>
            </View>
            <View style={styles.itemPriceQty}>
                <Text style={styles.itemPrice}>{parseInt(item.prixG).toFixed(2).replace('.', ',')} DA</Text>
                <Text style={styles.itemQty}>QTY: {item.qty0}</Text>
            </View>
        </TouchableOpacity>
    );




    const footerComponent = () => (
        <View style={styles.footerContainer}>
            <Button
                onPress={() => setNum(num + 100)}
                buttonStyle={styles.loadMoreButton}
                title="Afficher Plus Produits... +"
            />
            <View style={styles.footerSpacer}></View>
        </View>
    );

    return (
        <>
            <View>


                <View style={styles.searchContainer}>
                    <Icon name="search-outline" size={20} color="#888" style={styles.searchIcon} />
                    <TextInput
                        placeholder="Recherche Produit"
                        onChangeText={(value) => handleSearch(value)}
                        style={styles.searchInput}
                    />
                </View>

                <Text style={styles.articlesTitle}>Produits</Text>
            </View>
            <FlatList
                data={uniqueData.slice(0, num)}
                renderItem={renderItem}
                keyExtractor={(item) => item.ref0.toString()} // Ensure each key is unique
                ListFooterComponent={footerComponent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                contentContainerStyle={styles.flatListContent}
            />
        </>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    cartButton: {
        backgroundColor: '#007BFF',
        borderRadius: 30,
        margin: 16,
        paddingVertical: 12,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cartButtonText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 10,
        fontWeight: '500',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginVertical: 12,
        backgroundColor: 'white',
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        height: 45,
    },
    searchIcon: {
        paddingLeft: 15,
    },
    searchInput: {
        flex: 1,
        paddingHorizontal: 15,
        fontSize: 15,
        backgroundColor: 'white',
    },
    articlesTitle: {
        marginVertical: 15,
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginLeft: 16,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        justifyContent: 'space-between',
        padding: 15,
        marginHorizontal: 16,
        marginBottom: 10,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    itemDetails: {
        flex: 2,
    },
    itemTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    itemSubtitle: {
        color: '#666',
        fontSize: 14,
        marginTop: 5,
    },
    itemPriceQty: {
        flex: 1,
        alignItems: 'flex-end',
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007BFF',
    },
    itemQty: {
        fontSize: 14,
        color: '#28A745',
        fontWeight: '500',
        marginTop: 5,
    },
    loadMoreButton: {
        backgroundColor: '#007BFF',
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 30,
        alignSelf: 'center',
        marginTop: 20,
    },
    footerSpacer: {
        height: 100,
    },
    footerContainer: {
        alignItems: 'center',
    },
    flatListContent: {
        paddingBottom: 20,
    },
});

export default Stock2;
