import { create } from 'zustand'

interface ImageStore {
  corporationImg: string | null;
  setCorporationImg: (url: string) => void;
}

export const useImageStore = create<ImageStore>((set) => ({
  corporationImg: null,
  setCorporationImg: (url) => set({ corporationImg: url }),
}))
