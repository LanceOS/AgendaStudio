import { DatabaseProvider } from '../provider.js';

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class SessionRepository {
  constructor(private db: DatabaseProvider) {}

  async findByToken(token: string): Promise<Session | null> {
    const rows = await this.db.query<Session>('SELECT * FROM sessions WHERE token = $1', [token]);
    return rows[0] || null;
  }

  async create(session: Omit<Session, 'createdAt' | 'updatedAt'>): Promise<Session> {
    const rows = await this.db.query<Session>(
      `INSERT INTO sessions (id, "userId", token, "expiresAt", "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *`,
      [session.id, session.userId, session.token, session.expiresAt]
    );
    return rows[0];
  }

  async deleteByToken(token: string): Promise<boolean> {
    const rows = await this.db.query<{ id: string }>(
      'DELETE FROM sessions WHERE token = $1 RETURNING id',
      [token]
    );
    return rows.length > 0;
  }
}
