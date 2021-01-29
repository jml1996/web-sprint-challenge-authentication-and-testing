const request = require('supertest')
const db = require('../data/dbConfig')
const server = require('./server')

const user1 = { username: 'josh', password: 'lovins'}
const user2 = { username: 'mk', password: 'n' }

test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach(async () => {
  await db('users').truncate()
})

afterAll(async () => {
  await db.destroy()
})


describe('auth', () => {
  describe('[POST] /register', () => {
      it('responds with 201 OK', async () => {
        const res = await request(server).post('/api/auth/register').send(user1)
        expect(res.status).toBe(201)
      })
      it('changes password for response (hashing)', async () => {
        const res = await request(server).post('/api/auth/register').send(user1)
        expect(res.body.password).not.toBe(user1.password)
      })
      it('user registery is correct length after post', async () => {
        await request(server).post('/api/auth/register').send(user1)
        const dbLength = await db('users').select("id", "username")
        expect(dbLength.length).toBe(1)
      })
  })
  describe('[POST] /login', () => {
    it('responds with 200 OK (register and login work together', async () => {
      await request(server).post('/api/auth/register').send(user1)
      const res = await request(server).post('/api/auth/login').send(user1)
      expect(res.status).toBe(200)
    })
    it('responds with token', async () => {
      await request(server).post('/api/auth/register').send(user1)
      const res = await request(server).post('/api/auth/login').send(user1)
      expect(res.body.token).toBeDefined()
    })
  })
})

describe('/jokes', () => {
  describe('[GET] /jokes', () => {
      it('rejection without authorization header', async () => {
        const res = await request(server).get('/api/jokes')
        expect(res.body).toBe("token required")
      })
      it('success (200) if token', async () => {
        await request(server).post('/api/auth/register').send(user1)
        const tokenResponse = await request(server).post('/api/auth/login').send(user1)
        const res = await request(server)
          .get('/api/jokes')
          .set('Authorization', tokenResponse.body.token)
        expect(res.status).toBe(200)
      })
  })
})