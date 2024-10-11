export class BestSellerResponseBookDTO {
  id: number;
  title: string;
  price: number;
  category: string;
  stock: number;
  totalSold: number;

  constructor(partial: Partial<BestSellerResponseBookDTO>) {
    Object.assign(this, partial);
  }
}
