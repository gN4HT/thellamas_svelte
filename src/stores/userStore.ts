import { writable } from "svelte/store";

export type UserRole = "owner" | "staff" | "viewer";

interface UserInventory {
  id: number;
  user_id: number;
  inventory_id: number;
  role: UserRole;
  join_at: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  recent_inventory_id: number;
  user_inventories: UserInventory[];
}

function createUserStore() {
  const { subscribe, set, update } = writable<User | null>(null);

  return {
    subscribe,
    set,
    update,
    // Helper function để kiểm tra quyền
    hasPermission: (user: User | null) => {
      if (!user) return false;

      // Tìm role của user trong kho hiện tại
      const currentInventory = user.user_inventories.find(
        (inv) => inv.inventory_id === user.recent_inventory_id
      );

      if (!currentInventory) return false;

      // Chỉ owner và staff mới có quyền edit
      return ["owner", "staff"].includes(currentInventory.role);
    },
  };
}

export const userStore = createUserStore();
