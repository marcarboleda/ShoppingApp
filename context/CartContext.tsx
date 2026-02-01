import React, { createContext, ReactNode, useContext, useState } from "react";

const PRODUCT_IMAGES: { [key: string]: any } = {
  "p1.png": require("../assets/images/p1.png"),
  "p2.png": require("../assets/images/p2.png"),
  "p3.png": require("../assets/images/p3.png"),
  "p4.png": require("../assets/images/p4.png"),
  "p5.png": require("../assets/images/p5.png"),
  "p6.png": require("../assets/images/p6.png"),
  "p7.png": require("../assets/images/p7.png"),
  "p8.png": require("../assets/images/p8.png"),
  "p9.png": require("../assets/images/p9.png"),
  "p10.png": require("../assets/images/p10.png"),
};

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  rating: number;
  reviewsCount: number;
  soldCount: string;
  reviews: Review[];
}
export interface CartItem extends Product {
  quantity: number;
  selected: boolean;
}

interface CartContextType {
  cart: CartItem[];
  products: Product[];
  imageMap: { [key: string]: any };
  addToCart: (product: Product, qty: number) => void;
  updateQuantity: (id: string, amount: number) => void;
  toggleSelect: (id: string) => void;
  toggleAll: (select: boolean) => void;
  deleteSelected: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const products: Product[] = [
    {
      id: "1",
      name: "Elite Laptop Pro",
      price: 55000,
      description: "High-performance workstation with M2 chip and 16GB RAM.",
      image: "p1.png",
      rating: 4.9,
      reviewsCount: 856,
      soldCount: "2.1k",
      reviews: [
        {
          id: "r1",
          user: "TechJuan",
          rating: 5,
          comment: "Super fast! Perfect for my work.",
          date: "Jan 20, 2026",
        },
        {
          id: "r2",
          user: "Maria_08",
          rating: 4,
          comment: "Nice screen but gets a bit hot.",
          date: "Feb 01, 2026",
        },
      ],
    },
    {
      id: "2",
      name: "Noise-Cancelling Headphones",
      price: 12500,
      description: "Pure sound with active noise cancellation.",
      image: "p2.png",
      rating: 4.8,
      reviewsCount: 2130,
      soldCount: "5.4k",
      reviews: [
        {
          id: "r3",
          user: "AudioLover",
          rating: 5,
          comment: "The bass is incredible!",
          date: "Jan 15, 2026",
        },
      ],
    },
    {
      id: "3",
      name: "Smart Fitness Watch",
      price: 8990,
      description: "Track your health with precision.",
      image: "p3.png",
      rating: 4.5,
      reviewsCount: 432,
      soldCount: "1.5k",
      reviews: [
        {
          id: "r5",
          user: "GymRat99",
          rating: 4,
          comment: "Accurate GPS, good battery.",
          date: "Jan 10, 2026",
        },
      ],
    },
    {
      id: "4",
      name: "Gaming Mouse",
      price: 2450,
      description: "Ultra-lightweight 25k DPI sensor.",
      image: "p4.png",
      rating: 4.8,
      reviewsCount: 1102,
      soldCount: "3.9k",
      reviews: [
        {
          id: "r6",
          user: "GamerPH",
          rating: 5,
          comment: "Very responsive click.",
          date: "Feb 02, 2026",
        },
      ],
    },
    {
      id: "5",
      name: "Mechanical Keyboard",
      price: 4200,
      description: "Hot-swappable RGB mechanical keyboard.",
      image: "p5.png",
      rating: 4.6,
      reviewsCount: 560,
      soldCount: "890",
      reviews: [
        {
          id: "r7",
          user: "ClickyKeys",
          rating: 5,
          comment: "Love the tactile feel.",
          date: "Jan 05, 2026",
        },
      ],
    },
    {
      id: "6",
      name: "32-inch 4K Monitor",
      price: 18500,
      description: "UHD resolution for creative work.",
      image: "p6.png",
      rating: 4.7,
      reviewsCount: 240,
      soldCount: "412",
      reviews: [
        {
          id: "r8",
          user: "ArtDesign",
          rating: 4,
          comment: "Great color accuracy.",
          date: "Dec 12, 2025",
        },
      ],
    },
    {
      id: "7",
      name: "HD Webcam Pro",
      price: 3200,
      description: "1080p auto-focus camera.",
      image: "p7.png",
      rating: 4.4,
      reviewsCount: 89,
      soldCount: "250",
      reviews: [
        {
          id: "r9",
          user: "WFHMom",
          rating: 5,
          comment: "Clear video for meetings.",
          date: "Jan 22, 2026",
        },
      ],
    },
    {
      id: "8",
      name: "7-in-1 USB-C Hub",
      price: 1550,
      description: "Expand your laptop connectivity.",
      image: "p8.png",
      rating: 4.3,
      reviewsCount: 150,
      soldCount: "600",
      reviews: [
        {
          id: "r10",
          user: "DevGuy",
          rating: 3,
          comment: "Gets warm but works well.",
          date: "Feb 01, 2026",
        },
      ],
    },
    {
      id: "9",
      name: "1TB Portable SSD",
      price: 5200,
      description: "Fast and shock-resistant storage.",
      image: "p9.png",
      rating: 4.9,
      reviewsCount: 940,
      soldCount: "2.8k",
      reviews: [
        {
          id: "r11",
          user: "TravelPhotog",
          rating: 5,
          comment: "Reliable and tiny!",
          date: "Jan 30, 2026",
        },
      ],
    },
    {
      id: "10",
      name: "Waterproof Desk Pad",
      price: 750,
      description: "Smooth surface for setups.",
      image: "p10.png",
      rating: 4.6,
      reviewsCount: 320,
      soldCount: "1.1k",
      reviews: [
        {
          id: "r12",
          user: "MinimalDesk",
          rating: 5,
          comment: "Very aesthetic and easy to clean.",
          date: "Jan 15, 2026",
        },
      ],
    },
  ];

  const addToCart = (product: Product, qty: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing)
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item,
        );
      return [...prev, { ...product, quantity: qty, selected: true }];
    });
  };

  const updateQuantity = (id: string, amount: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + amount } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const toggleSelect = (id: string) =>
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item,
      ),
    );
  const toggleAll = (select: boolean) =>
    setCart((prev) => prev.map((item) => ({ ...item, selected: select })));
  const deleteSelected = () =>
    setCart((prev) => prev.filter((item) => !item.selected));
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <CartContext.Provider
      value={{
        cart,
        products,
        imageMap: PRODUCT_IMAGES,
        addToCart,
        updateQuantity,
        toggleSelect,
        toggleAll,
        deleteSelected,
        isDarkMode,
        toggleTheme,
        setCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart error");
  return context;
};
