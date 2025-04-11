import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema, insertProjectSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  // API routes for projects
  app.get('/api/projects', async (req: Request, res: Response) => {
    try {
      const projects = await storage.getProjects();
      res.status(200).json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });

  app.get('/api/projects/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid project ID' });
      }
      
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      res.status(200).json(project);
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({ error: 'Failed to fetch project' });
    }
  });

  app.post('/api/projects', async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validatedData = insertProjectSchema.parse(req.body);
      
      // Create project
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid project data', details: error.errors });
      }
      console.error('Error creating project:', error);
      res.status(500).json({ error: 'Failed to create project' });
    }
  });

  // API routes for contact messages
  app.post('/api/contact', async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validatedData = insertContactMessageSchema.parse(req.body);
      
      // Create contact message
      const message = await storage.createContactMessage(validatedData);
      res.status(201).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid message data', details: error.errors });
      }
      console.error('Error creating contact message:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  });

  app.get('/api/contact', async (req: Request, res: Response) => {
    try {
      const messages = await storage.getContactMessages();
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
