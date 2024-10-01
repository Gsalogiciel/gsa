import { StyleSheet, View, Text, FlatList, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Icon from "react-native-vector-icons/Ionicons";
import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';

const Orders = () => {
    const navigation = useNavigation();
    const [key, setKey] = useState('');
    const [user, setUser] = useState('');
    const [responseData, setResponseData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const onRefresh = async () => {
        setRefreshing(true);
        await handleApiSpecial();
        setRefreshing(false);
    };

    const handleApiSpecial = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                'https://gsaaouabdia.com/GSAsoftware/Admin_Gsa/page_administration/apis/dem.php',
                JSON.stringify({ key, user })
            );
            setResponseData(response.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await handleApiSpecial();
        };
        fetchData();
    }, [key, user]);

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

    const deleteCommande54 = async (id) => {
        try {
            await axios.post(
                'https://gsaaouabdia.com/GSAsoftware/Admin_Gsa/page_administration/apis/delete_commande.php',
                JSON.stringify({ id })
            );
            await handleApiSpecial(); // Refresh the list after deletion
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };

    const filterData = useCallback(() => {
        let filtered = responseData;
        if (searchQuery) {
            filtered = filtered.filter(item =>
                item.nameD.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.id_com.toString().includes(searchQuery)
            );
        }
        setFilteredData(filtered);
    }, [searchQuery, responseData]);

    useEffect(() => {
        filterData();
    }, [searchQuery, filterData]);

    const debouncedFilterData = useCallback(
        _.debounce(() => filterData(), 300),
        [filterData]
    );

    useEffect(() => {
        debouncedFilterData();
    }, [searchQuery, debouncedFilterData]);

    const renderItem = ({ item }) => (

        <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate("Bon", { id: item.id_com })}>
            <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>{item.nameD}</Text>
                <Text style={styles.itemId}>ID: {item.id_com}</Text>
                {item.payD == false && item.nopayD == true ? (
                    <Text style={styles.itemPhone}>Status: No payée</Text>

                ) : (

                    item.payD == false && item.nopayD == false ? (
                        <Text style={styles.itemPhone}>Versement: {item.versementD} DA</Text>

                    ) : (

                        item.payD == true && item.nopayD == false ? (
                            <Text style={styles.itemPhone2}>Status: Payée</Text>

                        ) : (
                            ""
                        )
                    )


                )}
            </View>
            <View style={styles.itemDateContainer}>
                <Text style={styles.itemDate}>Date: {item.date}</Text>
            </View>
            <Button
                icon={<Icon name="trash-outline" size={20} color="white" />}
                buttonStyle={styles.deleteButton}
                onPress={() => deleteCommande54(item.id_com)}
            />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Input
                placeholder='Recherche Commande'
                leftIcon={<Icon name='search-outline' size={20} color='gray' />}
                inputStyle={styles.searchInput}
                onChangeText={text => setSearchQuery(text)}
                value={searchQuery}
            />
            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id_com.toString()}
                renderItem={renderItem}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListFooterComponent={
                    loading && (
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size="large" color="#4A90E2" />
                        </View>
                    )
                }
                contentContainerStyle={styles.flatListContent}
                ListEmptyComponent={
                    !loading && <Text style={styles.emptyText}>Aucune Facture Trouvée.</Text>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    searchInput: {
        fontSize: 16,
        paddingVertical: 8,
        paddingLeft: 10,
        color: '#333',
        marginBottom: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 16,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        gap: 10,
    },
    itemDetails: {
        flex: 1,
        marginRight: 8,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    itemId: {
        color: '#6B7280',
        fontSize: 13,
        marginVertical: 2,
    },
    itemPhone: {
        color: '#EF4444',
        fontSize: 13,
        marginVertical: 2,
    },
    itemPhone2: {
        color: 'green',
        fontSize: 13,
        marginVertical: 2,
    }
    ,
    itemDateContainer: {
        alignItems: 'flex-end',
    },
    itemDate: {
        fontSize: 13,
        color: '#9CA3AF',
    },
    deleteButton: {
        backgroundColor: '#EF4444',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginLeft: 5,
    },
    loaderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    emptyText: {
        textAlign: 'center',
        color: '#888',
        marginVertical: 20,
    },
    flatListContent: {
        paddingBottom: 80,
    },
});

export default Orders;
