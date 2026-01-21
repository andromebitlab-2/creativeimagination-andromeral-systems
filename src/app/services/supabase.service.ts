import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, Session, User } from '@supabase/supabase-js';
import { Post } from '../types';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private supabaseUrl = 'https://fcuockvhvwklpvqtbbex.supabase.co';
  private supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjdW9ja3ZodndrbHB2cXRiYmV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NDM0MDYsImV4cCI6MjA3OTIxOTQwNn0.OjHmT2KEzDCMTtj97CWglPCJIqp8mqWAiJ43as9-Su0';

  session = signal<Session | null>(null);

  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.session.set(session);
    });
  }

  get user(): User | null | undefined {
    return this.session()?.user;
  }

  async signIn(credentials: { email: any; password: any; }) {
    return this.supabase.auth.signInWithPassword(credentials);
  }

  async signOut() {
    return this.supabase.auth.signOut();
  }

  async getPosts(): Promise<{ error: any; data: Post[] | null }> {
    const { data, error } = await this.supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  }

  async getPostById(id: string): Promise<{ error: any; data: Post | null }> {
    const { data, error } = await this.supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  }

  async createPost(post: { title: string; content: string; image_url: string; }) {
     if (!this.user) {
        throw new Error('User must be logged in to create a post.');
     }
    const { data, error } = await this.supabase
      .from('posts')
      .insert([{ 
        ...post,
        author_email: this.user.email
      }]);
    return { data, error };
  }
}
