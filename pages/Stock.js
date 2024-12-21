import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';
import axios from 'axios';

const Stock = () => {
    const [responseData, setResponseData] = useState([]);
    const [key2, setKey] = useState('');
    const [user, setUser] = useState('');
    const [num, setNum] = useState(50);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const limitData = responseData.slice(0, num);

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const username = await AsyncStorage.getItem('username');
                const mac = await AsyncStorage.getItem('mac');
                setKey(mac);
                setUser(username);
                await fetchStockData(mac);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    // Fetch stock data from API
    const fetchStockData = async (key) => {
        setLoading(true);
        try {
            const response = await axios.post(
                'https://gsaaouabdia.com/GSAsoftware/Admin_Gsa/page_administration/apis/index.php',
                JSON.stringify({ key2: key })
            );
            setResponseData(response.data);
        } catch (error) {
            console.error('API error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle search
    const handleSearch = async (searchValue) => {
        if (!searchValue) {
            fetchStockData(key2);
        } else {
            try {
                const response = await axios.post(
                    'https://gsaaouabdia.com/GSAsoftware/Admin_Gsa/page_administration/apis/search.php',
                    JSON.stringify({ search: searchValue, key2 })
                );
                setResponseData(response.data);
            } catch (error) {
                console.error('Search error:', error);
            }
        }
    };

    // Refresh handler
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchStockData(key2);
        setRefreshing(false);
    }, [key2]);

    // Render each item
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() =>
                navigation.navigate('Ajouter au Liste', {
                    des: item.des0,
                    ref: item.ref0,
                    prixG: item.prixG,
                    qty0: item.qty0,
                    section: item.section0,
                    mac: item.mac0,
                    user,
                    idstock: item.id_stock,
                    marque: item.marque0,
                })
            }
        >
            <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>{item.des0}</Text>
                <Text style={styles.itemSubtitle}>{item.ref0}</Text>
            </View>
            <View style={styles.itemPriceQty}>
                <Text style={styles.itemPrice}>{`${parseFloat(item.prixG).toFixed(2).replace('.', ',')} DA`}</Text>
                <Text style={styles.itemQty}>{`QTY: ${item.qty0}`}</Text>
            </View>
        </TouchableOpacity>
    );

    // Footer for FlatList
    const footerComponent = () => (
        <View style={styles.footerContainer}>
            <Button
                title="Afficher Plus Produits... +"
                buttonStyle={styles.loadMoreButton}
                onPress={() => setNum(num + 50)}
                disabled={loading}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Recherche Produit"
                onChangeText={handleSearch}
                style={styles.searchInput}
            />
            <Text style={styles.articlesTitle}>Produits</Text>
            <FlatList
                data={limitData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id_stock.toString()}
                ListFooterComponent={footerComponent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={
                    !loading && <Text style={styles.emptyText}>Aucun produit trouvé.</Text>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    searchInput: {
        marginHorizontal: 16,
        marginVertical: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        elevation: 2,
        padding: 10,
    },
    articlesTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginHorizontal: 16,
        marginVertical: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 10,
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
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    itemSubtitle: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    itemPriceQty: {
        flex: 1,
        alignItems: 'flex-end',
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: '#007BFF',
    },
    itemQty: {
        fontSize: 12,
        color: '#28A745',
        marginTop: 4,
    },
    footerContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    loadMoreButton: {
        backgroundColor: '#007BFF',
        borderRadius: 5,
        paddingHorizontal: 30,
        paddingVertical: 12,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#888',
        marginTop: 20,
    },
});

export default Stock;
