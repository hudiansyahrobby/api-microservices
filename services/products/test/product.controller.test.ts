import app from '../app';
import supertest from 'supertest';
import sequelize from '../config/sequelize';
import fs from 'mz/fs';
import path from 'path';

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

describe('Product Endpoints', () => {
    describe('Create new product', () => {
        it('When name is not specified, then send error ', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .post('/api/v1/destinations')
                .attach('images', filePath)
                .field('quantity', 10)
                .field('price', 5000)
                .field(
                    'description',
                    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators",
                )
                .field('isSecond', false)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('name is a required field');
        });

        it('When name has empty value, then send error ', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .post('/api/v1/destinations')
                .attach('images', filePath)
                .field('name', '')
                .field('quantity', 10)
                .field('price', 5000)
                .field(
                    'description',
                    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators",
                )
                .field('isSecond', false)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('name cannot be an empty field');
        });

        it('When name is not string, then send error ', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .post('/api/v1/destinations')
                .attach('images', filePath)
                .field('name', 20)
                .field('quantity', 10)
                .field('price', 5000)
                .field(
                    'description',
                    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators",
                )
                .field('isSecond', false)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('name must be a type of string');
        });

        it('When quantity is not specified, then send error ', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .post('/api/v1/destinations')
                .attach('images', filePath)
                .field('name', 'Sepatu super')
                .field('price', 5000)
                .field(
                    'description',
                    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators",
                )
                .field('isSecond', false)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('quantity is a required field');
        });

        it('When quantity is less than 1, then send error ', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .post('/api/v1/destinations')
                .attach('images', filePath)
                .field('name', 'Sepatu super')
                .field('quantity', 0)
                .field('price', 5000)
                .field(
                    'description',
                    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators",
                )
                .field('isSecond', false)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('quantity must not be less than 1');
        });

        it('When quantity has minus number, then send error ', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .post('/api/v1/destinations')
                .attach('images', filePath)
                .field('name', 'Sepatu super')
                .field('quantity', -20)
                .field('price', 5000)
                .field(
                    'description',
                    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators",
                )
                .field('isSecond', false)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('quantity must not be less than 1');
        });

        it('When images is not specified, send error', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .post('/api/v1/destinations')
                .field('name', 'Sepatu super')
                .field('quantity', 10)
                .field('price', 5000)
                .field(
                    'description',
                    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators",
                )
                .field('isSecond', false)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('images is a required field');
        });

        it('When price is not specified, send error', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .post('/api/v1/destinations')
                .attach('images', filePath)
                .field('name', 'Sepatu super')
                .field('quantity', 10)
                .field(
                    'description',
                    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators",
                )
                .field('isSecond', false)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('price is a required field');
        });

        it('When price is 0, send error', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .post('/api/v1/destinations')
                .attach('images', filePath)
                .field('name', 'Sepatu super')
                .field('price', 0)
                .field('quantity', 10)
                .field(
                    'description',
                    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators",
                )
                .field('isSecond', false)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('price must be greater than 0');
        });

        it('When price has minus value, send error', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .post('/api/v1/destinations')
                .attach('images', filePath)
                .field('name', 'Sepatu super')
                .field('price', -20)
                .field('quantity', 10)
                .field(
                    'description',
                    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators",
                )
                .field('isSecond', false)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('price must be greater than 0');
        });

        it('When price is not number, send error', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .post('/api/v1/destinations')
                .attach('images', filePath)
                .field('name', 'Sepatu super')
                .field('price', 'false')
                .field('quantity', 10)
                .field(
                    'description',
                    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators",
                )
                .field('isSecond', false)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('price must be a type of number');
        });

        it('When description is not specified, send error', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .post('/api/v1/destinations')
                .attach('images', filePath)
                .field('name', 'Sepatu super')
                .field('price', 5000)
                .field('quantity', 10)
                .field('isSecond', false)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('description is a required field');
        });

        it('When description length is less than 150, send error', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .post('/api/v1/destinations')
                .attach('images', filePath)
                .field('name', 'Sepatu super')
                .field('price', 5000)
                .field('quantity', 10)
                .field('description', 'lorem ipsum')
                .field('isSecond', false)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('description must be at least 150 characters');
        });

        it('When description length greater than 5000, send error', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .post('/api/v1/destinations')
                .attach('images', filePath)
                .field('name', 'Sepatu super')
                .field('price', 5000)
                .field('quantity', 10)
                .field(
                    'description',
                    'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris. Integer ante arcu, accumsan a, consectetuer eget, posuere ut, mauris. Praesent adipiscing. Phasellus ullamcorper ipsum rutrum nunc. Nunc nonummy metus. Vestibulum volutpat pretium libero. Cras id dui. Aenean ut eros et nisl sagittis vestibulum. Nullam nulla eros, ultricies sit amet, nonummy id, imperdiet feugiat, pede. Sed lectus. Donec mollis hendrerit risus. Phasellus nec sem in justo pellentesque facilisis. Etiam imperdiet imperdiet orci. Nunc nec neque. Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada. Praesent congue erat at massa. Sed cursus turpis vitae tortor. Donec posuere vulputate arcu. Phasellus accumsan cursus velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed aliquam, nisi quis porttitor congue, elit erat euismod orci, ac placerat dolor lectus quis orci. Phasellus consectetuer vestibulum elit. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Vestibulum fringilla pede sit amet augue. In turpis. Pellentesque posuere. Praesent turpis. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna dolor sagittis lacus. Donec elit libero, sodales nec, volutpat a, suscipit non, turpis. Nullam sagittis. Suspendisse pulvinar, augue ac venenatis condimentum, sem libero volutpat nibh, nec pellentesque velit pede quis nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce id purus. Ut varius tincidunt libero. Phasellus dolor. Maecenas vestibulum mollis diam. Pellentesque ut neque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In dui magna, posuere eget, vestibulum et, tempor auctor, justo. In ac felis quis tortor malesuada pretium. Pellentesque auctor neque nec urna. Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Aenean viverra rhoncus pede. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut non enim eleifend felis pretium feugiat. Vivamus quis mi. Phasellus a est. Phasellus magna. In hac habitasse platea dictumst. Curabitur at lacus ac velit ornare lobortis. Curabitur a felis in nunc fringilla tristique. Morbi mattis ullamcorper velit. Phasellus gravida semper nisi. Nullam vel sem. Pellentesque libero tortor, tincidunt et, tincidunt eget, semper nec, quam. Sed hendrerit. Morbi ac felis. Nunc egestas, augue at pellentesque laoreet, felis eros vehicula leo, at malesuada velit leo quis pede. Donec interdum, metus et hendrerit aliquet, dolor diam sagittis ligula, eget egestas libero turpis vel mi. Nunc nulla. Fusce risus nisl, viverra et, tempor et, pretium in, sapien. Donec venenatis vulputate lorem. Morbi nec metus. Phasellus blandit leo ut odio. Maecenas ullamcorper, dui et placerat feugiat, eros pede varius nisi, condimentum viverra felis nunc et lorem. Sed magna purus, fermentum eu, tincidunt eu, varius ut, felis. In auctor lobortis lacus. Quisque libero metus, condimentum nec, tempor a, commodo mollis, magna. Vestibulum ullamcorper mauris at ligulasd',
                )
                .field('isSecond', false)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('description must not be greater than 1500 characters');
        });

        it('When description is not string, send error', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .post('/api/v1/destinations')
                .attach('images', filePath)
                .field('name', 'Sepatu super')
                .field('price', 5000)
                .field('quantity', 10)
                .field('description', false)
                .field('isSecond', false)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('description must be a type of string');
        });

        it('When description has empty value, send error', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .post('/api/v1/destinations')
                .attach('images', filePath)
                .field('name', 'Sepatu super')
                .field('price', 5000)
                .field('quantity', 10)
                .field('description', '')
                .field('isSecond', false)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('description cannot be an empty field`');
        });

        it('When isSecond is not specified, send error', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .post('/api/v1/destinations')
                .attach('images', filePath)
                .field('name', 'Sepatu super')
                .field('price', 5000)
                .field('quantity', 10)
                .field(
                    'description',
                    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators",
                )
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('isSecond is a required field');
        });

        it('When isSecond is not boolean, send error', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .post('/api/v1/destinations')
                .attach('images', filePath)
                .field('name', 'Sepatu super')
                .field('price', 5000)
                .field('quantity', 10)
                .field(
                    'description',
                    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators",
                )
                .field('isSecond', 'true')
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('isSecond must be a type of boolean');
        });

        it('When there is no error, create new product with categories', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .post('/api/v1/destinations')
                .attach('images', filePath)
                .field('name', 'Sepatu super')
                .field('quantity', 10)
                .field('price', 5000)
                .field(
                    'description',
                    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators",
                )
                .field('isSecond', false)
                .field('categories', ['46fda6af-6c3b-435d-aa5e-07214f6e3eef', '96b46303-46ee-4c94-b774-eaabbf14777e'])
                .set('Authorization', `Bearer ${token}`)
                .expect(201);
            expect(res.body.message).toBe('Product successfully created');
            expect(res.body.product).toHaveProperty('id');
            expect(res.body.product).toHaveProperty('name', 'Sepatu super');
            expect(res.body.product).toHaveProperty('quantity', 10);
            expect(res.body.product).toHaveProperty('price', 5000);
            expect(res.body.product).toHaveProperty(
                'description',
                "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators",
            );
            expect(res.body.product).toHaveProperty('isSecond', false);
            expect(res.body.product).toHaveProperty('images');
            expect(res.body.product.images).toHaveLength(2);
            expect(res.body.product).toHaveProperty('createdAt');
            expect(res.body.product).toHaveProperty('updatedAt');
            expect(res.body.product).toHaveProperty('seller');
            expect(res.body.product.seller).toHaveProperty('id');
            expect(res.body.product.seller).toHaveProperty('name');
            expect(res.body.product).toHaveProperty('categories');
            expect(res.body.product.categories[0]).toHaveProperty('id');
            expect(res.body.product.categories[0]).toHaveProperty('name');
        });
    });

    describe('Get product list', () => {
        it('Get All products', async () => {
            const res = await request.get('/api/v1/products').expect(200);
            expect(res.body.products).toHaveProperty('totalItems');
            expect(res.body.products).toHaveProperty('totalPages');
            expect(res.body.products).toHaveProperty('currentPage');
            expect(res.body.products).toHaveProperty('results');
            expect(res.body.products.results).not.toHaveLength(0);
            expect(res.body.products.results[0]).toHaveProperty('id');
            expect(res.body.products.results[0]).toHaveProperty('name');
            expect(res.body.products.results[0]).toHaveProperty('quantity');
            expect(res.body.products.results[0]).toHaveProperty('images');
            expect(res.body.products.results[0]).toHaveProperty('price');
            expect(res.body.products.results[0]).toHaveProperty('description');
            expect(res.body.products.results[0]).toHaveProperty('isSecond');
            expect(res.body.products.results[0]).toHaveProperty('shopId');
            expect(res.body.products.results[0]).toHaveProperty('createdAt');
            expect(res.body.products.results[0]).toHaveProperty('updatedAt');
            expect(res.body.products.results[0]).toHaveProperty('seller');
            expect(res.body.products.results[0].seller).toHaveProperty('id');
            expect(res.body.products.results[0].seller).toHaveProperty('name');
            expect(res.body.products.results[0]).toHaveProperty('categories');
            expect(res.body.products.results[0].categories[0]).toHaveProperty('id');
            expect(res.body.products.results[0].categories[0]).toHaveProperty('name');
        });

        it('Get product of id that do not exist', async () => {
            const res = await request.get('/api/v1/products/35732c79-4d9a-451a-a3eb-5366a9c35487').expect(404);
            expect(res.body.message).toBe('Product not found');
            expect(res.body.product).toHaveLength(0);
        });

        it('Get product  detail', async () => {
            const res = await request.get('/api/v1/products/35732c79-4d9a-451a-a3eb-5366a9c35687').expect(200);
            expect(res.body.product).toHaveProperty('id');
            expect(res.body.product).toHaveProperty('name');
            expect(res.body.product).toHaveProperty('quantity');
            expect(res.body.product).toHaveProperty('images');
            expect(res.body.product).toHaveProperty('price');
            expect(res.body.product).toHaveProperty('description');
            expect(res.body.product).toHaveProperty('isSecond');
            expect(res.body.product).toHaveProperty('shopId');
            expect(res.body.product).toHaveProperty('createdAt');
            expect(res.body.product).toHaveProperty('updatedAt');
            expect(res.body.product).toHaveProperty('shopId');
            expect(res.body.product).toHaveProperty('createdAt');
            expect(res.body.product).toHaveProperty('updatedAt');
            expect(res.body.product).toHaveProperty('seller');
            expect(res.body.product.seller).toHaveProperty('id');
            expect(res.body.product.seller).toHaveProperty('name');
            expect(res.body.product).toHaveProperty('categories');
            expect(res.body.product.categories[0]).toHaveProperty('id');
            expect(res.body.product.categories[0]).toHaveProperty('name');
        });
    });

    describe('update product', () => {
        it('When name is not specified, then send error ', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .put('/api/v1/destinations/35732c79-4d9a-451a-a3eb-5366a9c35687')
                .attach('images', filePath)
                .field('quantity', 10)
                .field('price', 5000)
                .field(
                    'description',
                    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators",
                )
                .field('isSecond', false)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('name is a required field');
        });

        it('When name has empty value, then send error ', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .put('/api/v1/destinations/35732c79-4d9a-451a-a3eb-5366a9c35687')
                .attach('images', filePath)
                .field('name', '')
                .field('quantity', 10)
                .field('price', 5000)
                .field(
                    'description',
                    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators",
                )
                .field('isSecond', false)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('name cannot be an empty field');
        });

        it('When name is not string, then send error ', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .put('/api/v1/destinations/35732c79-4d9a-451a-a3eb-5366a9c35687')
                .attach('images', filePath)
                .field('name', 20)
                .field('quantity', 10)
                .field('price', 5000)
                .field(
                    'description',
                    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators",
                )
                .field('isSecond', false)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('name must be a type of string');
        });

        it('When quantity is not specified, then send error ', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .put('/api/v1/destinations/35732c79-4d9a-451a-a3eb-5366a9c35687')
                .attach('images', filePath)
                .field('name', 'Sepatu super')
                .field('price', 5000)
                .field(
                    'description',
                    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators",
                )
                .field('isSecond', false)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('quantity is a required field');
        });

        it('When quantity is less than 1, then send error ', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .put('/api/v1/destinations/35732c79-4d9a-451a-a3eb-5366a9c35687')
                .attach('images', filePath)
                .field('name', 'Sepatu super')
                .field('quantity', 0)
                .field('price', 5000)
                .field(
                    'description',
                    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators",
                )
                .field('isSecond', false)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('quantity must not be less than 1');
        });

        it('When quantity has minus number, then send error ', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .put('/api/v1/destinations/35732c79-4d9a-451a-a3eb-5366a9c35687')
                .attach('images', filePath)
                .field('name', 'Sepatu super')
                .field('quantity', -20)
                .field('price', 5000)
                .field(
                    'description',
                    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators",
                )
                .field('isSecond', false)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('quantity must not be less than 1');
        });

        it('When images is not specified, send error', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .put('/api/v1/destinations/35732c79-4d9a-451a-a3eb-5366a9c35687')
                .field('name', 'Sepatu super')
                .field('quantity', 10)
                .field('price', 5000)
                .field(
                    'description',
                    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators",
                )
                .field('isSecond', false)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('images is a required field');
        });

        it('When price is not specified, send error', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .put('/api/v1/destinations/35732c79-4d9a-451a-a3eb-5366a9c35687')
                .attach('images', filePath)
                .field('name', 'Sepatu super')
                .field('quantity', 10)
                .field(
                    'description',
                    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators",
                )
                .field('isSecond', false)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('price is a required field');
        });

        it('When price is 0, send error', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .put('/api/v1/destinations/35732c79-4d9a-451a-a3eb-5366a9c35687')
                .attach('images', filePath)
                .field('name', 'Sepatu super')
                .field('price', 0)
                .field('quantity', 10)
                .field(
                    'description',
                    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators",
                )
                .field('isSecond', false)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('price must be greater than 0');
        });

        it('When price has minus value, send error', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .put('/api/v1/destinations/35732c79-4d9a-451a-a3eb-5366a9c35687')
                .attach('images', filePath)
                .field('name', 'Sepatu super')
                .field('price', -20)
                .field('quantity', 10)
                .field(
                    'description',
                    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators",
                )
                .field('isSecond', false)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('price must be greater than 0');
        });

        it('When price is not number, send error', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .put('/api/v1/destinations/35732c79-4d9a-451a-a3eb-5366a9c35687')
                .attach('images', filePath)
                .field('name', 'Sepatu super')
                .field('price', 'false')
                .field('quantity', 10)
                .field(
                    'description',
                    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators",
                )
                .field('isSecond', false)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('price must be a type of number');
        });

        it('When description is not specified, send error', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .put('/api/v1/destinations/35732c79-4d9a-451a-a3eb-5366a9c35687')
                .attach('images', filePath)
                .field('name', 'Sepatu super')
                .field('price', 5000)
                .field('quantity', 10)
                .field('isSecond', false)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('description is a required field');
        });

        it('When description length is less than 150, send error', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .put('/api/v1/destinations/35732c79-4d9a-451a-a3eb-5366a9c35687')
                .attach('images', filePath)
                .field('name', 'Sepatu super')
                .field('price', 5000)
                .field('quantity', 10)
                .field('description', 'lorem ipsum')
                .field('isSecond', false)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('description must be at least 150 characters');
        });

        it('When description length greater than 5000, send error', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .put('/api/v1/destinations/35732c79-4d9a-451a-a3eb-5366a9c35687')
                .attach('images', filePath)
                .field('name', 'Sepatu super')
                .field('price', 5000)
                .field('quantity', 10)
                .field(
                    'description',
                    'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris. Integer ante arcu, accumsan a, consectetuer eget, posuere ut, mauris. Praesent adipiscing. Phasellus ullamcorper ipsum rutrum nunc. Nunc nonummy metus. Vestibulum volutpat pretium libero. Cras id dui. Aenean ut eros et nisl sagittis vestibulum. Nullam nulla eros, ultricies sit amet, nonummy id, imperdiet feugiat, pede. Sed lectus. Donec mollis hendrerit risus. Phasellus nec sem in justo pellentesque facilisis. Etiam imperdiet imperdiet orci. Nunc nec neque. Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada. Praesent congue erat at massa. Sed cursus turpis vitae tortor. Donec posuere vulputate arcu. Phasellus accumsan cursus velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed aliquam, nisi quis porttitor congue, elit erat euismod orci, ac placerat dolor lectus quis orci. Phasellus consectetuer vestibulum elit. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Vestibulum fringilla pede sit amet augue. In turpis. Pellentesque posuere. Praesent turpis. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna dolor sagittis lacus. Donec elit libero, sodales nec, volutpat a, suscipit non, turpis. Nullam sagittis. Suspendisse pulvinar, augue ac venenatis condimentum, sem libero volutpat nibh, nec pellentesque velit pede quis nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce id purus. Ut varius tincidunt libero. Phasellus dolor. Maecenas vestibulum mollis diam. Pellentesque ut neque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In dui magna, posuere eget, vestibulum et, tempor auctor, justo. In ac felis quis tortor malesuada pretium. Pellentesque auctor neque nec urna. Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Aenean viverra rhoncus pede. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut non enim eleifend felis pretium feugiat. Vivamus quis mi. Phasellus a est. Phasellus magna. In hac habitasse platea dictumst. Curabitur at lacus ac velit ornare lobortis. Curabitur a felis in nunc fringilla tristique. Morbi mattis ullamcorper velit. Phasellus gravida semper nisi. Nullam vel sem. Pellentesque libero tortor, tincidunt et, tincidunt eget, semper nec, quam. Sed hendrerit. Morbi ac felis. Nunc egestas, augue at pellentesque laoreet, felis eros vehicula leo, at malesuada velit leo quis pede. Donec interdum, metus et hendrerit aliquet, dolor diam sagittis ligula, eget egestas libero turpis vel mi. Nunc nulla. Fusce risus nisl, viverra et, tempor et, pretium in, sapien. Donec venenatis vulputate lorem. Morbi nec metus. Phasellus blandit leo ut odio. Maecenas ullamcorper, dui et placerat feugiat, eros pede varius nisi, condimentum viverra felis nunc et lorem. Sed magna purus, fermentum eu, tincidunt eu, varius ut, felis. In auctor lobortis lacus. Quisque libero metus, condimentum nec, tempor a, commodo mollis, magna. Vestibulum ullamcorper mauris at ligulasd',
                )
                .field('isSecond', false)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('description must not be greater than 1500 characters');
        });

        it('When description is not string, send error', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .put('/api/v1/destinations/35732c79-4d9a-451a-a3eb-5366a9c35687')
                .attach('images', filePath)
                .field('name', 'Sepatu super')
                .field('price', 5000)
                .field('quantity', 10)
                .field('description', false)
                .field('isSecond', false)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('description must be a type of string');
        });

        it('When description has empty value, send error', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .put('/api/v1/destinations/35732c79-4d9a-451a-a3eb-5366a9c35687')
                .attach('images', filePath)
                .field('name', 'Sepatu super')
                .field('price', 5000)
                .field('quantity', 10)
                .field('description', '')
                .field('isSecond', false)
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('description cannot be an empty field`');
        });

        it('When isSecond is not specified, send error', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .put('/api/v1/destinations/35732c79-4d9a-451a-a3eb-5366a9c35687')
                .attach('images', filePath)
                .field('name', 'Sepatu super')
                .field('price', 5000)
                .field('quantity', 10)
                .field(
                    'description',
                    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators",
                )
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('isSecond is a required field');
        });

        it('When isSecond is not boolean, send error', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .put('/api/v1/destinations/35732c79-4d9a-451a-a3eb-5366a9c35687')
                .attach('images', filePath)
                .field('name', 'Sepatu super')
                .field('price', 5000)
                .field('quantity', 10)
                .field(
                    'description',
                    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators",
                )
                .field('isSecond', 'true')
                .set('Authorization', `Bearer ${token}`)
                .expect(422);
            expect(res.body.message).toBe('isSecond must be a type of boolean');
        });

        it('When product not found, send error', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .put('/api/v1/destinations/35732c79-4d9a-451a-a3eb-5366a9c35787')
                .attach('images', filePath)
                .field('name', 'Sepatu super')
                .field('price', 5000)
                .field('quantity', 10)
                .field(
                    'description',
                    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators",
                )
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
            expect(res.body.message).toBe('Product not found');
        });

        it('When there is no error, update product', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .put('/api/v1/destinations/35732c79-4d9a-451a-a3eb-5366a9c35687')
                .attach('images', filePath)
                .field('name', 'Baju super')
                .field('quantity', 15)
                .field('price', 10000)
                .field(
                    'description',
                    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generatorsz",
                )
                .field('isSecond', true)
                .field('categories', ['96b46303-46ee-4c94-b774-eaabbf14777e'])
                .set('Authorization', `Bearer ${token}`)
                .expect(201);
            expect(res.body.message).toBe('Product successfully updated');
            expect(res.body.product).toHaveProperty('id');
            expect(res.body.product).toHaveProperty('name', 'Baju super');
            expect(res.body.product).toHaveProperty('quantity', 15);
            expect(res.body.product).toHaveProperty('price', 10000);
            expect(res.body.product).toHaveProperty(
                'description',
                "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generatorsz",
            );
            expect(res.body.product).toHaveProperty('isSecond', true);
            expect(res.body.product).toHaveProperty('images');
            expect(res.body.product.images).toHaveLength(2);
            expect(res.body.product).toHaveProperty('shopId');
            expect(res.body.product).toHaveProperty('createdAt');
            expect(res.body.product).toHaveProperty('updatedAt');
            expect(res.body.product).toHaveProperty('seller');
            expect(res.body.product.seller).toHaveProperty('id');
            expect(res.body.product.seller).toHaveProperty('name');
            expect(res.body.product).toHaveProperty('categories');
            expect(res.body.product.categories[0]).toHaveProperty('id', '96b46303-46ee-4c94-b774-eaabbf14777e');
            expect(res.body.product.categories[0]).toHaveProperty('name', 'laptop');
        });
    });

    describe('delete product', () => {
        it('When product not found, send error', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .delete('/api/v1/destinations/35732c79-4d9a-451a-a3eb-5366a9c35699')
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
            expect(res.body.message).toBe('Product not found');
        });

        it('When there is no error, delete product', async () => {
            const filePath = path.join(__dirname, '..', 'testFiles', 'test.jpeg');
            const isFileExist = await fs.exists(filePath);
            if (!isFileExist) throw new Error('file does not exist');
            const res = await request
                .delete('/api/v1/destinations/35732c79-4d9a-451a-a3eb-5366a9c35687')
                .set('Authorization', `Bearer ${token}`)
                .expect(201);
            expect(res.body.message).toBe('Product deleted successfully');
            expect(res.body.product).toHaveProperty('id', '35732c79-4d9a-451a-a3eb-5366a9c35687');
            expect(res.body.product).toHaveProperty('name', 'Keyboard X240');
            expect(res.body.product).toHaveProperty('quantity', 20);
            expect(res.body.product).toHaveProperty('price', 40000);
            expect(res.body.product).toHaveProperty(
                'description',
                'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc',
            );
            expect(res.body.product).toHaveProperty('isSecond', false);
            expect(res.body.product).toHaveProperty('images');
            expect(res.body.product).toHaveProperty('shopId', '46fda6af-6c3b-435d-aa5e-07214f6e3eef');
            expect(res.body.product).toHaveProperty('createdAt');
            expect(res.body.product).toHaveProperty('updatedAt');
            expect(res.body.product).toHaveProperty('seller');
            expect(res.body.product.seller).toHaveProperty('id');
            expect(res.body.product.seller).toHaveProperty('name');
            expect(res.body.product).toHaveProperty('categories');
        });
    });
});
