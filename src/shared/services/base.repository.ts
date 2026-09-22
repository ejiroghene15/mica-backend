// src/common/repositories/base.repository.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class BaseRepository {
  constructor(protected readonly delegate: any) {}

  /**
   * Find records matching the given filter.
   */
  async find(args: {
    where?: any;
    orderBy?: any;
    take?: number;
    skip?: number;
  } = {}): Promise<any[]> {
    return this.delegate.findMany(args);
  }

  /**
   * Find one record matching the filter (first match).
   */
  async findOne(where: any): Promise<any | null> {
    return this.delegate.findFirst({ where });
  }

  /**
   * Find a record by its unique identifier.
   */
  async findById(id: string): Promise<any | null> {
    return this.delegate.findUnique({ where: { id } });
  }

  /**
   * Create a new record.
   */
  async create(data: any): Promise<any> {
    return this.delegate.create({ data });
  }

  /**
   * Create multiple records at once.
   */
  async createMany(data: any[]): Promise<{ count: number }> {
    return this.delegate.createMany({ data });
  }

  /**
   * Update a record by its unique identifier.
   */
  async updateById(id: string, data: any): Promise<any> {
    return this.delegate.update({ where: { id }, data });
  }

  /**
   * Update multiple records matching the filter.
   */
  async updateMany(where: any, data: any): Promise<{ count: number }> {
    return this.delegate.updateMany({ where, data });
  }

  /**
   * Delete a record by its unique identifier.
   */
  async deleteById(id: string): Promise<any> {
    return this.delegate.delete({ where: { id } });
  }

  /**
   * Delete multiple records matching the filter.
   */
  async deleteMany(where: any = {}): Promise<{ count: number }> {
    return this.delegate.deleteMany({ where });
  }

  /**
   * Count records matching the filter.
   */
  async count(where: any = {}): Promise<number> {
    return this.delegate.count({ where });
  }

  /**
   * Check if a record exists matching the filter.
   */
  async exists(where: any): Promise<boolean> {
    const count = await this.delegate.count({ where });
    return count > 0;
  }
}