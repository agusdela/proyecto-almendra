/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, ProductVariant, CartItem, Category, BlogPost, Review, Coupon, Order } from '../types';
import { products as initialProducts, categories, blogPosts, clientReviews as initialReviews } from '../data/mockData';

export type ActiveView = 
  | 'home' 
  | 'shop' 
  | 'blog' 
  | 'about' 
  | 'contact' 
  | 'product-detail' 
  | 'favorites' 
  | 'cart' 
  | 'checkout' 
  | 'my-account';

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  delay: string;
}

interface ShopContextType {
  currentView: ActiveView;
  setCurrentView: (view: ActiveView) => void;
  products: Product[];
  categories: Category[];
  blogPosts: BlogPost[];
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, variant?: ProductVariant) => void;
  removeFromCart: (productId: string, variantLabel: string) => void;
  updateCartQuantity: (productId: string, variantLabel: string, quantity: number) => void;
  clearCart: () => void;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  selectedCategorySlug: string | null;
  setSelectedCategorySlug: (slug: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchHistory: string[];
  addToSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  currency: 'ARS' | 'USD';
  setCurrency: (curr: 'ARS' | 'USD') => void;
  exchangeRate: number; // 1 USD = 1000 ARS
  locationProvince: string;
  setLocationProvince: (prov: string) => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  reviews: Review[];
  addReview: (reviewData: { author: string; rate: number; comment: string; productId: string }) => void;
  orders: Order[];
  addNewOrder: (orderData: Omit<Order, 'id' | 'date' | 'status'>) => Order;
  getCartSubtotal: () => number;
  getCartDiscountAmount: () => number;
  getShippingPrice: () => number;
  getCartTotal: () => number;
  shippingMethods: ShippingMethod[];
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const COUPONS_LIST: Coupon[] = [
  { code: 'NATURAL10', discountPercent: 10, description: '10% de descuento en tu compra total.' },
  { code: 'GOURMET20', discountPercent: 20, description: '20% especial en toda la tienda.' },
  { code: 'ENVIOFREE', discountPercent: 0, description: 'Envío gratis sin mínimo de compra.' }
];

export const shippingMethodsAndPrices = [
  { id: 'standard', name: 'Envío Estándar', priceOnCaba: 2500, priceOnGba: 3500, priceOnInterior: 5900, delay: '3 a 5 días hábiles' },
  { id: 'express', name: 'Envío Express 24hs', priceOnCaba: 3900, priceOnGba: 5200, priceOnInterior: 8500, delay: 'Siguiente día hábil' },
  { id: 'pickup', name: 'Retiro Gratis en Sucursal', priceOnCaba: 0, priceOnGba: 0, priceOnInterior: 0, delay: 'Listo en 2 horas' }
];

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  // Navigation states
  const [currentView, setCurrentView] = useState<ActiveView>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);

  // Persistence states
  const [cart, setCart] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem('almacen_cart');
    return stored ? JSON.parse(stored) : [];
  });
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const stored = localStorage.getItem('almacen_wishlist');
    return stored ? JSON.parse(stored) : [];
  });
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const stored = localStorage.getItem('almacen_search_history');
    return stored ? JSON.parse(stored) : ['granola', 'miel', 'matcha'];
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const stored = localStorage.getItem('almacen_orders');
    return stored ? JSON.parse(stored) : [];
  });
  const [reviews, setReviews] = useState<Review[]>(() => {
    const stored = localStorage.getItem('almacen_reviews');
    return stored ? JSON.parse(stored) : initialReviews;
  });

  // User localization & currency
  const [currency, setCurrency] = useState<'ARS' | 'USD'>('ARS');
  const [locationProvince, setLocationProvince] = useState<string>(() => {
    const stored = localStorage.getItem('almacen_province');
    return stored || 'CABA';
  });

  // Search core query
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const exchangeRate = 1000; // 1 USD = $1000 ARS

  // Synchronization with LocalStorage
  useEffect(() => {
    localStorage.setItem('almacen_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('almacen_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('almacen_search_history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    localStorage.setItem('almacen_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('almacen_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('almacen_province', locationProvince);
  }, [locationProvince]);

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedProduct]);

  // Methods
  const addToCart = (product: Product, quantity: number, variant?: ProductVariant) => {
    const selectedVariant = variant || product.variants[0];
    
    setCart((prev) => {
      const matchIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant.label === selectedVariant.label
      );
      
      if (matchIndex > -1) {
        const next = [...prev];
        next[matchIndex] = {
          ...next[matchIndex],
          quantity: next[matchIndex].quantity + quantity
        };
        return next;
      } else {
        return [...prev, { product, quantity, selectedVariant }];
      }
    });

    // Automatically navigate or open side panel if desired, let's keep user inline but notify
  };

  const removeFromCart = (productId: string, variantLabel: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.selectedVariant.label === variantLabel)));
  };

  const updateCartQuantity = (productId: string, variantLabel: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantLabel);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedVariant.label === variantLabel
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const has = prev.some((item) => item.id === product.id);
      if (has) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const addToSearchHistory = (query: string) => {
    const cleanWord = query.trim().toLowerCase();
    if (!cleanWord) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((w) => w !== cleanWord);
      return [cleanWord, ...filtered].slice(0, 8);
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const applyCoupon = (code: string) => {
    const norm = code.toUpperCase().trim();
    const match = COUPONS_LIST.find((c) => c.code === norm);
    if (match) {
      setAppliedCoupon(match);
      return { success: true, message: `Cupón ${match.code} aplicado con éxito: ${match.description}` };
    }
    return { success: false, message: 'Cupón no válido o vencido.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const addReview = (reviewData: { author: string; rate: number; comment: string; productId: string }) => {
    const newRev: Review = {
      id: `rev-custom-${Date.now()}`,
      author: reviewData.author || 'Usuario Anónimo',
      rate: reviewData.rate,
      date: new Date().toISOString().split('T')[0],
      comment: reviewData.comment || '',
      productId: reviewData.productId,
      verified: true
    };
    setReviews((prev) => [newRev, ...prev]);
  };

  const addNewOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
    const orderId = `AN-${100000 + orders.length + Math.floor(Math.random() * 89999)}`;
    const finalOrder: Order = {
      ...orderData,
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      status: 'Procesando'
    };
    setOrders((prev) => [finalOrder, ...prev]);
    return finalOrder;
  };

  // Calculations
  const getCartSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.selectedVariant.price * item.quantity, 0);
  };

  const getCartDiscountAmount = () => {
    const subtotal = getCartSubtotal();
    if (!appliedCoupon) return 0;
    return Math.round((subtotal * appliedCoupon.discountPercent) / 100);
  };

  // Calculate pricing based on location
  const getShippingPrice = () => {
    const subtotal = getCartSubtotal();
    if (subtotal === 0) return 0;
    if (appliedCoupon?.code === 'ENVIOFREE') return 0;

    // Thresholds for Free Delivery:
    if (locationProvince === 'CABA' && subtotal >= 20000) return 0;
    if (locationProvince === 'GBA' && subtotal >= 25000) return 0;
    if (locationProvince === 'Interior' && subtotal >= 35000) return 0;

    // Base rates
    if (locationProvince === 'CABA') return 2500;
    if (locationProvince === 'GBA') return 3500;
    return 5900; // Interior
  };

  const getCartTotal = () => {
    const subtotal = getCartSubtotal();
    const discount = getCartDiscountAmount();
    const shipping = getShippingPrice();
    return Math.max(0, subtotal - discount + shipping);
  };

  // Shipping details mapping for checkout
  const shippingMethods: ShippingMethod[] = [
    {
      id: 'standard',
      name: 'Envío Estándar a Domicilio',
      price: getShippingPrice(), // custom based on location
      delay: locationProvince === 'Interior' ? '5 a 8 días hábiles' : '2 a 4 días hábiles'
    },
    {
      id: 'express',
      name: 'Envío Express de Prioridad (24/48hs)',
      price: getShippingPrice() > 0 ? Math.round(getShippingPrice() * 1.5) : 2900,
      delay: 'Siguiente día hábil'
    },
    {
      id: 'pickup',
      name: 'Retiro en Sucursal Central (CABA)',
      price: 0,
      delay: 'Disponible para retirar en 2hs'
    }
  ];

  return (
    <ShopContext.Provider
      value={{
        currentView,
        setCurrentView,
        products: initialProducts,
        categories,
        blogPosts,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        selectedProduct,
        setSelectedProduct,
        selectedCategorySlug,
        setSelectedCategorySlug,
        searchQuery,
        setSearchQuery,
        searchHistory,
        addToSearchHistory,
        clearSearchHistory,
        currency,
        setCurrency,
        exchangeRate,
        locationProvince,
        setLocationProvince,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        reviews,
        addReview,
        orders,
        addNewOrder,
        getCartSubtotal,
        getCartDiscountAmount,
        getShippingPrice,
        getCartTotal,
        shippingMethods
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
