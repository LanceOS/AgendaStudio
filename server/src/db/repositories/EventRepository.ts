import { DatabaseProvider } from '../provider.js';

export interface Event {
  id: number;
  title: string;
  start: string;
  end: string;
}

export class EventRepository {
  constructor(private db: DatabaseProvider) {}

  async findAll(start?: string, end?: string): Promise<Event[]> {
    if (start && end) {
      return this.db.query<Event>(
        'SELECT * FROM events WHERE start >= $1 AND "end" <= $2',
        [start, end]
      );
    }
    return this.db.query<Event>('SELECT * FROM events');
  }

  async create(title: string, start: string, end: string): Promise<Event> {
    const rows = await this.db.query<Event>(
      'INSERT INTO events (title, start, "end") VALUES ($1, $2, $3) RETURNING *',
      [title, start, end]
    );
    return rows[0];
  }

  async delete(id: number | string): Promise<boolean> {
    const rows = await this.db.query<{ id: number }>(
      'DELETE FROM events WHERE id = $1 RETURNING id',
      [id]
    );
    return rows.length > 0;
  }
}
