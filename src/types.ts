/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProductVariant {
  label: string; // e.g. "250g", "500g", "1kg"
  price: number; // custom price for this variant
}

export interface NutritionalInfo {
  servingSize: string; // e.g. "100g"
  calories: string;
  totalFat: string;
  carbohydrates: string;
  protein: string;
  sodium: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  weight: string; // standard default weight
  price: number;
  previousPrice?: number;
  discount?: number; // percentage (e.g., 15 for 15% off)
  rating: number;
  reviewsCount: number;
  image: string;
  categoryId: string;
  description: string;
  ingredients: string[];
  nutritionalFacts: NutritionalInfo;
  variants: ProductVariant[];
  stock: number;
  isGlutenFree: boolean; // Sin TACC
  isVegan: boolean;
  isOrganic: boolean;
  isFeatured?: boolean;
  isOffer?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'Alimentación saludable' | 'Recetas' | 'Nutrición' | 'Bienestar' | 'Vida sana';
  date: string;
  readTime: string;
  author: string;
  image: string;
  tags: string[];
}

export interface Review {
  id: string;
  author: string;
  rate: number;
  date: string;
  comment: string;
  productId: string;
  verified: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant: ProductVariant;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
  minSpend?: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dni: string;
  };
  addressInfo: {
    street: string;
    number: string;
    apartment?: string;
    city: string;
    province: string;
    postalCode: string;
  };
  shippingMethod: {
    id: string;
    name: string;
    price: number;
    delay: string;
  };
  paymentMethod: {
    type: 'credit' | 'debit' | 'transfer' | 'cash';
    details: string;
  };
  subtotal: string;
  shippingPrice: string;
  discountAmount: string;
  total: string;
  date: string;
  status: 'Procesando' | 'Enviado' | 'Entregado';
}
