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
      name: 'Test team 1',
      user_id: 1,
    },
    {
      id: 2,
      name: 'Test team 2',
      user_id: 1,
    },
    {
      id: 3,
      name: 'Test team 3',
      user_id: 1,
    },
  ],
};

const dataToDelete = {
  players: [1, 2, 3],
  stats: [1, 2, 3],
  teams: [1, 2, 3],
};

describe('Teams', () => {
  let authHeader: string;
  let request: supertest.Agent;

  withServer((r) => {
    request = r;
  });

  beforeAll(async () => {
    authHeader = await login(request);
  });

  const url = '/api/teams';

  // test get teams
  describe('GET /api/teams', () => {

    beforeAll(async () => {
      await prisma.team.createMany({data: data.teams});
    });

    afterAll(async () => {
      await prisma.team.deleteMany({where: {id: {in: dataToDelete.teams}}});
    });

    it('should 200 and return all teams', async () => {
      const response = await request.get(url)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body.items.length).toBe(3);

      expect(response.body.items).toEqual(
        expect.arrayContaining([
          {
            id: 2,
            name: 'Test team 2',
            user_id: 1,
            players: [],
          },
          {
            id: 3,
            name: 'Test team 3',
            user_id: 1,
            players: [],
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

    it('should 400 when given a body', async () => {
      const response = await request.get(url)
        .set('Authorization', authHeader)
        .send({iets: 'fout'});

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('iets');
    });

    testAuthHeader(() => request.get(url));
  });

  //test get 1 team
  describe('GET /api/teams/:id', () => {

    beforeAll(async () => {
      await prisma.team.createMany({data: data.teams});
    });

    afterAll(async () => {
      await prisma.team.deleteMany({where: {id: {in: dataToDelete.teams}}});
    });

    it('should 200 and return the requested team', async () => {
      const response = await request.get(`${url}/1`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        {
          id: 1,
          name: 'Test team 1',
          user_id: 1,
          players: [],
        },
      );
    });

    it('should 404 when requesting non existing team', async () => {
      const response = await request.get(`${url}/200`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No team with this id exists',
      });

      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid player id', async () => {
      const response = await request.get(`${url}/invalid`).set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    it('should 400 when given a body', async () => {
      const response = await request.get(`${url}/1`)
        .set('Authorization', authHeader)
        .send({iets: 'fout'});

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('iets');
    });

    testAuthHeader(() => request.get(url));
  });

  // test add a team
  describe('POST /api/teams', () => {

    const teamsToDelete: number[] = [];
  
    afterAll(async () => {
      await prisma.team.deleteMany({where: {id: {in: teamsToDelete}}});
    });
  
    it('should 201 and return created team', async () => {
      const response = await request.post(url)
        .send({
          name: 'Winners',
        }).set('Authorization', authHeader);

      expect(response.statusCode).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.name).toBe('Winners');

      teamsToDelete.push(response.body.id);
    });

    it('should 400 when missing name', async () => {
      const response = await request.post(url)
        .send({})
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('name');
    });

    it('should 400 when giving a number instead of string', async () => {
      const response = await request.post(url)
        .send({ name: 5})
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('name');
    });

    it('should 400 when giving an extra string', async () => {
      const response = await request.post(url)
        .send({ name: 'Losers', extra: 'extra' })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('extra');
    });

    it('should 400 for duplicate team name', async () => {
      const response = await request.post(url)
        .send({ name: 'Winners' })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        code: 'VALIDATION_FAILED',
        message: 'A team with this name already exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    testAuthHeader(() => request.post(url));
  });

  // test update a team name
  describe('PUT /api/teams/:id', () => {

    beforeAll(async () => {
      await prisma.team.createMany({ data: data.teams });
    });

    afterAll(async () => {
      await prisma.team.deleteMany({ where: { id: { in: dataToDelete.teams } } });
    });

    it('should 201 and return created team', async () => {
      const response = await request.put(`${url}/1`)
        .send({
          name: 'Winners 2',
        }).set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        {
          id: 1,
          name: 'Winners 2',
          user_id: 1,
        },
      );
    });

    it('should 400 when giving bad argument', async () => {
      const response = await request.put(`${url}/invalid`)
        .send({ name: 'Winners 2' })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    it('should 400 when missing name', async () => {
      const response = await request.put(`${url}/1`)
        .send({})
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('name');
    });

    it('should 400 when giving a number instead of string', async () => {
      const response = await request.put(`${url}/1`)
        .send({ name: 666})
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('name');
    });

    it('should 400 when giving an extra string', async () => {
      const response = await request.put(`${url}/1`)
        .send({ name: 'Losers 2', iets: 'fout' })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('iets');
    });

    it('should 400 for duplicate team name', async () => {
      const response = await request.put(`${url}/1`)
        .send({ name: 'Test team 2' })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body).toMatchObject({
        code: 'VALIDATION_FAILED',
        message: 'A team with this name already exists',
      });
      expect(response.body.stack).toBeTruthy();
    });
  });

  //test add player to team
  describe('PUT /api/teams/:id/players', () => {

    beforeAll(async () => {
      await prisma.team.createMany({ data: data.teams });
      await prisma.player.createMany({ data: data.players });
    });

    afterAll(async () => {
      await prisma.player.deleteMany({ where: { id: { in: dataToDelete.players } } });
      await prisma.team.deleteMany({ where: { id: { in: dataToDelete.teams } } });
    });

    it('should 200 and return updated team', async () => {
      const response = await request.put(`${url}/1/players`)
        .send({
          player_id: 1,
        }).set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        {
          id: 1,
          name: 'Test team 1',
          user_id: 1,
          players: [
            {
              id: 1,
              name: 'Test player 1',
              position: 'Point Guard',
              user_id: 1,
            },
          ],
        },
      );
    });

    it('should 200 and return same team when existing player is added', async () => {
      const response = await request.put(`${url}/1/players`)
        .send({
          player_id: 1,
        }).set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        {
          id: 1,
          name: 'Test team 1',
          user_id: 1,
          players: [
            {
              id: 1,
              name: 'Test player 1',
              position: 'Point Guard',
              user_id: 1,
            },
          ],
        },
      );
    });

    it('should 400 when giving bad argument', async () => {
      const response = await request.put(`${url}/invalid/players`)
        .send({ player_id: 1 })
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    it('should 400 when missing player_id', async () => {
      const response = await request.put(`${url}/1/players`)
        .send({})
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('player_id');
    });

    it('should 400 when giving a string instead of a number', async () => {
      const response = await request.put(`${url}/1/players`)
        .send({ player_id: 'invalid'})
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('player_id');
    });

    it('should 400 when giving an extra number', async () => {
      const response = await request.put(`${url}/1/players`)
        .send({player_id: 1, iets: 2})
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
    });
  });

  //test remove a player from a team
  describe('DELETE /api/teams/:id/players/:player_id', () => {
    beforeAll(async () => {
      await prisma.team.createMany({ data: data.teams });
      await prisma.player.createMany({ data: data.players });
    });

    afterAll(async () => {
      await prisma.player.deleteMany({ where: { id: { in: dataToDelete.players } } });
      await prisma.team.deleteMany({ where: { id: { in: dataToDelete.teams } } });
    });

    beforeEach(async () => {
      await prisma.team.update({
        where: { id: 1 },
        data: {
          players: {
            connect: {
              id: 1,
            },
          },
        },
      });
      await prisma.team.update({
        where: { id: 1 },
        data: {
          players: {
            connect: {
              id: 2,
            },
          },
        },
      });
    });

    it('should 200 and return updated team', async () => {
      const response = await request.delete(`${url}/1/players/1`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        {
          id: 1,
          name: 'Test team 1',
          user_id: 1,
          players: [
            {
              id: 2,
              name: 'Test player 2',
              position: 'Shooting Guard',
              user_id: 1,
            },
          ],
        },
      );
    });

    it('should 404 when player is not in team', async () => {
      const response = await request.delete(`${url}/1/players/3`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No player with this id exists in the team',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 404 when team does not exist', async () => {
      const response = await request.delete(`${url}/200/players/1`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No team with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 when giving bad argument', async () => {
      const response = await request.delete(`${url}/invalid/players/1`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    it('should 400 when giving a body', async () => {
      const response = await request.delete(`${url}/1/players/1`)
        .set('Authorization', authHeader)
        .send({player_id: 1});

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('player_id');
    });
  });

  //test delete a team
  describe('DELETE /api/teams/:id', () => {

    beforeAll(async () => {
      await prisma.team.createMany({ data: data.teams });
    });

    it('should 200 and return deleted team', async () => {
      const response = await request.delete(`${url}/1`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 404 when team does not exist', async () => {
      const response = await request.delete(`${url}/200`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No team with this id exists',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 when giving bad argument', async () => {
      const response = await request.delete(`${url}/invalid`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    it('should 400 when giving a body', async () => {
      const response = await request.delete(`${url}/1`)
        .set('Authorization', authHeader)
        .send({iets: 'fout'});

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('iets');
    });
  });
});
