import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { Product, useCart } from "../context/CartContext";
import { styles, Themes } from "../styles/HomeScreenStyle";

const ShoppingCartIcon = ({ color }: { color: string }) => (
  <Svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Circle cx="9" cy="21" r="1" />
    <Circle cx="20" cy="21" r="1" />
    <Path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </Svg>
);
const MoonIcon = ({ color }: { color: string }) => (
  <Svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </Svg>
);
const SunIcon = ({ color }: { color: string }) => (
  <Svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Circle cx="12" cy="12" r="5" />
    <Path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </Svg>
);
const CloseIcon = ({ color }: { color: string }) => (
  <Svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

type SortOption = "Latest" | "Top Sales" | "Top Rated" | "Price";

export default function HomeScreen() {
  const { products, imageMap, addToCart, isDarkMode, toggleTheme, cart } =
    useCart();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("Latest");
  const [priceDir, setPriceDir] = useState<"asc" | "desc">("asc");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const router = useRouter();

  const theme = isDarkMode ? Themes.dark : Themes.light;

  const processedProducts = useMemo(() => {
    let result = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()),
    );
    const parseSales = (s: string) =>
      parseFloat(s.replace("k", "")) * (s.includes("k") ? 1000 : 1);

    if (sortBy === "Price") {
      result.sort((a, b) =>
        priceDir === "asc" ? a.price - b.price : b.price - a.price,
      );
    } else if (sortBy === "Top Rated") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "Top Sales") {
      result.sort((a, b) => parseSales(b.soldCount) - parseSales(a.soldCount));
    } else {
      result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    }
    return result;
  }, [search, sortBy, priceDir, products]);

  const togglePriceSort = () => {
    if (sortBy !== "Price") {
      setSortBy("Price");
      setPriceDir("asc");
    } else {
      setPriceDir(priceDir === "asc" ? "desc" : "asc");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <View style={styles.header}>
        <View
          style={[styles.searchContainer, { backgroundColor: theme.input }]}
        >
          <TextInput
            style={[styles.search, { color: theme.text }]}
            placeholder="Search products..."
            placeholderTextColor={isDarkMode ? "#777" : "#999"}
            onChangeText={setSearch}
            value={search}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <CloseIcon color={theme.sub} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => router.push("/CartScreen")}
        >
          <ShoppingCartIcon color={theme.icon} />
          {cart.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cart.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleTheme} style={styles.iconBtn}>
          {isDarkMode ? (
            <SunIcon color={theme.icon} />
          ) : (
            <MoonIcon color={theme.icon} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.sortWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortBar}
        >
          {(["Latest", "Top Sales", "Top Rated"] as SortOption[]).map(
            (option) => (
              <TouchableOpacity
                key={option}
                onPress={() => setSortBy(option)}
                style={[
                  styles.sortItem,
                  sortBy === option && { borderBottomColor: theme.accent },
                ]}
              >
                <Text
                  style={[
                    styles.sortText,
                    { color: sortBy === option ? theme.accent : theme.sub },
                    sortBy === option && styles.boldText,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ),
          )}

          <TouchableOpacity
            onPress={togglePriceSort}
            style={[
              styles.sortItem,
              sortBy === "Price" && { borderBottomColor: theme.accent },
            ]}
          >
            <View style={styles.priceRow}>
              <Text
                style={[
                  styles.sortText,
                  { color: sortBy === "Price" ? theme.accent : theme.sub },
                  sortBy === "Price" && styles.boldText,
                ]}
              >
                Price
              </Text>
              <Text
                style={[
                  styles.arrow,
                  { color: sortBy === "Price" ? theme.accent : theme.sub },
                ]}
              >
                {priceDir === "asc" ? "↑" : "↓"}
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <FlatList
        data={processedProducts}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={
          processedProducts.length > 0 ? styles.columnWrapper : undefined
        }
        contentContainerStyle={
          processedProducts.length === 0
            ? styles.emptyListContent
            : styles.listContent
        }
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingHorizontal: 40 }}>
            <Svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              stroke={theme.sub}
              strokeWidth="1.5"
            >
              <Circle cx="11" cy="11" r="8" />
              <Path d="M21 21l-4.35-4.35" />
              <Path d="M8 11h6" />
            </Svg>
            <Text
              style={{
                color: theme.text,
                fontSize: 16,
                fontWeight: "700",
                marginTop: 15,
              }}
            >
              No matching items
            </Text>
            <Text
              style={{ color: theme.sub, textAlign: "center", marginTop: 8 }}
            >
              Try adjusting your search or filters
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
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
                <Text style={styles.starText}>★ {item.rating}</Text>
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
                Details
              </Text>
              <TouchableOpacity onPress={() => setSelectedProduct(null)}>
                <CloseIcon color={theme.text} />
              </TouchableOpacity>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScroll}
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
                    <Text style={{ color: theme.sub }}>
                      ★ {selectedProduct.rating} ({selectedProduct.reviewsCount}
                      )
                    </Text>
                  </View>
                  <View style={styles.divider} />
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Description
                  </Text>
                  <Text style={[styles.descText, { color: theme.sub }]}>
                    {selectedProduct.description}
                  </Text>
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
                  style={[styles.qtyBtn, { borderColor: theme.border }]}
                >
                  <Text style={{ color: theme.text }}>-</Text>
                </TouchableOpacity>
                <Text style={[styles.qtyText, { color: theme.text }]}>
                  {qty}
                </Text>
                <TouchableOpacity
                  onPress={() => setQty(qty + 1)}
                  style={[styles.qtyBtn, { borderColor: theme.border }]}
                >
                  <Text style={{ color: theme.text }}>+</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.actionBtns}>
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={() => {
                    addToCart(selectedProduct!, qty);
                    setSelectedProduct(null);
                  }}
                >
                  <Text style={styles.btnText}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buyBtn}
                  onPress={() => {
                    const productId = selectedProduct?.id;
                    const purchaseQty = qty;
                    setSelectedProduct(null);
                    router.push({
                      pathname: "/CheckoutScreen",
                      params: {
                        directBuyId: productId,
                        directBuyQty: purchaseQty,
                      },
                    });
                  }}
                >
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
