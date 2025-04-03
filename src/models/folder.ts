export interface Folder {
  id: number;
  name: string;
  isNew: boolean;
  parent_id: number | null;
}
