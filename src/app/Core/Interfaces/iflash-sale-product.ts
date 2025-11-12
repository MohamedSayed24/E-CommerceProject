import { IProduct } from './iproduct';

export interface IFlashSaleProduct extends IProduct {
  discountPercentage: number;
}
