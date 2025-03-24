export interface Folder {
  isNew?: boolean;
  id?: bigint;
  name?: string;
  description?: string;
  color?: string;
  is_deleted?: number;
  parent_id?: bigint;
  inventory_id?: bigint;
  created_at?: string;
  updated_at?: string;
}
