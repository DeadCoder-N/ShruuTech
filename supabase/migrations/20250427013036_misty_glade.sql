/*
  # Initial database schema for ShruuTech Security

  1. New Tables
    - `services` - Stores information about security services offered
    - `courses` - Stores information about security training courses
    - `blog_posts` - Stores blog posts and articles
    - `job_listings` - Stores job openings and career opportunities
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage content
*/

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon_name text DEFAULT 'shield',
  features text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image text,
  duration text NOT NULL,
  schedule text NOT NULL,
  timing text NOT NULL,
  mode text NOT NULL,
  fees text NOT NULL,
  batch text NOT NULL,
  trainer text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  author text NOT NULL,
  author_title text,
  date date NOT NULL,
  image text,
  read_time text DEFAULT '5 min read',
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Job listings table
CREATE TABLE IF NOT EXISTS job_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  location text NOT NULL,
  type text NOT NULL,
  salary text NOT NULL,
  description text NOT NULL,
  responsibilities text[] DEFAULT '{}',
  requirements text[] DEFAULT '{}',
  date_posted date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_listings ENABLE ROW LEVEL SECURITY;

-- Create policies for services table
CREATE POLICY "Anyone can view services" 
  ON services 
  FOR SELECT 
  USING (true);

CREATE POLICY "Only authenticated users can insert services" 
  ON services 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can update services" 
  ON services 
  FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Only authenticated users can delete services" 
  ON services 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Create policies for courses table
CREATE POLICY "Anyone can view courses" 
  ON courses 
  FOR SELECT 
  USING (true);

CREATE POLICY "Only authenticated users can insert courses" 
  ON courses 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can update courses" 
  ON courses 
  FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Only authenticated users can delete courses" 
  ON courses 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Create policies for blog_posts table
CREATE POLICY "Anyone can view blog posts" 
  ON blog_posts 
  FOR SELECT 
  USING (true);

CREATE POLICY "Only authenticated users can insert blog posts" 
  ON blog_posts 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can update blog posts" 
  ON blog_posts 
  FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Only authenticated users can delete blog posts" 
  ON blog_posts 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Create policies for job_listings table
CREATE POLICY "Anyone can view job listings" 
  ON job_listings 
  FOR SELECT 
  USING (true);

CREATE POLICY "Only authenticated users can insert job listings" 
  ON job_listings 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can update job listings" 
  ON job_listings 
  FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Only authenticated users can delete job listings" 
  ON job_listings 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Create trigger functions to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON services
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON courses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_job_listings_updated_at
BEFORE UPDATE ON job_listings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();