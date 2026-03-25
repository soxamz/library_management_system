-- Create Books table
CREATE TABLE IF NOT EXISTS books_5234 (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  isbn VARCHAR(20) UNIQUE,
  publication_year INTEGER,
  category VARCHAR(100),
  total_copies INTEGER DEFAULT 1,
  available_copies INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Members table
CREATE TABLE IF NOT EXISTS members_5234 (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  membership_date DATE DEFAULT CURRENT_DATE,
  membership_status VARCHAR(50) DEFAULT 'active',
  fine_amount DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Librarians table
CREATE TABLE IF NOT EXISTS librarians_5234 (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'librarian',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Issued_Books table
CREATE TABLE IF NOT EXISTS issued_books_5234 (
  id SERIAL PRIMARY KEY,
  book_id INTEGER NOT NULL REFERENCES books_5234(id) ON DELETE CASCADE,
  member_id INTEGER NOT NULL REFERENCES members_5234(id) ON DELETE CASCADE,
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  return_date DATE,
  status VARCHAR(50) DEFAULT 'issued',
  fine_amount DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_issued_books_5234_book_id ON issued_books_5234(book_id);
CREATE INDEX IF NOT EXISTS idx_issued_books_5234_member_id ON issued_books_5234(member_id);
CREATE INDEX IF NOT EXISTS idx_issued_books_5234_status ON issued_books_5234(status);
CREATE INDEX IF NOT EXISTS idx_members_5234_email ON members_5234(email);
CREATE INDEX IF NOT EXISTS idx_books_5234_category ON books_5234(category);
