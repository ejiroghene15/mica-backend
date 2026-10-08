// src/mica-checkin/interfaces/layer.interface.ts
export interface IMicaCheckList{
  userId: string;
  emotion: string;
  intensity: number;
  category?: string;
  note?: string;
  createdAt: Date;
}