-- Seed Books
INSERT INTO books_5234 (title, author, isbn, publication_year, category, total_copies, available_copies) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', '978-0-7432-7356-5', 1925, 'Fiction', 3, 2),
('To Kill a Mockingbird', 'Harper Lee', '978-0-06-112008-4', 1960, 'Fiction', 2, 1),
('1984', 'George Orwell', '978-0-451-52494-2', 1949, 'Dystopian', 3, 2),
('Pride and Prejudice', 'Jane Austen', '978-0-14-143951-8', 1813, 'Romance', 2, 2),
('The Catcher in the Rye', 'J.D. Salinger', '978-0-316-76948-0', 1951, 'Fiction', 2, 1),
('Sapiens', 'Yuval Noah Harari', '978-0-06-231609-7', 2011, 'Non-Fiction', 2, 1),
('Educated', 'Tara Westover', '978-0-399-59065-8', 2018, 'Memoir', 2, 2),
('Atomic Habits', 'James Clear', '978-0-735-21141-8', 2018, 'Self-Help', 3, 3),
('The Midnight Library', 'Matt Haig', '978-0-525-55589-7', 2020, 'Fiction', 2, 1),
('Dune', 'Frank Herbert', '978-0-441-17271-9', 1965, 'Science Fiction', 3, 2);

-- Seed Members
INSERT INTO members_5234 (name, email, phone, address, membership_status) VALUES
('John Smith', 'john.smith@email.com', '555-0101', '123 Main St, City', 'active'),
('Sarah Johnson', 'sarah.j@email.com', '555-0102', '456 Oak Ave, City', 'active'),
('Michael Brown', 'm.brown@email.com', '555-0103', '789 Pine Rd, City', 'active'),
('Emily Davis', 'emily.d@email.com', '555-0104', '321 Elm St, City', 'active'),
('Robert Wilson', 'r.wilson@email.com', '555-0105', '654 Maple Dr, City', 'active'),
('Jessica Martinez', 'j.martinez@email.com', '555-0106', '987 Cedar Ln, City', 'active'),
('David Anderson', 'd.anderson@email.com', '555-0107', '147 Birch Way, City', 'active'),
('Lisa Taylor', 'lisa.t@email.com', '555-0108', '258 Spruce Ct, City', 'active');

-- Seed Librarians
INSERT INTO librarians_5234 (name, email, password_hash, role) VALUES
('Admin User', 'admin@library.com', '$2b$10$abcdefghijklmnopqrstuvwxyz123456789', 'admin'),
('Sarah Librarian', 'sarah@library.com', '$2b$10$abcdefghijklmnopqrstuvwxyz123456789', 'librarian');

-- Seed Issued Books (some overdue, some active)
INSERT INTO issued_books_5234 (book_id, member_id, issue_date, due_date, return_date, status, fine_amount) VALUES
(1, 1, '2025-02-15', '2025-03-15', NULL, 'issued', 0),
(3, 2, '2025-02-10', '2025-03-10', NULL, 'issued', 50.00),
(5, 3, '2025-02-20', '2025-03-20', NULL, 'issued', 0),
(7, 4, '2025-03-01', '2025-04-01', NULL, 'issued', 0),
(2, 5, '2025-02-08', '2025-03-08', '2025-03-05', 'returned', 0),
(4, 6, '2025-03-10', '2025-04-10', NULL, 'issued', 0),
(6, 7, '2025-03-05', '2025-04-05', NULL, 'issued', 0),
(8, 8, '2025-03-15', '2025-04-15', NULL, 'issued', 0);
