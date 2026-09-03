export type Route = "home" | "shop" | "product" | "custom" | "materials" | "about" | "refer";

export type ShopQuery = {
  type?: string;
  color?: string;
};

export type ProductVariant = {
  id: string;
  title: string;
  price: string;
  available: boolean;
  sku?: string;
};

export type ProductItem = {
  name: string;
  price: string;
  type: string;
  color: string;
  tone: string;
  code: string;
  sku?: string;
  karat?: string;
  listed?: boolean;
  image?: string;
  images?: string[];
  handle?: string;
  options?: string;
  optionValues?: string[];
  variantId?: string;
  variants?: ProductVariant[];
  description?: string;
  sizeCompare?: string;
  vendor?: string;
  tags?: string[];
};

export type BagLine = {
  name: string;
  handle?: string;
  variantId?: string;
  quantity: number;
  image?: string;
  price?: string;
  variantTitle?: string;
  sku?: string;
};

export type Go = (route: Route, handle?: string, query?: ShopQuery) => void;
