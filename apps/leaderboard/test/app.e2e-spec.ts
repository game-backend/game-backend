import * as request from 'supertest';
require('dotenv').config();

const baseURL = 'http://localhost:3003/api/leaderboard';
const scoresURL = 'http://localhost:3002/api/game-scores';
const playersURL = 'http://localhost:3001/api/players-management';
const INTERNAL_API_TOKEN = process.env.INTERNAL_API_TOKEN


describe('Leaderboard Service', () => {
  let username: string;
  let playerId: string;

  beforeAll(async () => {
    await request(playersURL).delete('/players').set('Authorization', `Bearer ${INTERNAL_API_TOKEN}`);
    await request(scoresURL).delete('/scores').set('Authorization', `Bearer ${INTERNAL_API_TOKEN}`);
    await request(baseURL).post('/rebuild-leaderboard').set('Authorization', `Bearer ${INTERNAL_API_TOKEN}`);
    username = `leaderboard_user_${new Date().getTime()}`
    const res = await request(playersURL)
      .post('/players')
      .send({
        username ,
        email: 'leaderboard_user@example.com',
      });
    playerId = res.body._id;

    await request(scoresURL)
      .post('/scores')
      .send({
        playerId,
        score: 500,
      });

    await request(scoresURL)
      .post('/scores')
      .send({
        playerId,
        score: 300,
      });

    await new Promise((r) => setTimeout(r, 2000));
  });


  it('should return a paginated leaderboard with enriched player data', async () => {
    const res = await request(baseURL)
      .get('/players/top?page=1&limit=5')

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('currentPage');
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('hasNextPage');
    expect(res.body).toHaveProperty('limit');
    expect(Array.isArray(res.body.data)).toBe(true);
    const entry = res.body.data.find((e) => e.playerId === playerId);
    expect(entry).toBeDefined();
    expect(entry.score).toBe(800);
    expect(entry.username).toBe(username);
  });

  it('should return empty results for a non-existent page', async () => {
    const res = await request(baseURL)
      .get('/players/top?page=999&limit=5')

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(0);
  });
});
