export type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>
  | null;

export interface AppConfig<T = JSONValue> {
  id: string;
  key: string;
  value: T;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateAppConfigDTO<T = JSONValue> = Omit<AppConfig<T>, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateAppConfigDTO<T = JSONValue> = Partial<CreateAppConfigDTO<T>>;
