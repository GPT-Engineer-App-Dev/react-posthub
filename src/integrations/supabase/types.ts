/**
 * TypeScript interfaces for Supabase tables based on openapi.json
 */

// Interface for 'reactions' table
export interface Reaction {
  id: number; // Primary Key
  post_id: number; // Foreign Key to 'posts.id'
  user_id: string;
  emoji: string; // Max length 2
}

// Interface for 'posts' table
export interface Post {
  id: number; // Primary Key
  title: string;
  body: string;
  created_at?: string; // Timestamp with time zone, default is CURRENT_TIMESTAMP
  author_id: string;
}