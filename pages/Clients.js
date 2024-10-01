import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Searchbar } from 'react-native-paper';
import axios from 'axios';
import { Button } from 'react-native-elements';

const Clients = () => {
    const [key, setKey] = useState('');
    const [responseData, setResponseData] = useState([]);
    const [num, setNum] = useState(100);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredData = responseData
        .filter(item => item.ClientP.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, num);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await handleapiSpecial();
        } finally {
            setRefreshing(false);
        }
    };

    const handleapiSpecial = async () => {
        setLoading(true);
        try {
            const response = await axios.post('https://gsaaouabdia.com/GSAsoftware/Admin_Gsa/page_administration/apis/clients.php', {
                key: key
            });
            setResponseData(response.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleapiSpecial();
    }, [key]);

    useEffect(() => {
        const checkItem = async () => {
            try {
                const value5 = await AsyncStorage.getItem('mac');
                setKey(value5);
            } catch (error) {
                console.error('Failed to get item:', error);
            }
        };
        checkItem();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.clientName}>{item.ClientP}</Text>
            <Text style={styles.credit}>Crédit: <Text style={styles.amount}>{parseInt(item.SoldeP).toFixed(2).replace('.', ',')} DA</Text></Text>
            <Text style={styles.info}>Téléphone: {item.TelP}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Recherche Client"
                value={searchQuery}
                onChangeText={query => setSearchQuery(query)}
                style={styles.searchInput}
                iconColor="#007BFF"
            />
            <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={(item) => item.ClientP.toString()}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListFooterComponent={
                    <View style={styles.loadMoreContainer}>
                        <Button
                            onPress={() => setNum(num + 100)}
                            title="Afficher Plus"
                            buttonStyle={styles.loadMoreButton}
                            titleStyle={styles.loadMoreButtonText}
                        />
                    </View>
                }
                ListEmptyComponent={
                    !loading && <Text style={styles.emptyText}>Aucun client disponible</Text>
                }
            />
            {loading && (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#007BFF" />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F0F0',
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    searchInput: {
        marginBottom: 16,
        borderRadius: 30,
        elevation: 3,
        backgroundColor: '#FFFFFF',
    },
    card: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        marginBottom: 16,
        borderRadius: 12,
        shadowColor: '#00000020',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 2,
    },
    clientName: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    credit: {
        fontSize: 16,
        color: '#666',
        marginVertical: 4,
    },
    amount: {
        fontWeight: 'bold',
        color: '#007BFF',
    },
    info: {
        fontSize: 14,
        color: '#888',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    loadMoreContainer: {
        alignItems: 'center',
        marginVertical: 16,
    },
    loadMoreButton: {
        backgroundColor: '#007BFF',
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    loadMoreButtonText: {
        fontSize: 16,
        fontWeight: '500',
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        marginVertical: 24,
        fontSize: 16,
    },
});

export default Clients;
