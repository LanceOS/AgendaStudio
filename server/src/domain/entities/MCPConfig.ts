export interface MCPConfig {
  id: string;
  name: string;
  command: string;
  args: string[];
  env: Record<string, string>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateMCPConfigDTO = Omit<MCPConfig, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateMCPConfigDTO = Partial<CreateMCPConfigDTO>;
