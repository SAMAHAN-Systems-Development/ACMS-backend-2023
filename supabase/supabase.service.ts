// supabase.service.ts

import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseURL = process.env.SUPABASE_URL;
    const supabaseAPIKey = process.env.SUPABASE_KEY;

    console.log('Supabase URL:', supabaseURL); // Log the URL before creating the client

    this.supabase = createClient(supabaseURL, supabaseAPIKey);
  }

  getSupabase() {
    return this.supabase;
  }

  async createSupabaseUser(email: string, password: string): Promise<any> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });
  
    if (error) {
      // Handle Supabase signup error
      throw new Error(`Supabase signup failed: ${error.message}`);
    }
  
    return data;
  }
  
}
