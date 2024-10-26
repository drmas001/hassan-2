import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (employeeCode: string) => Promise<void>;
  signInAdmin: (employeeCode: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  signIn: async (employeeCode: string) => {
    try {
      // Special demo user case
      if (employeeCode.toLowerCase() === 'drmas1191411') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'drmas1191411@icu.medical',
          password: 'DrMas2002!@#$',
        });
        
        if (error) {
          // If login fails, create account
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: 'drmas1191411@icu.medical',
            password: 'DrMas2002!@#$',
            options: {
              data: {
                role: 'Doctor',
                name: 'Dr. Mas',
                employeeCode: 'drmas1191411'
              }
            }
          });

          if (signUpError) throw signUpError;
          set({ user: signUpData.user });
          return;
        }

        set({ user: data.user });
        return;
      }

      // Regular user authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${employeeCode.toLowerCase()}@icu.medical`,
        password: `${employeeCode}2024!`,
      });
      
      if (error) {
        // If login fails, create user account
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: `${employeeCode.toLowerCase()}@icu.medical`,
          password: `${employeeCode}2024!`,
          options: {
            data: {
              role: 'User',
              name: employeeCode,
              employeeCode: employeeCode
            }
          }
        });

        if (signUpError) throw signUpError;
        set({ user: signUpData.user });
        return;
      }

      set({ user: data.user });
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  },

  signInAdmin: async (employeeCode: string) => {
    try {
      const { data: adminData, error: adminCheckError } = await supabase
        .from('admins')
        .select('*')
        .eq('employee_code', employeeCode)
        .single();

      if (adminCheckError || !adminData) {
        throw new Error('Invalid admin credentials');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${employeeCode.toLowerCase()}@admin.icu.medical`,
        password: `${employeeCode}Admin2024!`,
      });

      if (error) {
        // If login fails, create admin account
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: `${employeeCode.toLowerCase()}@admin.icu.medical`,
          password: `${employeeCode}Admin2024!`,
          options: {
            data: {
              role: 'Admin',
              name: adminData.name,
              employeeCode: employeeCode
            }
          }
        });

        if (signUpError) throw signUpError;
        set({ user: signUpData.user });
        return;
      }

      set({ user: data.user });
    } catch (error) {
      console.error('Admin authentication error:', error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null });
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  initialize: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      set({ user, loading: false });

      supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user ?? null });
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ loading: false });
    }
  },
}));