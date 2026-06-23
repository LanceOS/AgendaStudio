import { Db } from '../../db.js';
import { sessions } from '../schema.js';
import { eq } from 'drizzle-orm';

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class SessionRepository {
  constructor(private db: Db) {}

  async findByToken(token: string): Promise<Session | null> {
    const [session] = await this.db.select().from(sessions).where(eq(sessions.token, token));
    return session || null;
  }

  async create(session: Omit<Session, 'createdAt' | 'updatedAt'>): Promise<Session> {
    const [newSession] = await this.db.insert(sessions).values({
      id: session.id,
      userId: session.userId,
      token: session.token,
      expiresAt: session.expiresAt,
    }).returning();
    return newSession;
  }

  async deleteByToken(token: string): Promise<boolean> {
    const [deleted] = await this.db.delete(sessions).where(eq(sessions.token, token)).returning({ id: sessions.id });
    return !!deleted;
  }
}
