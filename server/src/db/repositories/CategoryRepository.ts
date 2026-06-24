import { eq, and } from 'drizzle-orm';
import { db } from '../db.js';
import { categories } from '../schema.js';

export class CategoryRepository {
  async findAll(userId: string) {
    return await db.select().from(categories).where(eq(categories.userId, userId));
  }

  async findById(id: number, userId: string) {
    const results = await db
      .select()
      .from(categories)
      .where(and(eq(categories.id, id), eq(categories.userId, userId)));
    return results[0] || null;
  }

  async create(userId: string, name: string, color: string) {
    const results = await db.insert(categories).values({
      userId,
      name,
      color,
    }).returning();
    
    return results[0];
  }

  async update(id: number, userId: string, updates: Partial<{ name: string; color: string }>) {
    const results = await db
      .update(categories)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(categories.id, id), eq(categories.userId, userId)))
      .returning();
      
    return results[0] || null;
  }

  async delete(id: number, userId: string) {
    const results = await db
      .delete(categories)
      .where(and(eq(categories.id, id), eq(categories.userId, userId)))
      .returning();
      
    return results.length > 0;
  }
}
