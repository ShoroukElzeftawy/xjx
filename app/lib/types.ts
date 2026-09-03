export type Route = "home" | "shop" | "product" | "custom" | "materials" | "about";

export type ProductVariant = {
  id: string;
  title: string;
  price: string;
  available: boolean;
};

export type ProductItem = {
  name: string;
  price: string;
  type: string;
  tone: string;
  code: string;
  image?: string;
  images?: string[];
  handle?: string;
  options?: string;
  optionValues?: string[];
  variantId?: string;
  variants?: ProductVariant[];
  description?: string;
};

export type BagLine = {
  name: string;
  handle?: string;
  variantId?: string;
  quantity: number;
};

export type Go = (route: Route, handle?: string) => void;
