import { writable } from 'svelte/store';
import type { Folder } from '../models/folder';

export const folderStore = writable<Folder[]>([]);

export const updateFolders = (folders: Folder[]) => {
    folderStore.set(folders);
};