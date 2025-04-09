import * as request from 'supertest';
require('dotenv').config();

const logsURL = 'http://localhost:3004/api/logs-management';
const playerServiceURL = 'http://localhost:3001/api/players-management';
const INTERNAL_API_TOKEN = process.env.INTERNAL_API_TOKEN

describe('Logs Management Service', () => {
  jest.setTimeout(1000 * 60 * 20);

  let playerId: string;
  let username: string;

  beforeAll(async () => {
    await request(logsURL).delete('').set('Authorization', `Bearer ${INTERNAL_API_TOKEN}`);

    username = `log_tester_${new Date().getTime()}`
    const res = await request(playerServiceURL)
      .post('/players')
      .send({
        username,
        email: 'log_tester@example.com',
      });

    playerId = res.body._id;
  });

  afterAll(async () => {
  });

  it('should accept and eventually persist a log', async () => {
    const logData = {
      playerId,
      logData: 'Player completed tutorial',
      severity: 'low',
    };

    const postRes = await request(logsURL).post('/logs').send(logData);
    expect(postRes.status).toBe(201);

    await new Promise((r) => setTimeout(r, 3000));

    const res = await request(logsURL).get(`/get-logs-by-player-id/${playerId}`)
    .set('Authorization', `Bearer ${INTERNAL_API_TOKEN}`);

    

    expect(res.body[0].logData).toBe('Player completed tutorial');
  });

  it('should reject a request with missing logData', async () => {
    const res = await request(logsURL).post('/logs').send({
      playerId,
    });

    expect(res.status).toBe(400);
  });

  it('should queue and eventually process logs if rate limited', async () => {
    const logs = Array.from({ length: 20 }).map((_, i) => ({
      playerId,
      logData: `Log entry ${i}`,
      severity: 'low',
    }));

    for (const log of logs) {
      await request(logsURL).post('/logs').send(log);
    }

    await new Promise((r) => setTimeout(r, 10000));
    const res = await request(logsURL).get(`/get-logs-by-player-id/${playerId}`).set('Authorization', `Bearer ${INTERNAL_API_TOKEN}`);
    expect(res.body.length).toEqual(21); 
  });
});
