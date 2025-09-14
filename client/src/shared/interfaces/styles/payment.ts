export interface PaymentResult {
  amountRoubles: number;
  confirmationUrl: string;
  createdAt: string;
  id: string;
  itemId: string;
  status: "pending" | "succeeded" | "canceled";
  type: "style" | "subscription";
  userId: string;
  yooKassaId: string;
}
