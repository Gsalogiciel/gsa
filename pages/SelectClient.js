import AsyncStorage from '@react-native-async-storage/async-storage'; 
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Searchbar } from 'react-native-paper';
import axios from 'axios';
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-elements';

const Clients2 = () => {
    const [key, setKey] = useState('');
    const [responseData, setResponseData] = useState([]);
    const [num, setNum] = useState(100);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const randnum = Math.random().toString(36).substring(7); // Génère un numéro aléatoire unique

    const navigation = useNavigation();

    const filteredData = responseData
        .filter(item => item.ClientP.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, num);

    const handleapiSpecial = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                'https://gsaaouabdia.com/GSAsoftware/Admin_Gsa/page_administration/apis/clients.php',
                { key: key }
            );
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
                keyExtractor={(item) => item.ClientP}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate("Ajouter une Facture", {
                            valclient: item.ClientP,
                            randnum: randnum
                        })}
                    >
                        <Icon name="person-circle-outline" size={30} color="#007BFF" />
                        <Text style={styles.clientName}>{item.ClientP}</Text>
                    </TouchableOpacity>
                )}
                ListFooterComponent={
                    <View style={styles.footer}>
                        <Button
                            onPress={() => setNum(num + 100)}
                            buttonStyle={styles.loadMoreButton}
                            title="Afficher Plus"
                            titleStyle={styles.loadMoreButtonText}
                            loading={loading}
                        />
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
        paddingHorizontal: 16,
    },
    searchInput: {
        marginVertical: 16,
        borderRadius: 30,
        elevation: 3,
        backgroundColor: '#FFFFFF',
    },
    card: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        shadowColor: '#00000020',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    clientName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    footer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    loadMoreButton: {
        backgroundColor: "#007BFF",
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    loadMoreButtonText: {
        fontSize: 16,
        fontWeight: '500',
    },
});

export default Clients2;
