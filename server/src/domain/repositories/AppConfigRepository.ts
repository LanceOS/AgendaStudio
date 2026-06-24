import { BaseRepository } from './BaseRepository';
import { AppConfig, CreateAppConfigDTO, UpdateAppConfigDTO } from '../entities/AppConfig';

export interface AppConfigRepository extends BaseRepository<AppConfig, CreateAppConfigDTO, UpdateAppConfigDTO> {
  // Domain-specific query methods
  findByKey(key: string): Promise<AppConfig | null>;
}
