import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useCart } from "../context/CartContext";
import { styles } from "../styles/CartScreenStyle";

export default function CartScreen() {
  const { cart, updateQuantity, toggleSelect, isDarkMode, imageMap, setCart } =
    useCart();
  const router = useRouter();

  const theme = isDarkMode
    ? {
        bg: "#121212",
        text: "#FFF",
        card: "#1E1E1E",
        border: "#333",
        sub: "#AAA",
        accent: "#fff",
      }
    : {
        bg: "#F8F9FA",
        text: "#000",
        card: "#FFF",
        border: "#EEE",
        sub: "#666",
        accent: "#000",
      };

  const selectedItems = cart.filter((item) => item.selected);
  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const isAllSelected = cart.length > 0 && selectedItems.length === cart.length;

  const toggleSelectAll = () => {
    setCart((prev) =>
      prev.map((item) => ({ ...item, selected: !isAllSelected })),
    );
  };

  const deleteSelected = () => {
    if (selectedItems.length === 0) return;
    Alert.alert(
      "Remove Items",
      `Are you sure you want to remove ${selectedItems.length} selected item(s)?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () =>
            setCart((prev) => prev.filter((item) => !item.selected)),
        },
      ],
    );
  };

  const BackIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 18L9 12L15 6"
        stroke={theme.text}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const EmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Text style={{ fontSize: 60, marginBottom: 20 }}>🛒</Text>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>
        Your cart is empty
      </Text>
      <TouchableOpacity
        style={[
          styles.shopBtn,
          { backgroundColor: theme.accent, marginTop: 20 },
        ]}
        onPress={() => router.replace("/")}
      >
        <Text
          style={[styles.shopBtnText, { color: isDarkMode ? "#000" : "#fff" }]}
        >
          Go Shopping
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Centered Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>My Cart</Text>
      </View>

      {/* Select All & Delete Line */}
      {cart.length > 0 && (
        <View style={styles.selectAllRow}>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={toggleSelectAll}
          >
            <View
              style={[
                styles.checkOuter,
                {
                  borderColor: isAllSelected ? "#ee4d2d" : theme.sub,
                  marginRight: 10,
                },
              ]}
            >
              {isAllSelected && <View style={styles.checkInner} />}
            </View>
            <Text style={{ color: theme.text, fontWeight: "500" }}>
              Select All
            </Text>
          </TouchableOpacity>

          {selectedItems.length > 0 && (
            <TouchableOpacity
              onPress={deleteSelected}
              style={styles.deleteSelectedBtn}
            >
              <Text style={styles.deleteSelectedText}>
                Delete ({selectedItems.length})
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={EmptyCart}
        contentContainerStyle={
          cart.length === 0
            ? { flexGrow: 1, justifyContent: "center" }
            : { paddingBottom: 100 }
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.cartItem,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <TouchableOpacity
              onPress={() => toggleSelect(item.id)}
              style={styles.checkbox}
            >
              <View
                style={[
                  styles.checkOuter,
                  { borderColor: item.selected ? "#ee4d2d" : theme.sub },
                ]}
              >
                {item.selected && <View style={styles.checkInner} />}
              </View>
            </TouchableOpacity>
            <Image
              source={imageMap[item.image]}
              style={styles.itemImg}
              resizeMode="contain"
            />
            <View style={styles.itemInfo}>
              <Text
                style={[styles.itemName, { color: theme.text }]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <Text style={styles.itemPrice}>
                ₱{item.price.toLocaleString()}
              </Text>
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  onPress={() => updateQuantity(item.id, -1)}
                  style={[styles.qtyBtn, { borderColor: theme.border }]}
                >
                  <Text style={{ color: theme.text }}>-</Text>
                </TouchableOpacity>
                <Text style={[styles.qtyText, { color: theme.text }]}>
                  {item.quantity}
                </Text>
                <TouchableOpacity
                  onPress={() => updateQuantity(item.id, 1)}
                  style={[styles.qtyBtn, { borderColor: theme.border }]}
                >
                  <Text style={{ color: theme.text }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/* Summary Footer */}
      {cart.length > 0 && (
        <View
          style={[
            styles.footer,
            { backgroundColor: theme.card, borderTopColor: theme.border },
          ]}
        >
          <View>
            <Text style={[styles.totalLabel, { color: theme.sub }]}>Total</Text>
            <Text style={[styles.totalPrice, { color: theme.text }]}>
              ₱{totalPrice.toLocaleString()}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.checkoutBtn,
              { opacity: selectedItems.length > 0 ? 1 : 0.5 },
            ]}
            onPress={() =>
              selectedItems.length > 0 && router.push("/CheckoutScreen")
            }
            disabled={selectedItems.length === 0}
          >
            <Text style={styles.checkoutText}>
              Checkout ({selectedItems.length})
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
