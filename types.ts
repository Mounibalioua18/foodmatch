
export type CuisineType = 'Italian' | 'Japanese' | 'Mexican' | 'Indian' | 'American' | 'Mediterranean' | 'Thai' | 'Chinese' | 'French' | 'Korean';

export type DietaryTag = 'Vegetarian' | 'Vegan' | 'Gluten-Free' | 'Dairy-Free' | 'Keto' | 'Paleo';

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  cuisine: CuisineType;
  image: string;
  dietaryTags: DietaryTag[];
  priceRange: '$' | '$$' | '$$$';
  rating: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profilePic: string;
  joinedAt: number;
  bio?: string;
  avatarSeed?: string;
}

export interface SocialMatch {
  userId: string;
  name: string;
  profilePic: string;
  sharedFoodIds: string[];
  matchStrength: number;
}

export type SwipeDirection = 'left' | 'right' | 'up' | 'none';

export type AppView = 'swipe' | 'matches' | 'messages' | 'settings' | 'profile' | 'auth';
