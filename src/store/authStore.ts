import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Kategori } from "@/types";

interface User {
  id: string;
  name: string;
  username: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  list_kategori: Kategori[];
  jml_data: number;


  login: (username: string, password: string) => Promise<void>;
  register: (name: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  fetchKategori: (page?: number, search?: string) => Promise<number | void>;
  addKategori: (payload: { uraian: string }) => Promise<boolean>;
  editKategori: (id: string | number, payload: { uraian: string }) => Promise<boolean>;
  deleteKategori: (id: string | number) => Promise<boolean>;
}

const API_URL = "http://localhost:8000";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      list_kategori: [], 
      jml_data: 0,

      login: async (username, password) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.detail || "Login gagal");

          set({
            token: data.access_token,
            user: data.user,
            isAuthenticated: true,
            loading: false,
          });
        } catch (err) {
          if (err instanceof Error){
            set({ error: err.message, loading: false });
          }
        }
      },

      register: async (name, username, password) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, username, password }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.detail || "Registrasi gagal");

          set({ loading: false });
        } catch (err) {
          if (err instanceof Error){
            set({ error: err.message, loading: false });
          }
        }
      },

      fetchKategori: async (page: number = 1, search: string = "") => {
        const { token } = get();
        try {
          const res = await fetch(API_URL + '/kategori/view', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                data_ke: page,
                cari_value: search
            })
          });
          const res_data = await res.json();
          console.log(res_data);
          set({
            list_kategori: res_data.data,
            jml_data: res_data.jml_data,
            loading: false
           });
          return res_data.jml_data;
        } catch (err) {
          if (err instanceof Error){
            set({ error: err.message });
          }
        }
      },

      addKategori: async (payload) => {
        const { token } = get();
        set({ loading: true, error: null });
        try {
          const res = await fetch(API_URL + '/kategori/addData', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
          });
          const res_data = await res.json();
          if (!res.ok) throw new Error(res_data.detail || "Gagal menambah kategori");
          set({ loading: false });
          return true;
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          }
          return false;
        }
      },

      editKategori: async (id, payload) => {
        const { token } = get();
        set({ loading: true, error: null });
        try {
            const res = await fetch(`${API_URL}/kategori/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
          });
          const res_data = await res.json();
          if (!res.ok) throw new Error(res_data.detail || "Gagal mengubah kategori");
          set({ loading: false });
          return true;
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          }
          return false;
        }
      },

      deleteKategori: async (id) => {
        const { token } = get();
        set({ loading: true, error: null });
        try {
          const res = await fetch(`${API_URL}/kategori/${id}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          const res_data = await res.json();
          if (!res.ok) throw new Error(res_data.detail || "Gagal menghapus kategori");
          set({ loading: false });
          return true;
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          }
          return false;
        }
      },

      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          error: null
      }),

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);