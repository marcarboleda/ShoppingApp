import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CartProvider } from "../context/CartContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CartProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        >
          {/* "index" matches index.tsx */}
          <Stack.Screen name="index" />

          {/* "CartScreen" matches CartScreen.tsx */}
          <Stack.Screen name="CartScreen" />

          {/* "CheckoutScreen" matches CheckoutScreen.tsx */}
          <Stack.Screen name="CheckoutScreen" />
        </Stack>
      </CartProvider>
    </GestureHandlerRootView>
  );
}
