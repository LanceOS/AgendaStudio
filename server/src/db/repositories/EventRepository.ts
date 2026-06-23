import { Db } from '../../db.js';
import { events } from '../schema.js';
import { eq, gte, lte, and } from 'drizzle-orm';

export interface Event {
  id: number;
  title: string;
  start: string;
  end: string;
}

export class EventRepository {
  constructor(private db: Db) {}

  async findAll(start?: string, end?: string): Promise<Event[]> {
    if (start && end) {
      return this.db.select().from(events).where(
        and(gte(events.start, start), lte(events.end, end))
      );
    }
    return this.db.select().from(events);
  }

  async create(title: string, start: string, end: string): Promise<Event> {
    const [event] = await this.db.insert(events).values({ title, start, end }).returning();
    return event;
  }

  async delete(id: number | string): Promise<boolean> {
    const [deleted] = await this.db.delete(events).where(eq(events.id, Number(id))).returning({ id: events.id });
    return !!deleted;
  }
}
