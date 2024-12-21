import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import { Button } from "react-native-elements";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const Stock2 = () => {
  const [responseData, setResponseData] = useState([]);
  const [key2, setKey] = useState("");
  const [user, setUser] = useState("");
  const [num, setNum] = useState(50);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const limitedData = responseData.slice(0, num);

  // Initialisation des données utilisateur
  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = await AsyncStorage.getItem("username");
        const mac = await AsyncStorage.getItem("mac");
        setKey(mac);
        setUser(username);
        await fetchStockData(mac);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchData();
  }, []);

  // Fonction pour récupérer les données
  const fetchStockData = async (mac) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://gsaaouabdia.com/GSAsoftware/Admin_Gsa/page_administration/apis/index.php",
        JSON.stringify({ key2: mac })
      );
      setResponseData(response.data);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction de recherche
  const handleSearch = async (searchValue) => {
    if (!searchValue.trim()) {
      fetchStockData(key2);
      return;
    }
    try {
      const response = await axios.post(
        "https://gsaaouabdia.com/GSAsoftware/Admin_Gsa/page_administration/apis/search.php",
        JSON.stringify({ search: searchValue, key2 })
      );
      setResponseData(response.data);
    } catch (error) {
      console.error("Error searching stock:", error);
    }
  };

  // Fonction de rafraîchissement
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStockData(key2);
    setRefreshing(false);
  };

  // Rendu d'un produit
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        navigation.navigate("Ajouter au Liste", {
          des: item.des0,
          ref: item.ref0,
          prixG: item.prixG,
          qty0: item.qty0,
          section: item.section0,
          mac: item.mac0,
          user: user,
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
        <Text style={styles.itemPrice}>
          {parseFloat(item.prixG).toFixed(2).replace(".", ",")} DA
        </Text>
        <Text style={styles.itemQty}>QTY: {item.qty0}</Text>
      </View>
    </TouchableOpacity>
  );

  // Footer de la liste
  const footerComponent = () => (
    <View style={styles.footerContainer}>
      <Button
        onPress={() => setNum(num + 50)}
        buttonStyle={styles.loadMoreButton}
        title="Afficher Plus Produits... +"
        loading={loading}
      />
    </View>
  );

  // Composant pour une liste vide
  const emptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Aucun produit trouvé.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Recherche Produit"
          onChangeText={handleSearch}
          style={styles.searchInput}
        />
      </View>
      <Text style={styles.articlesTitle}>Produits</Text>
      <FlatList
        data={limitedData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_stock.toString()}
        ListFooterComponent={footerComponent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={emptyComponent}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  searchContainer: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 15,
    elevation: 2,
  },
  articlesTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginLeft: 16,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: "#000",
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
    fontWeight: "600",
    color: "#333",
  },
  itemSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  itemPriceQty: {
    flex: 1,
    alignItems: "flex-end",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007BFF",
  },
  itemQty: {
    fontSize: 12,
    color: "#28A745",
    marginTop: 4,
  },
  loadMoreButton: {
    backgroundColor: "#007BFF",
    borderRadius: 25,
    paddingHorizontal: 30,
    paddingVertical: 12,
  },
  footerContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
  },
});

export default Stock2;
