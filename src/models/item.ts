export interface Item {
  id: number;
  name: string;
  isNew: boolean;
  quantity: number | null;
  price: number | null;
  stock_level: number | null;
  images: File[];
  notes: string;
  folder_id?: number;
  created_at?: string;
  updated_at?: string;
  inventory_id?: number;
  is_deleted?: number;
}
