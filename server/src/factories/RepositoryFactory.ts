import { Db } from '../db.js';
import {
  EventRepository,
  UserRepository,
  SessionRepository,
  MCPConfigRepository,
  AppConfigRepository,
} from '../db/repositories/index.js';

export class RepositoryFactory {
  constructor(private readonly db: Db) {}

  createEventRepository(): EventRepository {
    return new EventRepository(this.db);
  }

  createUserRepository(): UserRepository {
    return new UserRepository(this.db);
  }

  createSessionRepository(): SessionRepository {
    return new SessionRepository(this.db);
  }

  createMCPConfigRepository(): MCPConfigRepository {
    return new MCPConfigRepository(this.db);
  }

  createAppConfigRepository(): AppConfigRepository {
    return new AppConfigRepository(this.db);
  }
}
