-- Create performance_metrics table
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page TEXT NOT NULL,
  load_time FLOAT NOT NULL,
  ttfb FLOAT NOT NULL,
  fcp FLOAT NOT NULL,
  lcp FLOAT NOT NULL,
  cls FLOAT NOT NULL,
  fid FLOAT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for querying by page and timestamp
CREATE INDEX IF NOT EXISTS performance_metrics_page_created_at_idx ON performance_metrics (page, created_at);

-- Create error_logs table
CREATE TABLE IF NOT EXISTS error_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  user_id UUID REFERENCES auth.users(id),
  path TEXT NOT NULL,
  browser TEXT NOT NULL,
  os TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for querying by path and timestamp
CREATE INDEX IF NOT EXISTS error_logs_path_created_at_idx ON error_logs (path, created_at);

-- Add RLS policies
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- Allow admins to read performance metrics
CREATE POLICY "Allow admins to read performance metrics"
  ON performance_metrics
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

-- Allow admins to insert performance metrics
CREATE POLICY "Allow admins to insert performance metrics"
  ON performance_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

-- Allow admins to read error logs
CREATE POLICY "Allow admins to read error logs"
  ON error_logs
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

-- Allow admins to insert error logs
CREATE POLICY "Allow admins to insert error logs"
  ON error_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )); 