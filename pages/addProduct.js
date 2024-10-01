import React, { useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddProduct = ({ route }) => {
    const { des, ref, prixG, qty0, section, mac, user } = route.params;
    const navigation = useNavigation();
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(prixG);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleQuantityChange = (action) => {
        setQuantity(prevQuantity => {
            if (action === 'increase') {
                return prevQuantity + 1;
            } else if (action === 'decrease') {
                return Math.max(prevQuantity - 1, 0);
            }
            return prevQuantity;
        });
    };

    const addToCart = async () => {
        if (quantity <= 0 || price <= 0) {
            setErrorMessage("Veuillez entrer une quantité et un prix valides.");
            return;
        }

        setLoading(true);

        try {
            const endpoint = quantity === qty0 
                ? 'https://gsaaouabdia.com/GSAsoftware/Admin_Gsa/page_administration/apis/add2.php'
                : 'https://gsaaouabdia.com/GSAsoftware/Admin_Gsa/page_administration/apis/add.php';

            await axios.post(endpoint, JSON.stringify({
                quantity,
                price,
                des,
                ref,
                section,
                mac,
                user,
            }));
            const client = await AsyncStorage.getItem("client");
            const randnum = Math.random(86428648282);
            
            navigation.navigate("Ajouter une Facture", {
                valclient: client,
                randnum:randnum
            });
            setErrorMessage('');
        } catch (error) {
            console.error('There was an error!', error);
            setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
            setSuccessMessage('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {successMessage ? (
                <View style={styles.messageContainer}>
                    <Icon name="checkmark-circle" color="#4caf50" size={24} />
                    <Text style={styles.successMessage}>{successMessage}</Text>
                </View>
            ) : errorMessage ? (
                <View style={styles.messageContainer}>
                    <Icon name="close-circle" color="#f44336" size={24} />
                    <Text style={styles.errorMessage}>{errorMessage}</Text>
                </View>
            ) : null}

            <Text style={styles.productTitle}>{des}</Text>
            <Text style={styles.productRef}>{ref}</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Quantité</Text>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={() => handleQuantityChange('decrease')} style={styles.adjustButton}>
                        <Text style={styles.adjustButtonText}>-</Text>
                    </TouchableOpacity>
                    <TextInput
                        value={quantity.toString()}
                        keyboardType="numeric"
                        style={styles.quantityInput}
                        onChangeText={(text) => setQuantity(Number(text) || 0)}
                    />
                    <TouchableOpacity onPress={() => handleQuantityChange('increase')} style={styles.adjustButton}>
                        <Text style={styles.adjustButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Prix</Text>
                <TextInput
                    value={price.toString()}
                    keyboardType="numeric"
                    style={styles.priceInput}
                    onChangeText={(text) => setPrice(Number(text) || 0)}
                />
            </View>

            <TouchableOpacity
                onPress={addToCart}
                style={styles.button}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#FFF" />
                ) : (
                    <Text style={styles.buttonText}>Valider</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        padding: 16,
    },
    messageContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    successMessage: {
        color: '#4caf50',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 10,
    },
    errorMessage: {
        color: '#f44336',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 10,
    },
    productTitle: {
        fontSize: 30,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },
    productRef: {
        fontSize: 18,
        color: '#777',
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityInput: {
        flex: 1,
        fontSize: 18,
        color: '#333',
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        textAlign: 'center',
    },
    priceInput: {
        fontSize: 18,
        color: '#333',
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    adjustButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#6200ea',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    adjustButtonText: {
        fontSize: 24,
        color: '#ffffff',
    },
    button: {
        backgroundColor: '#6200ea',
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        textAlign: "center",
    },
});

export default AddProduct;
