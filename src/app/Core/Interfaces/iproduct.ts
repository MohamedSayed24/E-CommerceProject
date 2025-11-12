export interface IProduct {
  
      _id: string;
      title: string;
      price: number;
      priceAfterDiscount?: number;
      imageCover: string;
      ratingsAverage: number;
      ratingsQuantity: number;
      category: { _id: string; name: string };
   
}
