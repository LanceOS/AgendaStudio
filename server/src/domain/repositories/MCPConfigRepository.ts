import { BaseRepository } from './BaseRepository';
import { MCPConfig, CreateMCPConfigDTO, UpdateMCPConfigDTO } from '../entities/MCPConfig';

export interface MCPConfigRepository extends BaseRepository<MCPConfig, CreateMCPConfigDTO, UpdateMCPConfigDTO> {
  // Domain-specific query methods
  findActiveConfigs(): Promise<MCPConfig[]>;
  findByName(name: string): Promise<MCPConfig | null>;
}
