import { create } from "zustand";

const useUser = create((set) => {
  user: {
    name: '',
    email: '',
    token:'',
  },
  login: (email, password) => set((state) => {
    if(!email) return 'Ingrese su correo electronico'
    if(!password) return 'Ingrese su contraseña'
  })
  
});
