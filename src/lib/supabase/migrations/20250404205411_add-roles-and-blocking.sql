-- Add `role` and `is_blocked` columns to user_profiles
ALTER TABLE user_profiles
ADD COLUMN role TEXT DEFAULT 'user';

ALTER TABLE user_profiles
ADD COLUMN is_blocked BOOLEAN DEFAULT FALSE;

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Users can read, update, and delete their own posts
CREATE POLICY "Users can access their own posts"
ON posts FOR ALL
USING (
  auth.uid() = (
    SELECT user_id FROM user_profiles WHERE id = posts.profile_id
  )
);

-- Admins can delete any post
CREATE POLICY "Admins can delete any post"
ON posts FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Blocked users are not allowed to create posts
CREATE POLICY "Blocked users cannot create posts"
ON posts FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid() AND is_blocked = FALSE
  )
);

-- Admins can update any user profile (e.g., to block users)
CREATE POLICY "Admins can update any profile"
ON user_profiles FOR UPDATE
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
