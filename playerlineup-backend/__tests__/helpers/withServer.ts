// __tests__/helpers/withServer.ts
import supertest from 'supertest'; // 👈 1
import type { Server } from '../../src/createServer'; // 👈 2
import createServer from '../../src/createServer'; // 👈 3
import { prisma } from '../../src/data'; // 👈 4
import { hashPassword } from '../../src/core/password'; // 👈 4
import Role from '../../src/core/roles'; // 👈 4

// 👇 1
export default function withServer(setter: (s: supertest.Agent) => void): void {
  let server: Server; // 👈 2

  beforeAll(async () => {
    server = await createServer(); // 👈 3

    // 👇 4
    const passwordHash = await hashPassword('12345678');
    await prisma.user.createMany({
      data: [
        {
          id: 1,
          name: 'Test User',
          email: 'test.user@hogent.be',
          password_hash: passwordHash,
          roles: JSON.stringify([Role.USER]),
        },
        {
          id: 2,
          name: 'Admin User',
          email: 'admin.user@hogent.be',
          password_hash: passwordHash,
          roles: JSON.stringify([Role.ADMIN, Role.USER]),
        },
      ],
    });

    // 👇 5
    setter(supertest(server.getApp().callback()));
  });

  afterAll(async () => {
    // 👇 6
    await prisma.user.deleteMany();
    await prisma.stat.deleteMany();
    await prisma.player.deleteMany();
    await prisma.team.deleteMany();

    // 👇 7
    await server.stop();
  });
}
