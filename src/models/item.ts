export interface Item {
  id?: number;
  name: string;
  quantity: number;
  stock_level: number;
  price: number;
  images: string[] | string | null; // Có thể là array, JSON string, hoặc null
  notes: string;
  qr: string;
  is_deleted: number;
  supplier_id: number;
  folder_id: number | null;
  created_at: string;
  updated_at: string;
  tags?: Array<{ id: number; name: string }>;
}
