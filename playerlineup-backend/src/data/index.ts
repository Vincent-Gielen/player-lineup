import { PrismaClient } from '@prisma/client';
import { getLogger } from '../core/logging';

// SINGLETON  
export const prisma = new PrismaClient();

export async function initializeData(): Promise<void> {
  getLogger().info('Initializing connection to the database');

  await prisma.$connect();

  getLogger().info('Connection to the database has been established');
}

export async function shutdownData(): Promise<void> {
  getLogger().info('Shutting down connection to the database');

  await prisma.$disconnect();

  getLogger().info('Connection to the database has been terminated');
}
