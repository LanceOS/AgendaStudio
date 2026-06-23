import { DatabaseProvider } from '../provider.js';

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserRepository {
  constructor(private db: DatabaseProvider) {}

  async findById(id: string): Promise<User | null> {
    const rows = await this.db.query<User>('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0] || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const rows = await this.db.query<User>('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0] || null;
  }

  async create(user: Omit<User, 'createdAt' | 'updatedAt'>): Promise<User> {
    const rows = await this.db.query<User>(
      `INSERT INTO users (id, name, email, "emailVerified", image, "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *`,
      [user.id, user.name, user.email, user.emailVerified, user.image]
    );
    return rows[0];
  }
}
