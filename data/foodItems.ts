
import { FoodItem } from '../types';

export const FOOD_ITEMS: FoodItem[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Fresh basil, buffalo mozzarella, and san marzano tomatoes on a sourdough crust.',
    cuisine: 'Italian',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?auto=format&fit=crop&q=80&w=800',
    dietaryTags: ['Vegetarian'],
    priceRange: '$$',
    rating: 4.8
  },
  {
    id: '2',
    name: 'Spicy Salmon Roll',
    description: 'Fresh Atlantic salmon, cucumber, and spicy mayo wrapped in toasted nori.',
    cuisine: 'Japanese',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800',
    dietaryTags: ['Dairy-Free', 'Gluten-Free'],
    priceRange: '$$$',
    rating: 4.9
  },
  {
    id: '3',
    name: 'Tacos al Pastor',
    description: 'Traditional Mexican tacos with marinated pork, pineapple, and fresh cilantro.',
    cuisine: 'Mexican',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=800',
    dietaryTags: ['Dairy-Free'],
    priceRange: '$',
    rating: 4.7
  },
  {
    id: '4',
    name: 'Avocado Toast',
    description: 'Creamy smashed avocado on artisanal sourdough with chili flakes and radish.',
    cuisine: 'American',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=800',
    dietaryTags: ['Vegan', 'Vegetarian'],
    priceRange: '$$',
    rating: 4.5
  },
  {
    id: '5',
    name: 'Paneer Butter Masala',
    description: 'Cottage cheese cubes in a rich, creamy tomato gravy with aromatic spices.',
    cuisine: 'Indian',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=800',
    dietaryTags: ['Vegetarian', 'Gluten-Free'],
    priceRange: '$$',
    rating: 4.9
  },
  {
    id: '6',
    name: 'Classic Cheeseburger',
    description: 'Grass-fed beef patty, sharp cheddar, lettuce, tomato, and house sauce.',
    cuisine: 'American',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
    dietaryTags: [],
    priceRange: '$$',
    rating: 4.6
  },
  {
    id: '7',
    name: 'Green Curry',
    description: 'Thai green curry with bamboo shoots, bell peppers, and coconut milk.',
    cuisine: 'Thai',
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&q=80&w=800',
    dietaryTags: ['Gluten-Free', 'Vegan', 'Dairy-Free'],
    priceRange: '$$',
    rating: 4.8
  },
  {
    id: '8',
    name: 'Bibimbap',
    description: 'Korean mixed rice bowl with sautéed vegetables, beef, and a sunny-side-up egg.',
    cuisine: 'Korean',
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&q=80&w=800',
    dietaryTags: [],
    priceRange: '$$',
    rating: 4.7
  }
];
