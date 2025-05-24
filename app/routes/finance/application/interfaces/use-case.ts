export interface IUseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}

export interface ISideEffect<TInput> {
  execute(input: TInput): Promise<void>;
}

// Generic repository interface
export interface IRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(entity: T): Promise<T>;
  update(id: string, entity: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}
