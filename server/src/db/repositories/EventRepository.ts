import { Db } from '../../db.js';
import { events } from '../schema.js';
import { eq, gte, lte, and } from 'drizzle-orm';

export interface Event {
  id: number;
  userId: string;
  categoryId: number | null;
  title: string;
  description: string | null;
  location: string | null;
  isAllDay: boolean;
  start: string;
  end: string;
}

export interface CreateEventData {
  categoryId?: number | null;
  title: string;
  description?: string | null;
  location?: string | null;
  isAllDay?: boolean;
  start: string;
  end: string;
}

export class EventRepository {
  constructor(private db: Db) {}

  async findAll(userId: string, start?: string, end?: string): Promise<Event[]> {
    if (start && end) {
      return this.db.select().from(events).where(
        and(eq(events.userId, userId), gte(events.start, start), lte(events.end, end))
      );
    }
    return this.db.select().from(events).where(eq(events.userId, userId));
  }

  async create(userId: string, data: CreateEventData): Promise<Event> {
    const [event] = await this.db.insert(events).values({ ...data, userId }).returning();
    return event;
  }

  async delete(userId: string, id: number | string): Promise<boolean> {
    const [deleted] = await this.db.delete(events).where(and(eq(events.id, Number(id)), eq(events.userId, userId))).returning({ id: events.id });
    return !!deleted;
  }
}
