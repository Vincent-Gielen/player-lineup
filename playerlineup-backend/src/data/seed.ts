// src/data/seed.ts
import { PrismaClient } from '@prisma/client'; // 👈 1
import { hashPassword } from '../core/password';
import Role from '../core/roles';

const prisma = new PrismaClient(); // 👈 1

async function main() {
  // Seed users
  // ==========
  const passwordHash = await hashPassword('12345678');

  await prisma.user.createMany({
    data: [
      {
        id: 1,
        name: 'Bruce Wayne',
        email: 'bruce.wayne@hogent.be',
        password_hash: passwordHash,
        roles: [Role.ADMIN, Role.USER],
      },
      {
        id: 2,
        name: 'Robin',
        email: 'robin@hogent.be',
        password_hash: passwordHash,
        roles: [Role.USER],
      },
      {
        id: 3,
        name: 'Alfred Pennyworth',
        email: 'alfred@hogent.be',
        password_hash: passwordHash,
        roles: [Role.USER],
      },
    ],
  });

  // Seed players
  // ===========
  await prisma.player.createMany({
    data: [
      // Players for user_id: 1
      {
        id: 1,
        name: 'Kobe Bryant',
        position: 'Shooting Guard',
        user_id: 1,
      },
      {
        id: 2,
        name: 'Kevin Durant',
        position: 'Small Forward',
        user_id: 1,
      },
      {
        id: 3,
        name: 'Stephen Curry',
        position: 'Point Guard',
        user_id: 1,
      },
      {
        id: 4,
        name: 'Giannis Antetokounmpo',
        position: 'Power Forward',
        user_id: 1,
      },
      {
        id: 5,
        name: 'Hakeem Olajuwon',
        position: 'Center',
        user_id: 1,
      },
    
      // Players for user_id: 2
      {
        id: 6,
        name: 'Tim Duncan',
        position: 'Power Forward',
        user_id: 2,
      },
      {
        id: 7,
        name: 'Dirk Nowitzki',
        position: 'Power Forward',
        user_id: 2,
      },
      {
        id: 8,
        name: 'Shaquille O\'Neal',
        position: 'Center',
        user_id: 2,
      },
      {
        id: 9,
        name: 'Kawhi Leonard',
        position: 'Small Forward',
        user_id: 2,
      },
      {
        id: 10,
        name: 'Anthony Davis',
        position: 'Power Forward',
        user_id: 2,
      },
    
      // Players for user_id: 3
      {
        id: 11,
        name: 'Michael Jordan',
        position: 'Shooting Guard',
        user_id: 3,
      },
      {
        id: 12,
        name: 'Larry Bird',
        position: 'Small Forward',
        user_id: 3,
      },
      {
        id: 13,
        name: 'Magic Johnson',
        position: 'Point Guard',
        user_id: 3,
      },
      {
        id: 14,
        name: 'Karl Malone',
        position: 'Power Forward',
        user_id: 3,
      },
      {
        id: 15,
        name: 'Wilt Chamberlain',
        position: 'Center',
        user_id: 3,
      },
    ],    
  });

  // Seed teams
  // =================
  await prisma.team.createMany({
    data: [
      // User Thomas
      // ===========
      {
        id: 1,
        name: 'Los Angeles Lakers',
        user_id: 1,
      },
      {
        id: 2,
        name: 'Chicago Bulls',
        user_id: 2,
      },
      {
        id: 3,
        name: 'Golden State Warriors',
        user_id: 3,
      },
    ],
  });

  // Seed stats
  // ==========
  await prisma.stat.createMany({
    data: [
      {
        id: 1,
        points: 30,
        rebounds: 8,
        assists: 5,
        steals: 2,
        turnovers: 3,
        player_id: 1,
      },
      {
        id: 2,
        points: 25,
        rebounds: 10,
        assists: 7,
        steals: 1,
        turnovers: 2,
        player_id: 1,
      },
      {
        id: 3,
        points: 28,
        rebounds: 9,
        assists: 6,
        steals: 3,
        turnovers: 1,
        player_id: 2,
      },
      {
        id: 4,
        points: 32,
        rebounds: 4,
        assists: 8,
        steals: 2,
        turnovers: 4,
        player_id: 2,
      },
      {
        id: 5,
        points: 22,
        rebounds: 11,
        assists: 3,
        steals: 1,
        turnovers: 3,
        player_id: 3,
      },
      {
        id: 6,
        points: 18,
        rebounds: 12,
        assists: 2,
        steals: 2,
        turnovers: 2,
        player_id: 3,
      },
      {
        id: 7,
        points: 27,
        rebounds: 10,
        assists: 5,
        steals: 3,
        turnovers: 1,
        player_id: 4,
      },
      {
        id: 8,
        points: 24,
        rebounds: 7,
        assists: 4,
        steals: 2,
        turnovers: 3,
        player_id: 4,
      },
      {
        id: 9,
        points: 26,
        rebounds: 9,
        assists: 3,
        steals: 1,
        turnovers: 2,
        player_id: 5,
      },
      {
        id: 10,
        points: 29,
        rebounds: 8,
        assists: 6,
        steals: 2,
        turnovers: 3,
        player_id: 5,
      },
      {
        id: 11,
        points: 31,
        rebounds: 7,
        assists: 6,
        steals: 2,
        turnovers: 3,
        player_id: 6,
      },
      {
        id: 12,
        points: 24,
        rebounds: 11,
        assists: 5,
        steals: 1,
        turnovers: 2,
        player_id: 6,
      },
      {
        id: 13,
        points: 29,
        rebounds: 8,
        assists: 7,
        steals: 3,
        turnovers: 1,
        player_id: 7,
      },
      {
        id: 14,
        points: 33,
        rebounds: 5,
        assists: 9,
        steals: 2,
        turnovers: 4,
        player_id: 7,
      },
      {
        id: 15,
        points: 23,
        rebounds: 12,
        assists: 4,
        steals: 1,
        turnovers: 3,
        player_id: 8,
      },
      {
        id: 16,
        points: 19,
        rebounds: 13,
        assists: 3,
        steals: 2,
        turnovers: 2,
        player_id: 8,
      },
      {
        id: 17,
        points: 28,
        rebounds: 11,
        assists: 6,
        steals: 3,
        turnovers: 1,
        player_id: 9,
      },
      {
        id: 18,
        points: 25,
        rebounds: 8,
        assists: 5,
        steals: 2,
        turnovers: 3,
        player_id: 9,
      },
      {
        id: 19,
        points: 27,
        rebounds: 10,
        assists: 4,
        steals: 1,
        turnovers: 2,
        player_id: 10,
      },
      {
        id: 20,
        points: 30,
        rebounds: 9,
        assists: 7,
        steals: 2,
        turnovers: 3,
        player_id: 10,
      },
      {
        id: 21,
        points: 35,
        rebounds: 6,
        assists: 5,
        steals: 2,
        turnovers: 3,
        player_id: 11,
      },
      {
        id: 22,
        points: 28,
        rebounds: 7,
        assists: 6,
        steals: 3,
        turnovers: 2,
        player_id: 11,
      },
      {
        id: 23,
        points: 32,
        rebounds: 8,
        assists: 4,
        steals: 1,
        turnovers: 3,
        player_id: 12,
      },
      {
        id: 24,
        points: 29,
        rebounds: 9,
        assists: 5,
        steals: 2,
        turnovers: 2,
        player_id: 12,
      },
      {
        id: 25,
        points: 27,
        rebounds: 10,
        assists: 7,
        steals: 3,
        turnovers: 1,
        player_id: 13,
      },
      {
        id: 26,
        points: 30,
        rebounds: 6,
        assists: 8,
        steals: 2,
        turnovers: 4,
        player_id: 13,
      },
      {
        id: 27,
        points: 24,
        rebounds: 11,
        assists: 5,
        steals: 1,
        turnovers: 3,
        player_id: 14,
      },
      {
        id: 28,
        points: 26,
        rebounds: 12,
        assists: 4,
        steals: 2,
        turnovers: 2,
        player_id: 14,
      },
      {
        id: 29,
        points: 31,
        rebounds: 7,
        assists: 6,
        steals: 3,
        turnovers: 1,
        player_id: 15,
      },
      {
        id: 30,
        points: 28,
        rebounds: 8,
        assists: 5,
        steals: 2,
        turnovers: 3,
        player_id: 15,
      },
    ],
  });
}

// 👇 3
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
