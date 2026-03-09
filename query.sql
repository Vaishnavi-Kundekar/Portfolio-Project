-- ============================================
-- VAISHNAVI'S PORTFOLIO DATABASE SETUP
-- Simplified version without foreign key constraints
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- ============================================
-- DROP EXISTING TABLES (Safe order)
-- ============================================
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS projects;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- CREATE TABLES
-- ============================================

-- Projects table
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(500),
    demo_url VARCHAR(500),
    github_url VARCHAR(500),
    technologies TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Skills table
CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    proficiency INT NOT NULL CHECK (proficiency >= 0 AND proficiency <= 100),
    icon VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contacts table
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INSERT YOUR PROJECTS
-- ============================================

INSERT INTO projects (title, description, image, demo_url, github_url, technologies) VALUES
('Calculator',
 'A responsive calculator app built with HTML, CSS, and JavaScript, providing basic arithmetic functionality with a clean UI.',
 'https://via.placeholder.com/400x200/764ba2/ffffff?text=Calculator',
 'https://vaishnavi-kundekar.github.io/Calculator/',
 'https://github.com/Vaishnavi-Kundekar/Calculator',
 'HTML, CSS, JavaScript'),


('Quiz App',
 'An interactive quiz application with multiple-choice questions, score tracking, and responsive design.',
 'https://via.placeholder.com/400x200/667eea/ffffff?text=Quiz+App',
 'https://vaishnavi-kundekar.github.io/Quiz-app/',
 'https://github.com/Vaishnavi-Kundekar/Quiz-app',
 'HTML, CSS, JavaScript'),

('Expense Tracker',
 'An expense tracking application with neon theme UI, allowing users to manage and categorize expenses.',
 'https://via.placeholder.com/400x200/ff6a00/ffffff?text=Expense+Tracker',
 'https://vaishnavi-kundekar.github.io/Track-expenses-neon-theme/',
 'https://github.com/Vaishnavi-Kundekar/Track-expenses-neon-theme',
 'HTML, CSS, JavaScript'),

('Random Quote Generator',
 'A web application that fetches and displays random quotes with each refresh, offering a new experience each time.',
 'https://via.placeholder.com/400x200/6a11cb/ffffff?text=Quote+Generator',
 'https://vaishnavi-kundekar.github.io/Random-quote-generator/',
 'https://github.com/Vaishnavi-Kundekar/Random-quote-generator',
 'HTML, CSS, JavaScript, API');

;

-- ============================================
-- INSERT SKILLS
-- ============================================

INSERT INTO skills (category, name, proficiency, icon) VALUES
-- Frontend Skills
('Frontend', 'HTML5', 90, 'fab fa-html5'),
('Frontend', 'CSS3', 85, 'fab fa-css3-alt'),
('Frontend', 'JavaScript', 80, 'fab fa-js'),
('Frontend', 'React', 75, 'fab fa-react'),

-- Backend Skills
('Backend', 'Node.js', 85, 'fab fa-node-js'),
('Backend', 'Express.js', 80, 'fas fa-server'),
('Backend', 'MySQL', 78, 'fas fa-database'),
('Backend', 'MongoDB', 70, 'fas fa-leaf'),

-- Tools & Others
('Tools', 'Git', 85, 'fab fa-git-alt'),
('Tools', 'GitHub', 85, 'fab fa-github'),
('Tools', 'Responsive Design', 90, 'fas fa-mobile-alt'),
('Tools', 'Version Control', 88, 'fas fa-code-branch');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Show all tables
SHOW TABLES;

-- Count records in each table
SELECT 'Projects' as table_name, COUNT(*) as count FROM projects
UNION ALL
SELECT 'Skills', COUNT(*) FROM skills
UNION ALL
SELECT 'Contacts', COUNT(*) FROM contacts;

-- View all projects
SELECT id, title, technologies FROM projects;

-- View all skills grouped by category
SELECT category, COUNT(*) as skill_count, ROUND(AVG(proficiency), 1) as avg_proficiency 
FROM skills 
GROUP BY category;

-- Success message
SELECT 'Database setup completed successfully!' as status;


USE portfolio_db;
SELECT COUNT(*) FROM projects;