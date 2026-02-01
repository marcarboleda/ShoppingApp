import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Product, useCart } from "../context/CartContext";
import { styles } from "../styles/HomeScreenStyle";

export default function HomeScreen() {
  const { products, imageMap, addToCart, isDarkMode, toggleTheme, cart } =
    useCart();
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const router = useRouter();

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const theme = isDarkMode
    ? {
        bg: "#121212",
        text: "#fff",
        card: "#1E1E1E",
        input: "#2C2C2C",
        sub: "#aaa",
        border: "#333",
      }
    : {
        bg: "#F4F4F4",
        text: "#000",
        card: "#FFF",
        input: "#E8E8E8",
        sub: "#666",
        border: "#EEE",
      };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={{ fontSize: 50, marginBottom: 10 }}>🔍</Text>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>
        No Results Found
      </Text>
      <Text style={[styles.emptySub, { color: theme.sub }]}>
        We couldn't find any products matching "{search}"
      </Text>
      <TouchableOpacity onPress={() => setSearch("")} style={styles.resetBtn}>
        <Text style={{ color: "#ee4d2d", fontWeight: "bold" }}>
          Clear Search
        </Text>
      </TouchableOpacity>
    </View>
  );

  const handleAddToCart = () => {
    if (selectedProduct) {
      addToCart(selectedProduct, qty);
      setSelectedProduct(null);
    }
  };

  const handleBuyNow = () => {
    if (selectedProduct) {
      const productToBuy = selectedProduct;
      const purchaseQty = qty;
      setSelectedProduct(null);
      router.push({
        pathname: "/CheckoutScreen",
        params: { directBuyId: productToBuy.id, directBuyQty: purchaseQty },
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <View
          style={[styles.searchContainer, { backgroundColor: theme.input }]}
        >
          <TextInput
            style={[styles.search, { color: theme.text, flex: 1 }]}
            placeholder="Search products..."
            placeholderTextColor={isDarkMode ? "#888" : "#999"}
            onChangeText={setSearch}
            value={search}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Text
                style={{ color: theme.sub, fontWeight: "bold", padding: 5 }}
              >
                ✕
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => router.push("/CartScreen")}
        >
          <Text style={{ fontSize: 22 }}>🛒</Text>
          {cart.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cart.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleTheme} style={styles.iconBtn}>
          <Text style={{ fontSize: 20 }}>{isDarkMode ? "☀️" : "🌙"}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={filtered.length > 0 ? styles.columnWrapper : null}
        contentContainerStyle={
          filtered.length === 0
            ? { flexGrow: 1, justifyContent: "center" }
            : { paddingBottom: 20 }
        }
        ListEmptyComponent={EmptyState}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.productCard, { backgroundColor: theme.card }]}
            onPress={() => {
              setSelectedProduct(item);
              setQty(1);
            }}
          >
            <View style={styles.imageContainer}>
              <Image
                source={imageMap[item.image]}
                style={styles.img}
                resizeMode="contain"
              />
            </View>
            <View style={styles.cardContent}>
              <Text
                style={[styles.productName, { color: theme.text }]}
                numberOfLines={2}
              >
                {item.name}
              </Text>
              <Text style={styles.productPrice}>
                ₱{item.price.toLocaleString()}
              </Text>
              <View style={styles.ratingRow}>
                <Text style={styles.starText}>⭐ {item.rating}</Text>
                <Text style={[styles.soldText, { color: theme.sub }]}>
                  {" "}
                  | {item.soldCount} sold
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal visible={!!selectedProduct} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitleHeader, { color: theme.text }]}>
                Product Details
              </Text>
              <TouchableOpacity onPress={() => setSelectedProduct(null)}>
                <Text style={{ fontSize: 24, color: theme.text }}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            >
              {selectedProduct && (
                <>
                  <Image
                    source={imageMap[selectedProduct.image]}
                    style={styles.largeImg}
                    resizeMode="contain"
                  />
                  <Text style={[styles.modalTitle, { color: theme.text }]}>
                    {selectedProduct.name}
                  </Text>
                  <View style={styles.modalMetaRow}>
                    <Text style={styles.modalPrice}>
                      ₱{selectedProduct.price.toLocaleString()}
                    </Text>
                    <Text style={{ color: theme.sub, fontSize: 13 }}>
                      ⭐ {selectedProduct.rating} (
                      {selectedProduct.reviewsCount} Reviews)
                    </Text>
                  </View>
                  <View style={styles.divider} />
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Description
                  </Text>
                  <Text style={[styles.descText, { color: theme.sub }]}>
                    {selectedProduct.description}
                  </Text>
                  <View style={styles.divider} />
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Customer Reviews
                  </Text>
                  {selectedProduct.reviews.map((review) => (
                    <View key={review.id} style={styles.reviewCard}>
                      <View style={styles.reviewHeader}>
                        <Text
                          style={[styles.reviewUser, { color: theme.text }]}
                        >
                          {review.user}
                        </Text>
                        <Text style={styles.reviewDate}>{review.date}</Text>
                      </View>
                      <Text
                        style={{
                          color: "#FFD700",
                          fontSize: 12,
                          marginVertical: 2,
                        }}
                      >
                        {"★".repeat(review.rating)}
                      </Text>
                      <Text
                        style={[styles.reviewComment, { color: theme.sub }]}
                      >
                        {review.comment}
                      </Text>
                    </View>
                  ))}
                </>
              )}
            </ScrollView>
            <View
              style={[
                styles.bottomBar,
                { backgroundColor: theme.card, borderTopColor: theme.border },
              ]}
            >
              <View style={styles.qtyContainer}>
                <TouchableOpacity
                  onPress={() => setQty(Math.max(1, qty - 1))}
                  style={styles.qtyBtn}
                >
                  <Text style={{ color: theme.text }}>-</Text>
                </TouchableOpacity>
                <Text
                  style={{
                    color: theme.text,
                    fontWeight: "bold",
                    marginHorizontal: 15,
                  }}
                >
                  {qty}
                </Text>
                <TouchableOpacity
                  onPress={() => setQty(qty + 1)}
                  style={styles.qtyBtn}
                >
                  <Text style={{ color: theme.text }}>+</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.actionBtns}>
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={handleAddToCart}
                >
                  <Text style={styles.btnText}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buyBtn} onPress={handleBuyNow}>
                  <Text style={styles.btnText}>Buy Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
