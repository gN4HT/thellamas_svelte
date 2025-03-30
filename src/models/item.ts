export interface Item {
  id?: number;
  name: string;
  quantity: number;
  stock_level: number;
  price: number;
  images: any;
  notes: string;
  qr: string;
  is_deleted: number;
  supplier_id: number;
  folder_id: number | null;
  inventory_id: number;
  created_at: string;
  updated_at: string;
  tags?: Array<{ id: number; name: string }>; // thêm định nghĩa tags
}
