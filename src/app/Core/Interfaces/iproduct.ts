export interface IProduct {
  _id: string;
  title: string;
  description?: string;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  images?: string[];
  ratingsAverage: number;
  ratingsQuantity: number;
  category: {
    _id: string;
    name: string;
  };
  brand?: {
    _id: string;
    name: string;
  };
  subcategory?: Array<{
    _id: string;
    name: string;
  }>;
  quantity?: number;
  sold?: number;
}
