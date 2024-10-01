import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Searchbar, TextInput } from 'react-native-paper';

const Stock = () => {
    const [responseData, setResponseData] = useState([]);
    const [key2, setKey] = useState('');
    const [user, setUser] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [num, setNum] = useState(100);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const username2 = await AsyncStorage.getItem('username');
                const value5 = await AsyncStorage.getItem('mac');
                setKey(value5);
                setUser(username2);
                handleApiSpecial(value5);
            } catch (error) {
                console.error('Failed to get item:', error);
            }
        };
        fetchData();
    }, []);

    const handleApiSpecial = async (key) => {
        setLoading(true);
        try {
            const response = await fetch('https://gsaaouabdia.com/GSAsoftware/Admin_Gsa/page_administration/apis/index.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key2: key })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setResponseData(data);
        } catch (error) {
            console.error('API error:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await handleApiSpecial(key2);
        setRefreshing(false);
    }, [key2]);

    // Local filtering based on search query
    const filteredData = responseData
        .filter(item => item.des0.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, num); // Filter and limit the results

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
                <Text style={styles.itemPrice}>{`${parseFloat(item.prixG).toFixed(2).replace('.', ',')} DA`}</Text>
                <Text style={styles.itemQty}>{`QTY: ${item.qty0}`}</Text>
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
                <TextInput
                    placeholder="Recherche Produit"
                    onChangeText={setSearchQuery}
                    style={styles.searchInput}
                    iconColor="#007BFF"
                />
                <Text style={styles.articlesTitle}>Produits</Text>
            </View>
            <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListFooterComponent={footerComponent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                contentContainerStyle={styles.flatListContent}
                keyboardShouldPersistTaps="handled"
            />
        </>

    );
};

const styles = StyleSheet.create({
    searchInput: {
        marginHorizontal: 16,
        marginVertical: 12,
        
        elevation: 3,
        backgroundColor: '#FFFFFF',
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
        backgroundColor: '#ffffff',
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
        fontSize: 16,
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

export default Stock;
