import express from 'express';
import pkg from 'pg';
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';

const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Configure middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Set up PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize database tables if they don't exist
async function initDatabase() {
  try {
    // Create projects table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        tags TEXT[] DEFAULT '{}',
        image_url TEXT,
        project_url TEXT,
        github_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create contact_messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Database tables initialized successfully');
    
    // Check if projects table is empty
    const projectsResult = await pool.query('SELECT COUNT(*) FROM projects');
    
    if (parseInt(projectsResult.rows[0].count) === 0) {
      // Insert sample projects
      await pool.query(`
        INSERT INTO projects (title, description, tags, image_url, project_url, github_url)
        VALUES
          ('E-commerce Website', 'A full-featured e-commerce platform with product management, cart functionality, and payment integration.', 
           ARRAY['HTML', 'CSS', 'JavaScript', 'PHP'], 
           'https://via.placeholder.com/300x200?text=E-commerce', 
           'https://example.com/ecommerce', 
           'https://github.com/gaurav-anand/ecommerce'),
          
          ('Portfolio Template', 'Modern and responsive portfolio template for developers and designers.', 
           ARRAY['HTML', 'CSS', 'JavaScript'], 
           'https://via.placeholder.com/300x200?text=Portfolio', 
           'https://example.com/portfolio', 
           'https://github.com/gaurav-anand/portfolio-template'),
          
          ('Weather App', 'Interactive weather application showing current conditions and forecasts.', 
           ARRAY['HTML', 'CSS', 'JavaScript', 'API'], 
           'https://via.placeholder.com/300x200?text=Weather', 
           'https://example.com/weather-app', 
           'https://github.com/gaurav-anand/weather-app'),
           
          ('Task Manager', 'A task management application with drag and drop functionality.', 
           ARRAY['HTML', 'CSS', 'JavaScript'], 
           'https://via.placeholder.com/300x200?text=Tasks', 
           'https://example.com/task-manager', 
           'https://github.com/gaurav-anand/task-manager'),
           
          ('Restaurant Website', 'A responsive website for a restaurant with menu, gallery and reservation system.', 
           ARRAY['HTML', 'CSS', 'JavaScript', 'PHP'], 
           'https://via.placeholder.com/300x200?text=Restaurant', 
           'https://example.com/restaurant', 
           'https://github.com/gaurav-anand/restaurant-website'),
           
          ('UI/UX Design System', 'A comprehensive design system with components and guidelines.', 
           ARRAY['Design', 'UI/UX'], 
           'https://via.placeholder.com/300x200?text=Design', 
           'https://example.com/design-system', 
           'https://github.com/gaurav-anand/design-system')
      `);
      
      console.log('Sample projects inserted successfully');
    }
    
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// API Routes

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
});

// Get project by ID
app.get('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Failed to fetch project' });
  }
});

// Create a new project
app.post('/api/projects', async (req, res) => {
  try {
    const { title, description, tags, imageUrl, projectUrl, githubUrl } = req.body;
    
    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    const result = await pool.query(
      'INSERT INTO projects (title, description, tags, image_url, project_url, github_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, tags || [], imageUrl, projectUrl, githubUrl]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Failed to create project' });
  }
});

// Submit contact form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    const result = await pool.query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, subject, message]
    );
    
    res.status(201).json({ 
      message: 'Message sent successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// Get all contact messages
app.get('/api/contact', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ message: 'Failed to fetch contact messages' });
  }
});

// Serve the index.html for all routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize database and start server
initDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(error => {
    console.error('Failed to initialize application:', error);
  });