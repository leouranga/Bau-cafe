import type { CartLine, MenuItem } from "../types";


export const latte: MenuItem = {
  id: "latte",
  name: "Latte",
  description: "",
  price: 350,
  category: "drink",
  inStock: true,
};

export const espresso: MenuItem = {
  id: "espresso",
  name: "Espresso",
  description: "",
  price: 200,
  category: "drink",
  inStock: true,
};

export const muffin: MenuItem = {
  id: "muffin",
  name: "Muffin",
  description: "",
  price: 290,
  category: "food",
  inStock: true,
};

export const soldOutTea: MenuItem = {
  id: "tea",
  name: "Iced Tea",
  description: "",
  price: 280,
  category: "drink",
  inStock: false,
};

export function line(item: MenuItem, quantity = 1): CartLine {
  return { item, quantity };
}
