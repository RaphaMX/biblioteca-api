const request = require('supertest');
const {
    app,
    _reset
} = require('../server');

beforeAll(async () => {
    server = app.listen(0);
    await new Promise((res) => {
        server.once("listening", res);
    });
    baseURL = `http://127.0.0.1:${server.address().port}`;
});

afterAll(async () => {
    await new Promise((res) => {
        server.close(res);
    });
});

beforeEach(async () => {
    await _reset();
});

describe('API Livros - CRUD', () => {
    test('POST /books -> 201 cria livro válido', async () => {
        const res = await request(app).post('/books').send({
            title: 'Tao Te Ching',
            author: 'Lao Tzu',
            year: 1868,
            category: 'Filosofia'
        });
        expect(res.status).toBe(201);
        expect(res.body.title).toBe('Tao Te Ching');
    });

    test('POST /books -> 400 inválido (faltando campos)', async () => {
        const res = await request(app).post('/books').send({
            title: '',
            author: 'Rando',
            year: 0
        });
        expect(res.status).toBe(400);
    });

    test('GET /books -> 200 lista itens', async () => {
        await request(app).post('/books').send({
            title: 'Jornada ao Oeste',
            author: 'Wu Cheng\'en',
            year: 1592
        });
        const res = await request(app).get('/books');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
    });

    test('GET /books/find -> 200 encontrado / 404 não encontrado / 400 inválido', async () => {
        await request(app).post('/books').send({
            title: 'A Arte da Guerra',
            author: 'Sun Tzu',
            year: 500
        });
        let r = await request(app).get('/books/find').query({
            title: 'A Arte da Guerra'
        });
        expect(r.status).toBe(200);
        expect(r.body.title).toBe('A Arte da Guerra');

        r = await request(app).get('/books/find').query({
            title: 'nonexistent'
        });
        expect(r.status).toBe(404);

        r = await request(app).get('/books/find');
        expect(r.status).toBe(400);
    });

    test('PUT /books -> 200 atualiza; 400 patch vazio; 404 não encontrado', async () => {
        await request(app).post('/books').send({
            title: 'O Livro dos Cinco Anéis',
            author: 'Miyamoto Musashi',
            year: 1645
        });
        let r = await request(app).put('/books').send({
            match: {
                title: 'O Livro dos Cinco Anéis'
            },
            patch: {
                status: 'Emprestado'
            }
        });
        expect(r.status).toBe(200);
        expect(r.body.status).toBe('Emprestado');

        r = await request(app).put('/books').send({
            match: {
                title: 'O Livro dos Cinco Anéis'
            },
            patch: {}
        });
        expect(r.status).toBe(400);

        r = await request(app).put('/books').send({
            match: {
                title: 'nonexistent'
            },
            patch: {
                status: 'x'
            }
        });
        expect(r.status).toBe(404);
    });

    test('DELETE /books -> 204 ao remover; 404 depois; 400 ao inválido', async () => {
        await request(app).post('/books').send({
            title: 'Sutra do Lótus Branco',
            author: 'Siddhartha Gautama',
            year: 500
        });
        let r = await request(app).delete('/books').send({
            title: 'Sutra do Lótus Branco'
        });
        expect(r.status).toBe(204);

        r = await request(app).delete('/books').send({
            title: 'Sutra do Lótus Branco'
        });
        expect(r.status).toBe(404);

        r = await request(app).delete('/books').send({});
        expect(r.status).toBe(400);
    });
});