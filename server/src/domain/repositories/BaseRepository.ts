export interface QueryOptions {
  limit?: number;
  offset?: number;
}

export interface BaseRepository<T, CreateDTO, UpdateDTO> {
  findById(id: string): Promise<T | null>;
  findAll(options?: QueryOptions): Promise<T[]>;
  create(data: CreateDTO): Promise<T>;
  update(id: string, data: UpdateDTO): Promise<T>;
  delete(id: string): Promise<boolean>;
}
