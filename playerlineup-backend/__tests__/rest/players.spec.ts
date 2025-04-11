import type supertest from 'supertest';
import { prisma } from '../../src/data';
import withServer from '../helpers/withServer';
import { login } from '../helpers/login';
import testAuthHeader from '../helpers/testAuthHeader';

const data = {
  players: [
    {
      id: 1,
      user_id: 1,
      name: 'Test player 1',
      position: 'Point Guard',
    },
    {
      id: 2,
      user_id: 1,
      name: 'Test player 2',
      position: 'Shooting Guard',
    },
    {
      id: 3,
      user_id: 1,
      name: 'Test player 3',
      position: 'Small Forward',
    },
  ],
  stats: [
    {
      id: 1,
      player_id: 1,
      points: 55,
      rebounds: 44,
      assists: 33,
      steals: 22,
      turnovers: 11,
    },
    {
      id: 2,
      player_id: 1,
      points: 10,
      rebounds: 3,
      assists: 2,
      steals: 1,
      turnovers: 5,
    },
    {
      id: 3,
      player_id: 2,
      points: 15,
      rebounds: 2,
      assists: 1,
      steals: 0,
      turnovers: 4,
    },
  ],
  teams: [
    {
      id: 1,
      name: 'Test team',
      user_id: 1,
    },
  ],
};

const dataToDelete = {
  players: [1, 2, 3],
  stats: [1, 2, 3],
  teams: [1],
};

describe('Players', () => {
  let authHeader: string;
  let request: supertest.Agent;

  withServer((r) => {
    request = r;
  });

  beforeAll(async () => {
    authHeader = await login(request);
  });

  const url = '/api/players';

  //test get players
  describe('GET /api/players', () => {

    beforeAll(async () => {
      await prisma.player.createMany({data: data.players});
    });

    afterAll(async () => {
      await prisma.player.deleteMany({where: {id: {in: dataToDelete.players}}});
    });

    it('should 200 and return all players', async () => {
      const response = await request.get(url)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body.items.length).toBe(3);

      expect(response.body.items).toEqual(
        expect.arrayContaining([
          {
            id: 2,
            name: 'Test player 2',
            position: 'Shooting Guard',
            user_id: 1,
          },
          {
            id: 3,
            name: 'Test player 3',
            position: 'Small Forward',
            user_id: 1,
          },
        ]),
      );
    });

    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });

    testAuthHeader(() => request.get(url));
  });

  //test get 1 player with stats
  describe('GET /api/players/:id', () => {

    beforeAll(async () => {
      await prisma.player.createMany({data: data.players});
    });

    afterAll(async () => {
      await prisma.player.deleteMany({where: {id: {in: dataToDelete.players}}});
    });

    it('should 200 and return the requested player', async () => {
      const response = await request.get(`${url}/1`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        {
          id: 1,
          name: 'Test player 1',
          position: 'Point Guard',
          stats: [],
          user_id: 1,
        },
      );
    });

    it('should 404 when requesting non existing player', async () => {
      const response = await request.get(`${url}/200`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No player with this id exists',
      });

      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid player id', async () => {
      const response = await request.get(`${url}/invalid`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    testAuthHeader(() => request.get(url));
  });

  // test add a player
  describe('POST /api/players', () => {

    const playersToDelete: number[] = [];
  
    afterAll(async () => {
      await prisma.player.deleteMany({where: {id: {in: playersToDelete}}});
    });
  
    it('should 201 and return created player', async () => {
      const response = await request.post(url)
        .send({
          name: 'Test player 4',
          position: 'Power Forward',
        }).set('Authorization', authHeader);

      expect(response.statusCode).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.name).toBe('Test player 4');
      expect(response.body.position).toBe('Power Forward');

      playersToDelete.push(response.body.id);
    });

    it('should 400 when missing name', async () => {
      const response = await request.post(url)
        .send({ position: 'Center' })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('name');
    });

    it('should 400 when missing position', async () => {
      const response = await request.post(url)
        .send({ name: 'Test player 5' })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('position');
    });

    it('should 400 when giving a number instead of string', async () => {
      const response = await request.post(url)
        .send({ name: 5, position: 5 })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('name');
      expect(response.body.details.body).toHaveProperty('position');
    });

    it('should 400 when giving an extra string', async () => {
      const response = await request.post(url)
        .send({ name: 'Test player 6', position: 'Center', extra: 'extra' })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('extra');
    });

    it('should 400 when giving an invalid position', async () => {
      const response = await request.post(url)
        .send({ name: 'Test player 7', position: 'Point Forward' })
        .set('Authorization', authHeader);
        
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('position');
    });

    testAuthHeader(() => request.post(url));
  });

  // test update a player
  describe('PUT /api/players/:id', () => {

    beforeAll(async () => {
      await prisma.player.createMany({ data: data.players });
    });

    afterAll(async () => {
      await prisma.player.deleteMany({ where: { id: { in: dataToDelete.players } } });
    });

    it('should 200 and return updated player', async () => {
      const response = await request.put(`${url}/1`)
        .send({ 
          name: 'Updated player 1',
          position: 'Shooting Guard',
        }).set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body) .toEqual(
        {
          id: 1,
          name: 'Updated player 1',
          position: 'Shooting Guard',
          user_id: 1,
        },
      );
    });

    it('should 200 and return updated player with name unchanged', async () => {
      const response = await request.put(`${url}/1`)
        .send({ position: 'Center' })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        {
          id: 1,
          name: 'Updated player 1',
          position: 'Center',
          user_id: 1,
        },
      );
    });

    it('should 400 with invalid player id', async () => {
      const response = await request.put(`${url}/invalid`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    it('should 404 when updating non existing player', async () => {
      const response = await request.put(`${url}/200`)
        .send({ name: 'Player 666' })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No player with this id exists',
      });
    });

    it('should 400 when giving a number instead of string', async () => {
      const response = await request.put(`${url}/1`)
        .send({ name: 'Player is good', position: 5 })
        .set('Authorization', authHeader);
  
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('position');
    });
  
    it('should 400 when giving an extra string', async () => {
      const response = await request.put(`${url}/1`)
        .send({ name: 'Test player 6', position: 'Center', extra: 'extra' })
        .set('Authorization', authHeader);
  
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('extra');
    });

    it('should 400 when giving an invalid position', async () => {
      const response = await request.put(`${url}/1`)
        .send({ name: 'Test player 7', position: 'Denter' })
        .set('Authorization', authHeader);
        
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('position');
    });

    testAuthHeader(() => request.put(`${url}/1`));
  });

  // test delete a player
  describe('DELETE /api/players/:id', () => {

    beforeAll(async () => {
      await prisma.player.create({ data: data.players[0]! });
    });

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/1`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 400 when giving a body', async () => {
      const response = await request.delete(`${url}/1`)
        .send({ name: 'Test Player 1' })
        .set('Authorization', authHeader);
  
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('name');
    });

    it('should 404 with not existing player', async () => {
      const response = await request.delete(`${url}/200`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No player with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid player id', async () => {
      const response = await request.delete(`${url}/invalid`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    testAuthHeader(() => request.delete(`${url}/1`));
  });

  // test get 1 stat from player
  describe('GET /api/players/:id/stats/:statId', () => {
      
    beforeAll(async () => {
      await prisma.player.createMany({ data: data.players });
      await prisma.stat.createMany({ data: data.stats });
    });
  
    afterAll(async () => {
      await prisma.stat.deleteMany({ where: { id: { in: dataToDelete.stats } } });
      await prisma.player.deleteMany({ where: { id: { in: dataToDelete.players } } });
    });
  
    it('should 200 and return the requested stat', async () => {
      const response = await request.get(`${url}/1/stats/1`)
        .set('Authorization', authHeader);
  
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        {
          id: 1,
          player_id: 1,
          points: 55,
          rebounds: 44,
          assists: 33,
          steals: 22,
          turnovers: 11,
        },
      );
    });
  
    it('should 404 when requesting non existing player', async () => {
      const response = await request.get(`${url}/200/stats/1`).set('Authorization', authHeader);
  
      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No player with this id exists',
      });
  
      expect(response.body.stack).toBeTruthy();
    });
  
    it('should 404 when requesting non existing stat', async () => {
      const response = await request.get(`${url}/1/stats/200`).set('Authorization', authHeader);
  
      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No stat with this id exists',
      });
  
      expect(response.body.stack).toBeTruthy();
    });
  
    it('should 400 with invalid player id', async () => {
      const response = await request.get(`${url}/invalid/stats/1`).set('Authorization', authHeader);
  
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('playerId');
    });
  
    it('should 400 with invalid stat id', async () => {
      const response = await request.get(`${url}/1/stats/invalid`).set('Authorization', authHeader);
  
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
  });

  // test add stats to player
  describe('POST /api/players/:id/stats', () => {

    const statsToDelete: number[] = [];

    beforeAll(async () => {
      await prisma.player.createMany({ data: data.players });
    });

    afterAll(async () => {
      await prisma.stat.deleteMany({ where: { id: { in: statsToDelete } } });
      await prisma.player.deleteMany({ where: { id: { in: dataToDelete.players } } });
    });

    it('should 201 and return created stats', async () => {
      const response = await request.post(`${url}/1/stats`)
        .send({
          points: 10,
          rebounds: 5,
          assists: 3,
          steals: 2,
          turnovers: 4,
        }).set('Authorization', authHeader);

      expect(response.statusCode).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.points).toBe(10);
      expect(response.body.rebounds).toBe(5);
      expect(response.body.assists).toBe(3);
      expect(response.body.steals).toBe(2);
      expect(response.body.turnovers).toBe(4);

      statsToDelete.push(response.body.id);

    });

    it('should 201 and return created stats when giving a string instead of number', async () => {
      const response = await request.post(`${url}/1/stats`)
        .send({
          points: '25',
          rebounds: 5,
          assists: 3,
          steals: '2',
          turnovers: 4,
        }).set('Authorization', authHeader);

      expect(response.statusCode).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.points).toBe(25);
      expect(response.body.rebounds).toBe(5);
      expect(response.body.assists).toBe(3);
      expect(response.body.steals).toBe(2);
      expect(response.body.turnovers).toBe(4);
  
      statsToDelete.push(response.body.id);
    });

    it('should 400 when missing points', async () => {
      const response = await request.post(`${url}/1/stats`)
        .send({
          rebounds: 5,
          assists: 3,
          steals: 2,
          turnovers: 4,
        }).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('points');
    });

    it('should 400 when missing rebounds', async () => {
      const response = await request.post(`${url}/1/stats`)
        .send({
          points: 25,
          assists: 3,
          steals: 2,
          turnovers: 4,
        }).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('rebounds');
    });

    it('should 400 when missing assists', async () => {
      const response = await request.post(`${url}/1/stats`)
        .send({
          points: 33,
          rebounds: 5,
          steals: 2,
          turnovers: 4,
        }).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('assists');
    });

    it('should 400 when missing steals', async () => {
      const response = await request.post(`${url}/1/stats`)
        .send({
          points: 22,
          rebounds: 5,
          assists: 3,
          turnovers: 4,
        }).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('steals');
    });

    it('should 400 when missing turnovers', async () => {
      const response = await request.post(`${url}/1/stats`)
        .send({
          points: 24,
          rebounds: 5,
          assists: 3,
          steals: 2,
        }).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('turnovers');
    });

    it('should 400 when giving an extra number', async () => {
      const response = await request.post(`${url}/1/stats`)
        .send({
          points: 25,
          rebounds: 5,
          assists: 3,
          steals: 2,
          turnovers: 4,
          extra: 5,
        }).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('extra');
    });

    testAuthHeader(() => request.post(`${url}/1/stats`));
  });

  // test update stats from player
  describe('PUT /api/players/:id/stats/:statId', () => {
    
    beforeAll(async () => {
      await prisma.player.createMany({ data: data.players });
      await prisma.stat.createMany({ data: data.stats });
    });

    afterAll(async () => {
      await prisma.stat.deleteMany({ where: { id: { in: dataToDelete.stats } } });
      await prisma.player.deleteMany({ where: { id: { in: dataToDelete.players } } });
    });

    it('should 200 and return updated stats', async () => {
      const response = await request.put(`${url}/1/stats/1`)
        .send({
          points: 5,
          rebounds: 4,
          assists: 3,
          steals: 2,
          turnovers: 1,
        }).set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        {
          id: 1,
          player_id: 1,
          points: 5,
          rebounds: 4,
          assists: 3,
          steals: 2,
          turnovers: 1,
        },
      );
    });

    it('should 200 and return updated stats with some unchanged', async () => {
      const response = await request.put(`${url}/1/stats/1`)
        .send({
          points: 15,
          assists: 12,
          turnovers: 35,
        }).set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        {
          id: 1,
          player_id: 1,
          points: 15,
          rebounds: 4,
          assists: 12,
          steals: 2,
          turnovers: 35,
        },
      );
    });

    it('should 404 when updating non existing player', async () => {
      const response = await request.put(`${url}/200/stats/1`)
        .send({
          points: 5,
          rebounds: 4,
          assists: 3,
          steals: 2,
          turnovers: 1,
        }).set('Authorization', authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No player with this id exists',
      });

      expect(response.body.stack).toBeTruthy();
    });

    it('should 404 when updating non existing stats', async () => {
      const response = await request.put(`${url}/1/stats/200`)
        .send({
          points: 5,
          rebounds: 4,
          assists: 3,
          steals: 2,
          turnovers: 1,
        }).set('Authorization', authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No stat with this id exists',
      });

      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid stat id', async () => {
      const response = await request.put(`${url}/1/stats/invalid`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    it('should 400 when giving an extra number', async () => {
      const response = await request.put(`${url}/1/stats/1`)
        .send({
          points: 55,
          extra: 55,
        }).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('extra');
    });

    testAuthHeader(() => request.put(`${url}/1/stats/1`));
  });

  // test delete stats from player
  describe('DELETE /api/players/:id/stats/:statId', () => {

    beforeAll(async () => {
      await prisma.player.create({ data: data.players[0]! });
      await prisma.stat.create({ data: data.stats[0]! });
    });

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/1/stats/1`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 404 with not existing stat', async () => {
      const response = await request.delete(`${url}/1/stats/200`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No stat with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid stat id', async () => {
      const response = await request.delete(`${url}/1/stats/invalid`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    it('should 400 when giving a body', async () => {
      const response = await request.delete(`${url}/1/stats/1`)
        .send({ points: 55 })
        .set('Authorization', authHeader);
  
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('points');
    });

    testAuthHeader(() => request.delete(`${url}/1/stats/1`));
  });
});
