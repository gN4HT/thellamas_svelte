export interface Supplier {
  id?: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  status: number;
  inventory_id?: number;
  created_at: string | null;
  updated_at: string | null;
}
