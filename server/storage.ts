import { 
  users, 
  contactMessages, 
  projects,
  type User, 
  type InsertUser,
  type ContactMessage,
  type InsertContactMessage,
  type Project,
  type InsertProject 
} from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";

// Create database connection
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// Modify the interface with any CRUD methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contact message methods
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  
  // Project methods
  createProject(project: InsertProject): Promise<Project>;
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
}

// Database storage implementation
export class DbStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }
  
  // Contact message methods
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const result = await db.insert(contactMessages).values(message).returning();
    return result[0];
  }
  
  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(contactMessages.createdAt);
  }
  
  // Project methods
  async createProject(project: InsertProject): Promise<Project> {
    const result = await db.insert(projects).values(project).returning();
    return result[0];
  }
  
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(projects.createdAt);
  }
  
  async getProject(id: number): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.id, id));
    return result[0];
  }
}

// Memory storage as fallback or for development
export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private contactMessagesMap: Map<number, ContactMessage>;
  private projectsMap: Map<number, Project>;
  private userCurrentId: number;
  private messageCurrentId: number;
  private projectCurrentId: number;

  constructor() {
    this.usersMap = new Map();
    this.contactMessagesMap = new Map();
    this.projectsMap = new Map();
    this.userCurrentId = 1;
    this.messageCurrentId = 1;
    this.projectCurrentId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.usersMap.set(id, user);
    return user;
  }
  
  // Contact message methods
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const id = this.messageCurrentId++;
    const now = new Date();
    const contactMessage: ContactMessage = { 
      ...message, 
      id, 
      createdAt: now,
      read: "false"
    };
    this.contactMessagesMap.set(id, contactMessage);
    return contactMessage;
  }
  
  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessagesMap.values()).sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );
  }
  
  // Project methods
  async createProject(project: InsertProject): Promise<Project> {
    const id = this.projectCurrentId++;
    const now = new Date();
    // Ensure optional fields are properly defined
    const newProject: Project = { 
      ...project, 
      id, 
      createdAt: now,
      projectUrl: project.projectUrl || null,
      githubUrl: project.githubUrl || null
    };
    this.projectsMap.set(id, newProject);
    return newProject;
  }
  
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projectsMap.values()).sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );
  }
  
  async getProject(id: number): Promise<Project | undefined> {
    return this.projectsMap.get(id);
  }
}

// Use the database storage
export const storage = new DbStorage();
