export interface Item {
  id?: number;
  name: string;
  quantity: number;
  stock_level: number;
  price: number;
  images: string[] | string | null;
  notes: string;
  qr: string;
  is_deleted: number;
  supplier_id: number;
  folder_id: number | null;
  created_at: string;
  updated_at: string;
  tags?: Array<{ id: number; name: string }>;
  has_next: boolean;
  has_previous: boolean;
  last_id: number | null;
}
