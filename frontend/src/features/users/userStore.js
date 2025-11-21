import { create } from "zustand";

const useUser = create((set) => ({
  user: {
    name: '',
    email: '',
    token:'',
  },
  login: (email, password) => set(() => {
    // Login logic
  })
}));
