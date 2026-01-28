
import { User } from '../types';

const DB_URL = "https://food-match-28ed2-default-rtdb.europe-west1.firebasedatabase.app/";

const sanitizeId = (id: string) => id.replace(/[.$#[\]/]/g, "_");

export const firebase = {
  // Put user profile (NO PASSWORD)
  async putUser(user: Omit<User, 'password'>) {
    const id = sanitizeId(user.id);
    const response = await fetch(`${DB_URL}users/${id}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    return response.json();
  },

  async getUser(userId: string): Promise<User | null> {
    const id = sanitizeId(userId);
    const response = await fetch(`${DB_URL}users/${id}.json`);
    return response.json();
  },

  async deleteUser(userId: string) {
    const id = sanitizeId(userId);
    await fetch(`${DB_URL}users/${id}.json`, { method: 'DELETE' });
    await fetch(`${DB_URL}likes/${id}.json`, { method: 'DELETE' });
  },

  async saveLike(userId: string, foodId: string) {
    const id = sanitizeId(userId);
    await fetch(`${DB_URL}likes/${id}/${foodId}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(true)
    });
  },

  async getLikes(userId: string): Promise<Record<string, boolean>> {
    const id = sanitizeId(userId);
    const response = await fetch(`${DB_URL}likes/${id}.json`);
    const data = await response.json();
    return data || {};
  },

  async getAllLikes(): Promise<Record<string, Record<string, boolean>>> {
    const response = await fetch(`${DB_URL}likes.json`);
    const data = await response.json();
    return data || {};
  },

  async getAllUsers(): Promise<Record<string, User>> {
    const response = await fetch(`${DB_URL}users.json`);
    const data = await response.json();
    return data || {};
  }
};