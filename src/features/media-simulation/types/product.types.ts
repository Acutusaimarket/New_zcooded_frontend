export interface ProductSpecification {
  battery?: string;
  storage?: string;
  ram?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface ProductMetadata {
  warranty?: string;
  brand?: string;
  model?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface Product {
  name: string;
  description: string;
  price: number;
  currency: string;
  country: string;
  city: string;
  images: string[];
  features: string[];
  specification: ProductSpecification;
  color: string;
  size: string;
  weight: string;
  metadata: ProductMetadata;
  product_type: string;
  _id: string;
  created_at: string;
  updated_at: string;
}
