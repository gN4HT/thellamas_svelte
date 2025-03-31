export interface Folder {
  isNew?: boolean;
  id?: number;
  name?: string;
  description?: string;
  color?: string;
  is_deleted?: number;
  parent_id?: number;
  created_at?: string;
  updated_at?: string;
  tags?: Array<{ id: number; name: string }>;
}
