export interface PrismaDelegate {
  create: (options: any) => Promise<any>;
  count: (options?: any) => Promise<number>;
  groupBy: (options: any) => Promise<any[]>;
  findUnique: (options: any) => Promise<any>;
  findMany: (options?: any) => Promise<any[]>;
  update: (options: any) => Promise<any>;
  delete: (options: any) => Promise<any>;
}

export abstract class BaseRepository {
  constructor(
    protected readonly delegate: PrismaDelegate,
  ) {}                                                                                       

  create(data: any): Promise<any> {
    return this.delegate.create({ data });
  }

  findUnique(where: any): Promise<any> {
    return this.delegate.findUnique({ where });
  }

  findMany(options?: any): Promise<any[]> {
    return this.delegate.findMany(options);
  }

  update(where: any, data: any): Promise<any> {
    return this.delegate.update({ where, data });
  }

  delete(where: any): Promise<any> {
    return this.delegate.delete({ where });
  }
}