import { supabase } from '../supabase.js';

// Development helper to create confirmed users (for testing only)
export async function createConfirmedUser(email, password) {
  try {
    // First, create the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`
      }
    });
    
    if (error) throw error;
    
    // If user was created, we can manually confirm them in development
    if (data.user) {
      console.log('User created successfully:', data.user);
      return data;
    }
    
    return data;
  } catch (error) {
    console.error('Error creating confirmed user:', error);
    throw error;
  }
}

// Helper to check if we're in development mode
export function isDevelopment() {
  return import.meta.env.DEV;
} 