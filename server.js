const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_NAME || 'portfolio_db'
});

// Connect to database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        console.log('Server will continue running without database functionality');
    } else {
        console.log('Connected to MySQL database successfully');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    // Create projects table
    const createProjectsTable = `
        CREATE TABLE IF NOT EXISTS projects (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            image VARCHAR(500),
            demo_url VARCHAR(500),
            github_url VARCHAR(500),
            technologies TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `;
    
    // Create contacts table
    const createContactsTable = `
        CREATE TABLE IF NOT EXISTS contacts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            subject VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    // Create skills table
    const createSkillsTable = `
        CREATE TABLE IF NOT EXISTS skills (
            id INT AUTO_INCREMENT PRIMARY KEY,
            category VARCHAR(100) NOT NULL,
            name VARCHAR(100) NOT NULL,
            proficiency INT NOT NULL CHECK (proficiency >= 0 AND proficiency <= 100),
            icon VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    db.query(createProjectsTable, (err) => {
        if (err) console.error('Error creating projects table:', err);
        else console.log('Projects table ready');
    });
    
    db.query(createContactsTable, (err) => {
        if (err) console.error('Error creating contacts table:', err);
        else console.log('Contacts table ready');
    });
    
    db.query(createSkillsTable, (err) => {
        if (err) console.error('Error creating skills table:', err);
        else console.log('Skills table ready');
        insertDefaultSkills();
    });
    
    insertDefaultProjects();
}

// Insert default projects if table is empty
function insertDefaultProjects() {
    const checkQuery = 'SELECT COUNT(*) as count FROM projects';
    
    db.query(checkQuery, (err, results) => {
        if (err) {
            console.error('Error checking projects:', err);
            return;
        }
        
        if (results[0].count === 0) {
            const defaultProjects = [
                {
                    title: 'Calculator',
                    description: 'A responsive calculator app built with HTML, CSS, and JavaScript, providing basic arithmetic functionality with a clean UI.',
                    image: 'https://via.placeholder.com/400x200/764ba2/ffffff?text=Calculator',
                    demo_url: 'https://vaishnavi-kundekar.github.io/Calculator/',
                    github_url: 'https://github.com/Vaishnavi-Kundekar/Calculator',
                    technologies: 'HTML, CSS, JavaScript'
                },
              
                {
                    title: 'Quiz App',
                    description: 'An interactive quiz application with multiple-choice questions, score tracking, and responsive design.',
                    image: 'https://via.placeholder.com/400x200/667eea/ffffff?text=Quiz+App',
                    demo_url: 'https://vaishnavi-kundekar.github.io/Quiz-app/',
                    github_url: 'https://github.com/Vaishnavi-Kundekar/Quiz-app',
                    technologies: 'HTML, CSS, JavaScript'
                },
                {
                    title: 'Expense Tracker',
                    description: 'An expense tracking application with neon theme UI, allowing users to manage and categorize expenses.',
                    image: 'https://via.placeholder.com/400x200/ff6a00/ffffff?text=Expense+Tracker',
                    demo_url: 'https://vaishnavi-kundekar.github.io/Track-expenses-neon-theme/',
                    github_url: 'https://github.com/Vaishnavi-Kundekar/Track-expenses-neon-theme',
                    technologies: 'HTML, CSS, JavaScript'
                },
                {
                    title: 'Random Quote Generator',
                    description: 'A web application that fetches and displays random quotes with each refresh, offering a new experience each time.',
                    image: 'https://via.placeholder.com/400x200/6a11cb/ffffff?text=Quote+Generator',
                    demo_url: 'https://vaishnavi-kundekar.github.io/Random-quote-generator/',
                    github_url: 'https://github.com/Vaishnavi-Kundekar/Random-quote-generator',
                    technologies: 'HTML, CSS, JavaScript, API'
                }
                
            ];
            
            defaultProjects.forEach(project => {
                const insertQuery = `
                    INSERT INTO projects (title, description, image, demo_url, github_url, technologies) 
                    VALUES (?, ?, ?, ?, ?, ?)
                `;
                
                db.query(insertQuery, [
                    project.title,
                    project.description,
                    project.image,
                    project.demo_url,
                    project.github_url,
                    project.technologies
                ], (err) => {
                    if (err) console.error('Error inserting default project:', err);
                });
            });
            
            console.log('Default projects inserted');
        }
    });
}

// Insert default skills if table is empty
function insertDefaultSkills() {
    const checkQuery = 'SELECT COUNT(*) as count FROM skills';
    
    db.query(checkQuery, (err, results) => {
        if (err) {
            console.error('Error checking skills:', err);
            return;
        }
        
        if (results[0].count === 0) {
            const defaultSkills = [
                // Frontend Skills
                { category: 'Frontend', name: 'HTML5', proficiency: 90, icon: 'fab fa-html5' },
                { category: 'Frontend', name: 'CSS3', proficiency: 85, icon: 'fab fa-css3-alt' },
                { category: 'Frontend', name: 'JavaScript', proficiency: 80, icon: 'fab fa-js' },
                { category: 'Frontend', name: 'React', proficiency: 75, icon: 'fab fa-react' },
                
                // Backend Skills
                { category: 'Backend', name: 'Node.js', proficiency: 85, icon: 'fab fa-node-js' },
                { category: 'Backend', name: 'Express.js', proficiency: 80, icon: 'fas fa-server' },
                { category: 'Backend', name: 'MySQL', proficiency: 78, icon: 'fas fa-database' },
                { category: 'Backend', name: 'MongoDB', proficiency: 70, icon: 'fas fa-leaf' },
                
                // Tools & Others
                { category: 'Tools', name: 'Git', proficiency: 85, icon: 'fab fa-git-alt' },
                { category: 'Tools', name: 'GitHub', proficiency: 85, icon: 'fab fa-github' },
                { category: 'Tools', name: 'Responsive Design', proficiency: 90, icon: 'fas fa-mobile-alt' },
                { category: 'Tools', name: 'Version Control', proficiency: 88, icon: 'fas fa-code-branch' }
            ];
            
            defaultSkills.forEach(skill => {
                const insertQuery = `
                    INSERT INTO skills (category, name, proficiency, icon) 
                    VALUES (?, ?, ?, ?)
                `;
                
                db.query(insertQuery, [
                    skill.category,
                    skill.name,
                    skill.proficiency,
                    skill.icon
                ], (err) => {
                    if (err) console.error('Error inserting default skill:', err);
                });
            });
            
            console.log('Default skills inserted');
        }
    });
}

// Email configuration
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Routes

// Serve main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API Routes

// Get all projects
app.get('/api/projects', (req, res) => {
    const query = 'SELECT * FROM projects ORDER BY created_at DESC';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.json(results);
    });
});

// Get single project
app.get('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM projects WHERE id = ?';
    
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        res.json(results[0]);
    });
});

// Add new project
app.post('/api/projects', (req, res) => {
    const { title, description, image, demo_url, github_url, technologies } = req.body;
    
    // Validation
    if (!title || !description || !technologies) {
        return res.status(400).json({ 
            message: 'Title, description, and technologies are required' 
        });
    }
    
    const query = `
        INSERT INTO projects (title, description, image, demo_url, github_url, technologies) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.query(query, [title, description, image, demo_url, github_url, technologies], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        
        res.status(201).json({ 
            message: 'Project added successfully', 
            projectId: result.insertId 
        });
    });
});

// Update project
app.put('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, image, demo_url, github_url, technologies } = req.body;
    
    const query = `
        UPDATE projects 
        SET title = ?, description = ?, image = ?, demo_url = ?, github_url = ?, technologies = ?
        WHERE id = ?
    `;
    
    db.query(query, [title, description, image, demo_url, github_url, technologies, id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        res.json({ message: 'Project updated successfully' });
    });
});

// Delete project
app.delete('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM projects WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        res.json({ message: 'Project deleted successfully' });
    });
});

// Get all skills
app.get('/api/skills', (req, res) => {
    const query = 'SELECT * FROM skills ORDER BY category, proficiency DESC';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        
        // Group skills by category
        const groupedSkills = results.reduce((acc, skill) => {
            if (!acc[skill.category]) {
                acc[skill.category] = [];
            }
            acc[skill.category].push(skill);
            return acc;
        }, {});
        
        res.json(groupedSkills);
    });
});

// Contact form submission
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;
    
    // Validation
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ 
            message: 'All fields are required' 
        });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            message: 'Please provide a valid email address' 
        });
    }
    
    try {
        // Save to database
        const query = 'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)';
        
        db.query(query, [name, email, subject, message], async (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Database error', error: err.message });
            }
            
            // Send email notification
            try {
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
                    subject: `Portfolio Contact: ${subject}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #667eea;">New Contact Form Submission</h2>
                            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                                <p><strong>Name:</strong> ${name}</p>
                                <p><strong>Email:</strong> ${email}</p>
                                <p><strong>Subject:</strong> ${subject}</p>
                            </div>
                            <div style="background: white; padding: 20px; border-left: 4px solid #667eea;">
                                <h3>Message:</h3>
                                <p>${message}</p>
                            </div>
                            <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 5px;">
                                <p style="margin: 0; color: #1976d2;"><em>This message was sent from your portfolio contact form.</em></p>
                            </div>
                        </div>
                    `
                };
                
                await transporter.sendMail(mailOptions);
                console.log('Contact email sent successfully');
            } catch (emailError) {
                console.error('Email sending error:', emailError);
            }
            
            res.status(201).json({ 
                message: 'Message sent successfully! Thank you for reaching out.' 
            });
        });
        
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ 
            message: 'An error occurred while sending your message. Please try again.' 
        });
    }
});

// Get all contacts (admin)
app.get('/api/contacts', (req, res) => {
    const query = 'SELECT * FROM contacts ORDER BY created_at DESC';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.json(results);
    });
});

// Update contact status
app.put('/api/contacts/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['unread', 'read', 'replied'].includes(status)) {
        return res.status(400).json({ 
            message: 'Invalid status. Must be: unread, read, or replied' 
        });
    }
    
    const query = 'UPDATE contacts SET status = ? WHERE id = ?';
    
    db.query(query, [status, id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        
        res.json({ message: 'Contact status updated successfully' });
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: db.state === 'authenticated' ? 'connected' : 'disconnected'
    });
});

// API documentation endpoint
app.get('/api', (req, res) => {
    res.json({
        message: "Vaishnavi's Portfolio API",
        version: "1.0.0",
        endpoints: {
            "GET /api/projects": "Get all projects",
            "POST /api/projects": "Add new project",
            "PUT /api/projects/:id": "Update project",
            "DELETE /api/projects/:id": "Delete project",
            "GET /api/skills": "Get all skills",
            "POST /api/contact": "Submit contact form",
            "GET /api/contacts": "Get all contacts (admin)",
            "PUT /api/contacts/:id": "Update contact status",
            "GET /api/health": "Health check"
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!', 
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' 
    });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ message: 'API endpoint not found' });
});

// Serve static files for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    db.end(() => {
        console.log('Database connection closed.');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    db.end(() => {
        console.log('Database connection closed.');
        process.exit(0);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Portfolio server running on port ${PORT}`);
    console.log(`📱 Access your portfolio at: http://localhost:${PORT}`);
    console.log(`🔧 API documentation at: http://localhost:${PORT}/api`);
});

module.exports = app;