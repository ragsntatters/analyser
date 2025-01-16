import { supabase } from './supabase';

export async function signUp(email: string, password: string) {
  console.log('Attempting to sign up user...');
  
  // Input validation
  if (!email?.trim()) {
    console.error('Missing email');
    throw new Error('Email is required');
  }
  
  if (!password?.trim()) {
    console.error('Missing password');
    throw new Error('Password is required');
  }
  
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      console.error('Supabase signup error:', {
        message: error.message,
        status: error.status,
        name: error.name,
        details: error
      });
      throw error;
    }
    
    console.log('Signup response received:', {
      user: data.user ? 'User object present' : 'No user object',
      session: data.session ? 'Session present' : 'No session',
      userId: data.user?.id
    });

    return data;
  } catch (err) {
    console.error('Unexpected error during signup:', {
      error: err,
      email: email.replace(/[^@]+@/, '***@'), // Log email domain only for debugging
      timestamp: new Date().toISOString(),
      errorType: err instanceof Error ? err.name : 'Unknown'
    });
    throw err;
  }
}

export async function signIn(email: string, password: string) {
  console.log('Attempting to sign in user...');
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    throw error;
  }
  
  console.log('Signin successful');
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}