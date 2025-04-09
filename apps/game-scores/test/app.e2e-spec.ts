import * as request from 'supertest';
require('dotenv').config();

const baseURL = 'http://localhost:3002/api/game-scores';
const playerServiceURL = 'http://localhost:3001/api/players-management';
const INTERNAL_API_TOKEN = process.env.INTERNAL_API_TOKEN

describe('Game Scores Service', () => {
  let playerId: string;
  let username: string;

  beforeAll(async () => {
    await request(baseURL).delete('/scores').set('Authorization', `Bearer ${INTERNAL_API_TOKEN}`);
    username = `score_tester_${new Date().getTime()}`
    const res = await request(playerServiceURL)
      .post('/players')
      .send({
        username,
        email: 'score_tester@example.com',
      });

    playerId = res.body._id;
  });

  it('should submit a valid score', async () => {
    const res = await request(baseURL)
      .post('/scores')
      .send({
        playerId,
        score: 1200,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.playerId).toBe(playerId);
    expect(res.body.score).toBe(1200);
  });

  it('should reject a submission with invalid playerId', async () => {
    const res = await request(baseURL)
      .post('/scores')
      .send({
        playerId: '65abcdefabcdefabcdef12ef', 
        score: 500,
      });

    expect(res.status).toBe(404);
  });

  it('should reject missing score field', async () => {
    const res = await request(baseURL)
      .post('/scores')
      .send({
        playerId,
      });

    expect(res.status).toBe(400);
  });
});
