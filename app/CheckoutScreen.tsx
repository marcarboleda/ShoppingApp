import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
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
import { styles, Themes } from "../styles/CheckoutScreenStyle";

export default function CheckoutScreen() {
  const { cart, products, imageMap, updateQuantity, isDarkMode, setCart } =
    useCart();
  const router = useRouter();
  const params = useLocalSearchParams();

  const theme = isDarkMode ? Themes.dark : Themes.light;
  const [directQty, setDirectQty] = useState(Number(params.directBuyQty) || 1);
  const isDirectBuy = !!params.directBuyId;

  const checkoutItems = useMemo(() => {
    if (isDirectBuy) {
      const product = products.find((p) => p.id === params.directBuyId);
      return product ? [{ ...product, quantity: directQty }] : [];
    }
    return cart.filter((item) => item.selected);
  }, [isDirectBuy, params.directBuyId, products, directQty, cart]);

  const total = checkoutItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const BackIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 18L9 12L15 6"
        stroke={theme.link}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const handleConfirmPurchase = () => {
    Alert.alert("Success", "Your order has been placed!", [
      {
        text: "OK",
        onPress: () => {
          if (!isDirectBuy)
            setCart((prevCart) => prevCart.filter((item) => !item.selected));
          router.replace("/HomeScreen");
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.headerSide}
          onPress={() =>
            isDirectBuy ? router.replace("/HomeScreen") : router.back()
          }
        >
          <BackIcon />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Checkout
          </Text>
        </View>
        <View style={styles.headerSide} />
      </View>

      <FlatList
        data={checkoutItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={[styles.itemRow, { backgroundColor: theme.card }]}>
            <View style={styles.imgWrap}>
              <Image
                source={imageMap[item.image]}
                style={styles.smallImg}
                resizeMode="contain"
              />
            </View>
            <View style={styles.infoCol}>
              <Text
                style={[styles.nameText, { color: theme.text }]}
                numberOfLines={2}
              >
                {item.name}
              </Text>
              <Text style={styles.priceText}>
                ₱{(item.price * item.quantity).toLocaleString()}
              </Text>
            </View>
            <View style={[styles.qtyControl, { backgroundColor: theme.qtyBg }]}>
              <TouchableOpacity
                onPress={() =>
                  isDirectBuy
                    ? setDirectQty(Math.max(1, directQty - 1))
                    : updateQuantity(item.id, -1)
                }
              >
                <Text style={[styles.qtyChar, { color: theme.qtyText }]}>
                  -
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  color: theme.qtyText,
                  marginHorizontal: 10,
                  fontWeight: "bold",
                  fontSize: 14,
                }}
              >
                {item.quantity}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  isDirectBuy
                    ? setDirectQty(directQty + 1)
                    : updateQuantity(item.id, 1)
                }
              >
                <Text style={[styles.qtyChar, { color: theme.qtyText }]}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={[styles.summaryFooter, { borderTopColor: theme.border }]}>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: theme.text }]}>
            Order Total
          </Text>
          <Text style={[styles.grandTotal, { color: theme.text }]}>
            ₱{total.toLocaleString()}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.confirmBtn, { backgroundColor: theme.accent }]}
          onPress={handleConfirmPurchase}
        >
          <Text
            style={[
              styles.confirmBtnText,
              { color: isDarkMode ? "#000" : "#fff" },
            ]}
          >
            Place Order Now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
