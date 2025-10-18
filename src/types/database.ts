// Database-related types and utilities
// Re-export Prisma types for convenience
export type { Prisma } from '@prisma/client';

// Database operation result types
export interface DatabaseOperationResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
}

// Query options and filters
export interface QueryOptions {
  orderBy?: Record<string, 'asc' | 'desc'>;
  include?: Record<string, boolean | object>;
  select?: Record<string, boolean>;
}

// Supabase Database Types
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>;
      };
      jobs: {
        Row: Job;
        Insert: Omit<Job, 'id' | 'created_at' | 'updated_at' | 'posted_at'>;
        Update: Partial<Omit<Job, 'id' | 'created_at' | 'updated_at' | 'posted_at'>>;
      };
      job_applications: {
        Row: JobApplication;
        Insert: Omit<JobApplication, 'id' | 'created_at' | 'updated_at' | 'status'>;
        Update: Partial<Omit<JobApplication, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_application_count: {
        Args: {
          job_id: number;
        };
        Returns: void;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Project Types
export interface Project {
  id: number;
  title: string;
  decription: string; // Note: matches your DB column name with typo
  long_description?: string;
  image_url?: string;
  technologies: string[];
  category: string; // Changed from union to string to match your data
  live_url?: string;
  github_url?: string;
  featured: boolean;
  year: string;
  status: string; // Changed from union to string to match your data
  created_at: string;
  updated_at?: string;
  display_orders: number; // Note: matches your DB column name (plural)
  client_name?: string;
  project_duration?: string;
  budjet_range?: string; // Note: matches your DB column name with typo
}

// Job Types
export interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  experience?: string;
  salary?: string;
  remote: boolean;
  urgent: boolean;
  description: string;
  requirements: string[];
  benifits: string[]; // Note: matches your DB column name with typo
  'responsibilities\'': string[]; // Note: matches your DB column name with apostrophe
  qualifications: string[];
  team?: string;
  application_count: number;
  is_active: boolean;
  posted_at: string;
  expires_at?: string;
  created_at?: string;
  'updated_attached is'?: string; // Note: matches your weird column name
}

export interface JobApplication {
  id: number;
  job_id: number;
  full_name: string;
  email: string;
  phone?: string;
  linedin_url?: string; // Note: matches your DB column name with typo
  portfolio_url?: string;
  resume_url?: string;
  cover_letter?: string;
  years_experience?: number;
  expected_salary?: string;
  notice_period?: string;
  willing_to_relocate: boolean;
  status: string;
  created_at: string;
  updated_at?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  count?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  error: string | null;
  count: number;
  has_more: boolean;
  page: number;
  per_page: number;
}

// Pagination Parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}
