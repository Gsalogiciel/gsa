import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from "react-native-vector-icons/Ionicons";
import axios from 'axios';

const API_URL = 'https://gsaaouabdia.com/GSAsoftware/Admin_Gsa/page_administration/apis/panier.php';

const Panier = ({ route }) => {
    const [data, setData] = useState([]);
    const [totale, setTotale] = useState(0);
    const [tva, setTva] = useState(0);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();
    const { user, key } = route.params;

    // Fetch cart data
    const handleApiSpecial = async () => {
        setLoading(true);
        try {
            const response = await axios.post(API_URL, JSON.stringify({ key, user }));
            setData(response.data);
            calculateTotals(response.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate totals
    const calculateTotals = (data) => {
        const total = data.reduce((sum, item) => sum + item.prix0 * item.qty0, 0);
        setTotale(total);
    };

    useEffect(() => {
        handleApiSpecial();
    }, [key]);

    const handleDelete = async (id) => {
        try {
            await axios.post("https://gsaaouabdia.com/GSAsoftware/Admin_Gsa/page_administration/apis/del.php", JSON.stringify({ id, user, key }));
            handleApiSpecial(); // Refresh data after deletion
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };

    const handleDeleteAll = async () => {
        try {
            await axios.post("https://gsaaouabdia.com/GSAsoftware/Admin_Gsa/page_administration/apis/delAll.php", JSON.stringify({ user, key }));
            handleApiSpecial(); // Refresh data after deleting all items
        } catch (error) {
            console.error('Failed to delete all items:', error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>{item.des0}</Text>
                <Text style={styles.itemSubtitle}>{item.ref0}</Text>
                <Text style={styles.itemQuantity}>QTY: {item.qty0}</Text>
                <Text style={styles.itemPrice}>{item.prix0} DA</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                <Icon name="close" size={24} color="#FF3B30" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate("Stock")} style={styles.addButton}>
                <Text style={styles.addButtonText}>Ajouter Nouveau Article</Text>
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.scrollView}>
                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#4A90E2" />
                    </View>
                ) : (
                    <>
                        <FlatList
                            data={data}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderItem}
                        />
                        {data.length > 0 && (
                            <Button onPress={handleDeleteAll} title="Supprimer Tous" buttonStyle={styles.deleteAllButton} />
                        )}
                        {data.length === 0 && (
                            <View style={styles.noItemsContainer}>
                                <Text style={styles.noItemsText}>Aucun Article Trouvé</Text>
                            </View>
                        )}
                        <View style={styles.footerSpacing} />
                    </>
                )}
            </ScrollView>
            <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total HT:</Text>
                <Text style={styles.totalAmount}>{totale.toFixed(2)} DA</Text>
            </View>
            <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>TVA ({tva}%)</Text>
            </View>
            <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total TTC:</Text>
                <Text style={styles.totalAmount}>{(totale * (1 + tva / 100)).toFixed(2)} DA</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Ajouter une Facture", { valclient: 'nulldfgsdgfdsghtergtergergergterhjytlkyuilo' })} style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Valider La Commande</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    scrollView: {
        flexGrow: 1,
        paddingHorizontal: 16,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#00000029',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    itemDetails: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    itemSubtitle: {
        fontSize: 14,
        color: '#777',
    },
    itemQuantity: {
        fontSize: 14,
        color: '#4CAF50',
        marginTop: 4,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: '#D32F2F',
        marginTop: 4,
    },
    deleteButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    deleteAllButton: {
        backgroundColor: '#D32F2F',
        borderRadius: 8,
        margin: 16,
    },
    loaderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 300,
    },
    noItemsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 300,
    },
    noItemsText: {
        fontSize: 16,
        color: '#888',
    },
    footerSpacing: {
        paddingBottom: 80,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderTopColor: '#DDDDDD',
        borderTopWidth: 1,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: '600',
        color: '#D32F2F',
    },
    confirmButton: {
        backgroundColor: '#4A90E2',
        borderRadius: 8,
        margin: 16,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButton: {
        backgroundColor: '#7B61FF',
        borderRadius: 8,
        margin: 16,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default Panier;
