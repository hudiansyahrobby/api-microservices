import app from '../app';
import supertest from 'supertest';
import sequelize from '../config/sequelize';

const request = supertest(app);

let token: string;
beforeAll((done) => {
    request
        .post('/api/v1/login')
        .send({
            email: 'john3@gmail.com',
            password: '1234567890',
        })
        .end((err, response) => {
            token = response.body.accessToken; // save the token!
            done();
        });
});

afterAll((done) => {
    sequelize.close();
    done();
});

describe('Category Endpoints', () => {
    describe('Create new category', () => {
        it('When name is not specified, then send error ', async () => {
            const res = await request
                .post('/api/v1/categories')
                .send({})
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('name is a required field');
        });

        it('When name contains number, then send error ', async () => {
            const res = await request
                .post('/api/v1/categories')
                .send({
                    name: 'clothes7',
                })
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('name should only contain alphapet or space');
        });

        it('When name contains symbol characters , then send error ', async () => {
            const res = await request
                .post('/api/v1/categories')
                .send({
                    name: 'clothes<',
                })
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('name should only contain alphapet or space');
        });

        it('When name is boolean , then send error ', async () => {
            const res = await request
                .post('/api/v1/categories')
                .send({
                    name: true,
                })
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('name should be a type of string');
        });

        it('When name is empty , then send error ', async () => {
            const res = await request
                .post('/api/v1/categories')
                .send({
                    name: '',
                })
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('name cannot be an empty field');
        });

        it('When there is no error, create new category', async () => {
            const res = await request
                .post('/api/v1/categories')
                .send({
                    name: 'clothes',
                })
                .set('Authorization', `Bearer ${token}`)
                .expect(201);
            expect(res.body.message).toBe('Category successfully created');
            expect(res.body.category).toHaveProperty('name', 'clothes');
        });

        it('When category name have uppercase letter, create new category change it to lowercase', async () => {
            const res = await request
                .post('/api/v1/categories')
                .send({
                    name: 'ELectronics',
                })
                .set('Authorization', `Bearer ${token}`)
                .expect(201);
            expect(res.body.message).toBe('Category successfully created');
            expect(res.body.category).toHaveProperty('name', 'electronics');
        });

        it('When category has already exist, send error', async () => {
            const res = await request
                .post('/api/v1/categories')
                .send({
                    name: 'clothes',
                })
                .set('Authorization', `Bearer ${token}`)
                .expect(400);
            expect(res.body.message).toBe('Category has already exist');
        });
    });

    describe('Get category list', () => {
        it('Get all categories', async () => {
            const res = await request.get('/api/v1/categories').expect(200);

            expect(res.body.categories).not.toHaveLength(0);
            expect(res.body.categories[0]).toHaveProperty('id');
            expect(res.body.categories[0]).toHaveProperty('name');
        });
    });

    describe('update category', () => {
        it('When name is not specified, then send error ', async () => {
            const res = await request
                .put('/api/v1/categories/1')
                .send({})
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('name is a required field');
        });

        it('When name contains number, then send error ', async () => {
            const res = await request
                .put('/api/v1/categories/1')
                .send({
                    name: 'clothes7',
                })
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('name should only contain alphapet or space');
        });

        it('When name contains symbol characters , then send error ', async () => {
            const res = await request
                .put('/api/v1/categories/1')
                .send({
                    name: 'clothes<',
                })
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('name should only contain alphapet or space');
        });

        it('When name is boolean , then send error ', async () => {
            const res = await request
                .put('/api/v1/categories/1')
                .send({
                    name: true,
                })
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('name should be a type of string');
        });

        it('When name is empty , then send error ', async () => {
            const res = await request
                .put('/api/v1/categories/1')
                .send({
                    name: '',
                })
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('name cannot be an empty field');
        });

        it('When category does not exist, send error', async () => {
            const res = await request
                .put('/api/v1/categories/99')
                .send({
                    name: '',
                })
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
            expect(res.body.message).toBe('Category not found');
        });

        it('When there is no error, update category', async () => {
            const res = await request
                .put('/api/v1/categories/1')
                .send({
                    name: 'car',
                })
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
            expect(res.body.message).toBe('Category successfully updated');
            expect(res.body.category).toHaveProperty('name', 'car');
        });

        it('When category name have uppercase letter, update category change it to lowercase', async () => {
            const res = await request
                .put('/api/v1/categories')
                .send({
                    name: 'BIke',
                })
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
            expect(res.body.message).toBe('Category successfully created');
            expect(res.body.category).toHaveProperty('name', 'bike');
        });
    });

    describe('delete category', () => {
        it('When category does not exist, send error', async () => {
            const res = await request
                .delete('/api/v1/categories/99')
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
            expect(res.body.message).toBe('Category not found');
        });

        it('When there is no error, delete category', async () => {
            const res = await request
                .delete('/api/v1/categories/1')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
            expect(res.body.message).toBe('Category successfully deleted');
            expect(res.body.category).toHaveProperty('name', 'smartphone');
        });
    });
});
