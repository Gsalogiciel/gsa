import AsyncStorage from '@react-native-async-storage/async-storage'; // Assurez-vous que ce package est installé.
import { useNavigation } from '@react-navigation/native'; // Vérifiez que ce composant est enfant de NavigationContainer.
import React, { useEffect, useState } from 'react'; // Correct.
import { TouchableOpacity, StyleSheet, View, Text, FlatList } from 'react-native'; // Correct.
import * as Print from 'expo-print'; // Assurez-vous que 'expo-print' est installé.
import axios from 'axios'; // Vérifiez que 'axios' est installé.

const API_URL = 'https://gsaaouabdia.com/GSAsoftware/Admin_Gsa/page_administration/apis/bon.php';

const Bon = ({ route }) => {
    const [totale, setTotale] = useState([]);
    const [data, setData] = useState([]);
    const [user, setUser] = useState('');

    const navigation = useNavigation();
    const { id, client, versement, pay, nopay } = route.params;

    const handleTotale = async () => {
        const response = await axios.post(
            "https://gsaaouabdia.com/GSAsoftware/Admin_Gsa/page_administration/apis/tot2.php",
            JSON.stringify({ id })
        );
        setTotale(response.data);
    };

    const handleApiSpecial = async () => {
        const response = await axios.post(API_URL, JSON.stringify({ id }));
        setData(response.data);
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const username = await AsyncStorage.getItem('username');
                setUser(username);
            } catch (error) {
                console.error('Failed to get item:', error);
            }
        };
        fetchUser();
        handleApiSpecial();
        handleTotale();
    }, [id]);

    const printPage = async () => {
        if (data.length === 0 || totale.length === 0) {
            return;
        }

        const invoiceItems = data
            .map(
                (item) => `
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.des0}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${parseInt(item.prixB).toFixed(2)} DA</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.qtyB}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${parseInt(item.totaleB).toFixed(2)} DA</td>
            </tr>
        `
            )
            .join('');

        const totalHT = parseFloat(totale[0]?.tot || 0);
        const tvaD = data.length > 0 ? data[0]?.tvaD : '0';
        const timbreD = data.length > 0 ? data[0]?.timbreD : '0';

        const tva = tvaD === '1' ? totalHT * 0.19 : 0;
        const timbre = timbreD === '1' ? (totalHT + tva) * 0.01 : 0;
        const totalTTC = totalHT + tva + timbre;

        const htmlContent = `
            <html>
            <head>
                <style>
                    body { font-family: 'Roboto', sans-serif; margin: 0; padding: 20px; color: #333; }
                    h1 { text-align: start; color: #444; margin-bottom: 20px; font-size: 20px; }
                    h2 { text-align: center; color: #444; font-size: 20px; }
                    p { color: #444; font-size: 8px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { padding: 12px; border: 1px solid #ddd; text-align: left; font-size: 7px; }
                    th { background-color: #f9f9f9; }
                    .total { text-align: right; font-size: 8px; font-weight: bold; margin-top: 20px; }
                    .footer { text-align: center; margin-top: 50px; font-size: 8px; color: gray; }
                </style>
            </head>
            <body>
                <h1>GSA AOUABDIA</h1>
                <p>Date: ${data[0]?.datetime || ''}</p>
                <p>Vendeur : ${user}</p>
                <p>Client: ${client}</p>
                <h2>Facture</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Produit</th>
                            <th>P.U</th>
                            <th>Qte</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoiceItems}
                    </tbody>
                </table>
                <div class="total">
                    <p>${pay ? 'Payée' : ''} </p>
                    <p>${nopay ? 'No payée' : ''} </p>
                    <p>${versement == '' ? '' : 'Versement :' + versement + 'DA'} </p>
                    <p>Total HT: ${totalHT.toFixed(2)} DA</p>
                    ${tvaD === '1' ? `<p>TVA (19%): ${tva.toFixed(2)} DA</p>` : ''}
                    ${timbreD === '1' ? `<p>Timbre (1%): ${timbre.toFixed(2)} DA</p>` : ''}
                    <p>Total TTC: ${totalTTC.toFixed(2)} DA</p>
                </div>
            </body>
            </html>
        `;

        await Print.printAsync({ html: htmlContent });
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={styles.itemDetails}>
                <Text style={styles.itemDescription}>{item.des0}</Text>
                <Text style={styles.itemRef}>{item.ref0}</Text>
                <Text style={styles.itemQty}>QTY: {item.qtyB}</Text>
                <Text style={styles.itemPrice}>{item.prixB} DA</Text>
            </View>
        </View>
    );

    const tvaD = data.length > 0 ? data[0]?.tvaD : '0';
    const timbreD = data.length > 0 ? data[0]?.timbreD : '0';
    const totalHT = totale.length > 0 ? totale[0]?.tot : 0;
    const tva = tvaD === '1' ? totalHT * 0.19 : 0;
    const timbre = timbreD === '1' ? (totalHT + tva) * 0.01 : 0;
    const totalTTC = totalHT + tva + timbre;

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
            />
            <View style={styles.totalContainer}>
                {totale.length > 0 && (
                    <>
                        <Text style={styles.totalText}>Total HT: {totalHT.toFixed(2)} DA</Text>
                        {tvaD === '1' && (
                            <Text style={styles.totalText}>TVA (19%): {tva.toFixed(2)} DA</Text>
                        )}
                        {timbreD === '1' && (
                            <Text style={styles.totalText}>Timbre (1%): {timbre.toFixed(2)} DA</Text>
                        )}
                        <Text style={styles.totalAmount}>Total TTC: {totalTTC.toFixed(2)} DA</Text>
                    </>
                )}
            </View>
            <TouchableOpacity onPress={printPage} style={styles.printButton}>
                <Text style={styles.printButtonText}>Imprimer le Bon</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 15,
    },
    listContainer: {
        paddingBottom: 100,
    },
    itemContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        marginBottom: 10,
    },
    itemDetails: {
        flexDirection: 'column',
    },
    itemDescription: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    itemRef: {
        color: '#888',
        fontSize: 14,
    },
    itemQty: {
        color: '#2ecc71',
        fontSize: 13,
        marginTop: 5,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#e67e22',
        marginTop: 5,
    },
    totalContainer: {
        marginVertical: 20,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    totalText: {
        fontSize: 14,
        color: '#333',
    },
    totalAmount: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    printButton: {
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    printButtonText: {
        color: '#fff',
        fontSize: 15,
    },
});

export default Bon;
