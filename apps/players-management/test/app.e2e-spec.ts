import * as request from 'supertest';
require('dotenv').config();


const baseURL = 'http://localhost:3001/api/players-management';
const INTERNAL_API_TOKEN = process.env.INTERNAL_API_TOKEN

describe('Player Management Service', () => {
  let createdPlayerId: string;
  let username: string;
  beforeAll(async () => {
    await request(baseURL).delete('/players').set('Authorization', `Bearer ${INTERNAL_API_TOKEN}`);

  });
  it('should create a new player', async () => {
    username = `player_tester_${new Date().getTime()}`
    const res = await request(baseURL)
      .post('/players')
      .send({
        username,
        email: 'testuser@example.com',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.username).toBe(username);
    createdPlayerId = res.body._id;
  });

  it('should not allow duplicate usernames', async () => {
    const res = await request(baseURL)
      .post('/players')
      .send({
        username,
        email: 'duplicate@example.com',
      });

    expect(res.status).toBe(409);
  });

  it('should retrieve a player by ID', async () => {
    const res = await request(baseURL).get(`/players/${createdPlayerId}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(createdPlayerId);
  });

  it('should return 404 for nonexistent playerId', async () => {
    const res = await request(baseURL).get('/players/65abcdefabcdefabcdef12ef');
    expect(res.status).toBe(404);
  });

  it('should delete a player by ID', async () => {
    const res = await request(baseURL).delete(`/players/${createdPlayerId}`);
    expect(res.status).toBe(204);
  });
});
