import React, { useState, useEffect } from 'react';
import { Modal, ScrollView, View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, Dimensions, FlatList, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { CheckBox } from '@rneui/themed';
import useFetch from './useFetch';  // Import the custom hook
import axios from 'axios';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const API_URL = 'https://gsaaouabdia.com/GSAsoftware/Admin_Gsa/page_administration/apis/panier.php';

const Valide = ({ route }) => {
    const { valclient, randnum } = route.params;
    const navigation = useNavigation();
    const [key, setKey] = useState('');
    const [user, setUser] = useState('');
    const [phone, setPhone] = useState('');
    const [gps, setGps] = useState('');
    const [message, setMessage] = useState('');
    const [message2, setMessage2] = useState('');
    const [loading, setLoading] = useState(false);
    const [productLoading, setProductLoading] = useState(true);
    const [check1, setCheck1] = useState(false);
    const [check2, setCheck2] = useState(false);
    const [check3, setCheck3] = useState(true);
    const [check4, setCheck4] = useState(false);
    const [check5, setCheck5] = useState(false);
    const [vers, setVers] = useState("");
    const [totalHT, setTotalHT] = useState('0,00 DZ');
    const [tva, setTva] = useState('0,00 DZ');
    const [timbre, setTimbre] = useState('0,00 DZ');
    const [totalTTC, setTotalTTC] = useState('0,00 DZ');
    const [billingDate, setBillingDate] = useState('Aujourd\'hui');
    const [showSuccess, setShowSuccess] = useState(false);
    const [data, setData] = useState("");
    // Use the custom hook
    const { data: data2, error, loading: fetchLoading } = useFetch(API_URL, { key, user }, 'POST');

    useEffect(() => {
        if (data2) {
            calculateTotals(data2);
            setProductLoading(false);
        }
    }, [data2]);

    useEffect(() => {
        const fetchData = async () => {
            const username2 = await AsyncStorage.getItem('username');
            const value5 = await AsyncStorage.getItem('mac');

            setKey(value5);
            setUser(username2);
        };

        fetchData();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.post("https://gsaaouabdia.com/GSAsoftware/Admin_Gsa/page_administration/apis/del.php", JSON.stringify({ id, user, key }));
            setProductLoading(true); // Trigger reload
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };

    const handleDeleteAll = async () => {
        try {
            await axios.post("https://gsaaouabdia.com/GSAsoftware/Admin_Gsa/page_administration/apis/delAll.php", JSON.stringify({ user, key }));
            setProductLoading(true); // Trigger reload
        } catch (error) {
            console.error('Failed to delete all items:', error);
        }
    };

    const handleCommande = async () => {
        setLoading(true);
        if (valclient === 'Sélectionner un client' || valclient === '') {
            setMessage2('Veuillez entrer le nom de client');
            setLoading(false);
            return;
        } else {
            try {
                await axios.post("https://gsaaouabdia.com/GSAsoftware/Admin_Gsa/page_administration/apis/valide.php", JSON.stringify({
                    user,
                    key,
                    client: valclient,
                    tva: check2,
                    timbre: check1,
                    pay: check3,
                    nopay: check4,
                    versement: vers
                }));
                setData('Commande envoyée avec succès');
                setShowSuccess(true); // Show success modal
            } catch (error) {
                console.error('Error sending command:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        AsyncStorage.setItem("client", valclient);

    }, [valclient]);

    const calculateTotals = async (items) => {
        let totalHTValue = 0;
        items.forEach(item => {
            totalHTValue += parseFloat(item.prix0) * parseInt(item.qty0);
        });

        let tvaValue = totalHTValue * 0.19;
        let timbreValue = totalHTValue * 0.01;

        let totalTTCValue = totalHTValue;


        if (check1 && check2 === false) {
            totalTTCValue += timbreValue;
        }
        if (check2 && check1 === false) {
            totalTTCValue += tvaValue;
        }
        if (check2 && check1) {
            timbreValue = (totalTTCValue + tvaValue) * 0.01;
            totalTTCValue = ((totalHTValue + tvaValue) * 0.01) +  (totalHTValue + tvaValue);
        }



        setTotalHT(totalHTValue.toFixed(2).replace('.', ',') + ' DZ');
        setTva(tvaValue.toFixed(2).replace('.', ',') + ' DZ');
        setTimbre(timbreValue.toFixed(2).replace('.', ',') + ' DZ');
        setTotalTTC(totalTTCValue.toFixed(2).replace('.', ',') + ' DZ');


    };

    useEffect(() => {
        if (!fetchLoading && data2) {
            calculateTotals(data2);
        }
    }, [check1, check2, data2]);

    const renderItem = ({ item }) => (
        <View style={styles.productCard}>
            <View style={styles.productDetails}>
                <Text style={styles.productName}>{item.des0}</Text>
                <Text style={styles.productRef}>Réf: {item.ref0}</Text>
                <View style={styles.productMeta}>
                    <Text style={styles.productQuantity}>Quantité: {item.qty0}</Text>
                    <Text style={styles.productPrice}>{parseInt(item.prix0).toFixed(2).replace('.', ',')} DA</Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={24} color="#FF3B30" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.formContainer}>
                    {valclient === 'Sélectionner un client' ? (
                        <>
                            <Text style={styles.errorMessage}>{message2}</Text>
                            <TouchableOpacity
                                style={styles.touchableInput}
                                onPress={() => navigation.navigate('Séléctionner un client')}
                            >
                                <Text style={styles.touchableText}>Sélectionner un client</Text>
                                <Ionicons name="chevron-forward-outline" size={20} color="black" />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity
                            style={styles.touchableInput}
                            onPress={() => navigation.navigate('Séléctionner un client')}
                        >
                            <Text style={styles.touchableText}>{valclient}</Text>
                            <Ionicons name="chevron-forward-outline" size={20} color="black" />
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.addItemContainer} onPress={() => navigation.navigate('Ajouter un produit')}>
                        <Ionicons name="add-outline" size={24} color="black" />
                        <Text style={styles.optionText}>Ajouter un produit</Text>
                    </TouchableOpacity>

                    {productLoading ? (
                        <ActivityIndicator size="large" color="black" style={styles.loadingIndicator} />
                    ) : (
                        <FlatList
                            data={data2}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                            contentContainerStyle={styles.productList}
                        />
                    )}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.summaryContainer}>
                    <View style={styles.dateContainer}>
                        <View><Text style={styles.dateLabel}>Date de facturation</Text></View>
                        <View><Text style={styles.dateText}>{billingDate} {check1} {check2}</Text></View>
                    </View>
                    <View style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        gap: 7
                    }}>
                        <CheckBox
                            title="Tva"
                            checked={check2}
                            onPress={() => setCheck2(!check2)}
                            containerStyle={{margin:0,marginLeft:0,marginRight:0,padding:0,paddingBottom:0,height:30}}
                        />
                        <CheckBox
                            title="Timbre"
                            checked={check1}
                            onPress={() => setCheck1(!check1)}
                            containerStyle={{margin:0,marginLeft:0,marginRight:0,padding:0,paddingBottom:0,height:30}}
                        />
                        <CheckBox
                            title="Payée"
                            checked={check3}
                            onPress={() => {
                                setCheck3(!check3);
                                if (!check3) {
                                    setCheck4(false);
                                    setCheck5(false);
                                }

                            }}
                            containerStyle={{margin:0,marginLeft:0,marginRight:0,padding:0,paddingBottom:0,height:30}}
                        />
                    </View>
                    <View style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap:"wrap",
                        justifyContent: "flex-start",
                        padding:0
                    }}>

                        <CheckBox
                            title="No Payée"
                            checked={check4}
                            onPress={() => {
                                setCheck4(!check4);
                                if (!check4) {
                                    setCheck3(false);
                                    setCheck5(false);
                                }

                            }}
                            containerStyle={{margin:0,marginLeft:0,marginRight:0,padding:0,paddingBottom:0,height:30}}
                            
                        />
                        <CheckBox
                            title="Versement"
                            checked={check5}
                            onPress={() => {
                                setCheck5(!check5);
                                if (!check5) {
                                    setCheck4(false);
                                    setCheck3(false);
                                }

                            }}
                            containerStyle={{margin:0,marginLeft:0,marginRight:0,padding:0,paddingBottom:0,height:30}}
                        />
                    </View>
                    {check5 ? (
                        <View style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-start",
                        }}>

                            <TextInput onChangeText={(text) => setVers(text)} keyboardType='numeric' style={{ borderWidth: 1, width: "100%", padding: 10, marginTop: 10, marginBottom: 10, borderColor: 'gray' }} placeholder='Versement' />
                        </View>
                    ) : ""}


                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Total HT</Text>
                        <Text style={styles.summaryValue}>{totalHT}</Text>
                    </View>
                    {check2 && (
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>TVA (19%)</Text>
                            <Text style={styles.summaryValue}>{tva}</Text>
                        </View>
                    )}
                    {check1 && (
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Timbre (1%)</Text>
                            <Text style={styles.summaryValue}>{timbre}</Text>
                        </View>
                    )}
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Total TTC</Text>
                        <Text style={styles.summaryValue}>{totalTTC}</Text>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.submitButton} onPress={handleCommande}>
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.submitButtonText}>Valider la commande</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.submitButton2} onPress={handleDeleteAll}>
                        <Text style={styles.submitButtonText2}>Supprimer Tout</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Modal visible={showSuccess} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.successModal}>
                        <Text style={styles.successMessage}>{data}</Text>

                        <TouchableOpacity style={styles.modalButton} onPress={() => navigation.navigate("Factures")}>
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    formContainer: {
        padding: 16,
    },
    errorMessage: {
        color: 'red',
        marginBottom: 16,
    },
    touchableInput: {
        backgroundColor: '#f1f1f1',
        borderRadius: 8,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    touchableText: {
        fontSize: 14,
        color: 'black',
    },
    addItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f1f1',
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
    },
    optionText: {
        fontSize: 14,
        color: 'black',
        marginLeft: 8,
    },
    loadingIndicator: {
        marginVertical: 20,
    },
    productList: {
        paddingBottom: 20,
    },
    productCard: {
        flexDirection: 'row',
        backgroundColor: '#f1f1f1',
        borderRadius: 8,
        marginBottom: 16,
        padding: 16,
    },
    productDetails: {
        flex: 1,
    },
    productName: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    productRef: {
        color: '#555',
        fontSize:12,
        marginTop:5,
        marginBottom:5
    },
    productMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    productQuantity: {
        fontSize: 12,
        color: '#555',
    },
    productPrice: {
        fontSize: 12,
        color: 'black',
    },
    deleteButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        padding: 16,
        backgroundColor: 'white'
        
    },
    summaryContainer: {
        marginBottom: 16,
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    dateLabel: {
        fontWeight: 'bold',
    },
    dateText: {
        color: '#555',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#555',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
    },
    submitButton: {
        backgroundColor: 'black',
        borderRadius: 5,
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 10,
       
    },
    submitButtonText: {
        fontSize: 15,
        color: '#fff',
    },
    submitButton2: {
        backgroundColor: 'red',
        borderRadius: 5,
        paddingVertical: 12,
        alignItems: 'center',
       
    },
    submitButtonText2: {
        fontSize: 15,
        color: '#fff',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    successModal: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 24,
        alignItems: 'center',
    },
    successMessage: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    modalButton: {
        backgroundColor: 'black',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 14,
    },
});

export default Valide;
