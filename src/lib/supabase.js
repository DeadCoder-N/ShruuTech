import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(
  supabaseUrl || 'https://uijwammfvaduslrxcdap.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpandhbW1mdmFkdXNscnhjZGFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3MjU1NDYsImV4cCI6MjA2MTMwMTU0Nn0.-zcaniutf-oEqJewEVdtBnCGzxW3HP8NG4ytVPw3EF4'
);

// Authentication helpers
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Data fetching helpers
export const fetchServices = async () => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const fetchCourses = async () => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const fetchBlogPosts = async () => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const fetchBlogPost = async (id) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();
  
  return { data, error };
};

export const fetchJobListings = async () => {
  const { data, error } = await supabase
    .from('job_listings')
    .select('*')
    .order('created_at', { ascending: false });
  
  return { data, error };
};

// Create helpers
export const createService = async (service) => {
  const { data, error } = await supabase
    .from('services')
    .insert([service]);
  
  return { data, error };
};

export const createCourse = async (course) => {
  const { data, error } = await supabase
    .from('courses')
    .insert([course]);
  
  return { data, error };
};

export const createBlogPost = async (post) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([post]);
  
  return { data, error };
};

export const createJobListing = async (job) => {
  const { data, error } = await supabase
    .from('job_listings')
    .insert([job]);
  
  return { data, error };
};

// Update helpers
export const updateService = async (id, updates) => {
  const { data, error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', id);
  
  return { data, error };
};

export const updateCourse = async (id, updates) => {
  const { data, error } = await supabase
    .from('courses')
    .update(updates)
    .eq('id', id);
  
  return { data, error };
};

export const updateBlogPost = async (id, updates) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .update(updates)
    .eq('id', id);
  
  return { data, error };
};

export const updateJobListing = async (id, updates) => {
  const { data, error } = await supabase
    .from('job_listings')
    .update(updates)
    .eq('id', id);
  
  return { data, error };
};

// Delete helpers
export const deleteService = async (id) => {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);
  
  return { error };
};

export const deleteCourse = async (id) => {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id);
  
  return { error };
};

export const deleteBlogPost = async (id) => {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);
  
  return { error };
};

export const deleteJobListing = async (id) => {
  const { error } = await supabase
    .from('job_listings')
    .delete()
    .eq('id', id);
  
  return { error };
};

// Storage helpers
export const uploadImage = async (file, bucket, path) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) {
    return { error };
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return { data: { ...data, publicUrl: publicUrlData.publicUrl } };
};