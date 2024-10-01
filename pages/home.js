import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from "react-native-vector-icons/Ionicons";
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Home = ({ route }) => {
    const navigation = useNavigation();
    const { storedUsername } = route.params;
    const [key, setKey] = useState('');
    const [responseData, setResponseData] = useState([]);
    const limitedData = responseData.slice(0, 1);
    const [responseData2, setResponseData2] = useState([]);
    const limitedData2 = responseData2.slice(0, 1);
    const [responseData3, setResponseData3] = useState([]);
    const limitedData3 = responseData3.slice(0, 1);

    useEffect(() => {
        if (!storedUsername) {
            navigation.navigate("Login");
        }
    }, [storedUsername]);

    useEffect(() => {
        const checkItem = async () => {
            try {
                const username2 = await AsyncStorage.getItem('username');
                const value5 = await AsyncStorage.getItem('mac');
                setKey(value5);
            } catch (error) {
                console.error('Failed to get item:', error);
            }
        };
        checkItem();
    }, []);

    const handleapiSpecial = async () => {
        const response = await axios.post(
            'https://gsaaouabdia.com/GSAsoftware/Admin_Gsa/page_administration/apis/totstock.php',
            JSON.stringify({ key: key })
        );
        setResponseData(response.data);
    };

    const handleapiSpecial2 = async () => {
        const response2 = await axios.post(
            'https://gsaaouabdia.com/GSAsoftware/Admin_Gsa/page_administration/apis/totstock2.php',
            JSON.stringify({ key: key })
        );
        setResponseData2(response2.data);
    };

    const handleapiSpecial3 = async () => {
        const response3 = await axios.post(
            'https://gsaaouabdia.com/GSAsoftware/Admin_Gsa/page_administration/apis/totstock3.php',
            JSON.stringify({ key: key, storedUsername: storedUsername })
        );
        setResponseData3(response3.data);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            handleapiSpecial();
            handleapiSpecial2();
            handleapiSpecial3();
        }, 90000);

        return () => clearInterval(interval);
    }, [key, storedUsername]);

    const renderItem = (item) => (
        <Text style={styles.cardValue}> {item.total_products} </Text>
    );
    const renderItem2 = (item) => (
        <Text style={styles.cardValue}> {item.total_products} </Text>
    );
    const renderItem3 = (item) => (
        <Text style={styles.cardValue}> {item.total_products} </Text>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Image
                    style={styles.logo}
                    source={require('../assets/logo2.png')}
                    resizeMode="contain"
                />
                <Text style={styles.welcomeText}>Bienvenue, {storedUsername}</Text>
                <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={() => navigation.navigate('Paramaître')}
                >
                    <Icon name="settings-outline" size={30} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.cardRow}>
                    <View style={styles.card}>
                        <Icon name="layers-outline" size={30} color="#4A90E2" />
                        <Text style={styles.cardTitle}>Total Produits</Text>
                        <FlatList
                            data={limitedData}
                            renderItem={({ item }) => renderItem(item)}
                        />
                    </View>

                    <View style={styles.card}>
                        <Icon name="people-outline" size={30} color="#4A90E2" />
                        <Text style={styles.cardTitle}>Total Clients</Text>
                        <FlatList
                            data={limitedData2}
                            renderItem={({ item }) => renderItem2(item)}
                        />
                    </View>
                </View>

                <View style={styles.cardRow}>
                    <View style={styles.card}>
                        <Icon name="document-text-outline" size={30} color="#4A90E2" />
                        <Text style={styles.cardTitle}>Total Factures</Text>
                        <FlatList
                            data={limitedData3}
                            renderItem={({ item }) => renderItem3(item)}
                        />
                    </View>

                    <View style={styles.card}>
                        <Icon name="repeat-outline" size={30} color="#4A90E2" />
                        <Button
                            title="Mis à jour"
                            buttonStyle={styles.button}
                            titleStyle={styles.buttonTitle}
                            onPress={() => {
                                handleapiSpecial();
                                handleapiSpecial2();
                                handleapiSpecial3();
                            }}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    header: {
        height: 180,
        backgroundColor: "#4A90E2",
        borderBottomRightRadius: 50,
        borderBottomLeftRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    logo: {
        width: 100,
        height: 50,
    },
    welcomeText: {
        color: "white",
        fontSize: 22,
        marginTop: 10,
        fontWeight: 'bold',
    },
    settingsButton: {
        position: 'absolute',
        right: 20,
        top: 40,
        backgroundColor: '#ffffff50',
        borderRadius: 25,
        padding: 10,
        elevation: 5,
    },
    statsContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    card: {
        backgroundColor: "white",
        flex: 1,
        height: 150,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
        paddingHorizontal: 15,
        paddingVertical: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 16,
        color: "#333",
        marginTop: 10,
        marginBottom: 5,
        fontWeight: '600',
    },
    cardValue: {
        fontSize: 18,
        color: "#4A90E2",
        fontWeight: '700',
    },
    button: {
        backgroundColor: '#4A90E2',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    buttonTitle: {
        fontSize: 16,
        fontWeight: '600',
    }
});

export default Home;
