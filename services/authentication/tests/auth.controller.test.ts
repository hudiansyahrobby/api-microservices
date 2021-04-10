import app from '../app';
import supertest from 'supertest';
import admin from 'firebase-admin';
const request = supertest(app);

let uid: Array<string> = [];

afterAll(async (done) => {
    const db = admin.firestore();
    const docRef = db.collection('users');

    await admin.auth().deleteUser(uid[0]);
    await admin.auth().deleteUser(uid[1]);

    await docRef.doc(uid[0]).delete();
    await docRef.doc(uid[1]).delete();
    await done();
});

describe('test add function', () => {
    it('should return 15 for add(10,5)', () => {
        expect(10 + 5).toBe(15);
    });

    // it("if displayName doesn't exist, send error", async () => {
    //     const res = await request.post('/api/v1/register/firebase-register').send({
    //         email: 'testing@gmail.com',
    //         phoneNumber: '+6289519231081',
    //         password: 'Test12,.12,.',
    //         passwordConfirmation: 'Test12,.12,.',
    //     });
    //     expect(res.status).toBe(422);
    //     expect(res.body.message).toBe('display name is a required field');
    // });
});

describe('Sign user up with email', () => {
    it("if displayName doesn't exist, send error", async () => {
        const res = await request.post('/api/v1/register/firebase-register').send({
            email: 'testing@gmail.com',
            phoneNumber: '+6289519231081',
            password: 'Test12,.12,.',
            passwordConfirmation: 'Test12,.12,.',
        });
        expect(res.status).toBe(422);
        expect(res.body.message).toBe('display name is a required field');
    });
    it('When displayName contains non alphapets, then send error ', async () => {
        const res = await request.post('/api/v1/register/firebase-register').send({
            displayName: 'test234',
            email: 'testing@gmail.com',
            phoneNumber: '+6289519231081',
            password: 'Test12,.12,.',
            passwordConfirmation: 'Test12,.12,.',
        });
        expect(res.status).toBe(422);
        expect(res.body.message).toBe('display name should only contain alphapet or space');
    });
    it('When email is not valid, then send error', async () => {
        const res = await request.post('/api/v1/register/firebase-register').send({
            displayName: 'test',
            email: 'testinggmail.com',
            phoneNumber: '+6289519231081',
            password: 'Test12,.12,.',
            passwordConfirmation: 'Test12,.12,.',
        });
        expect(res.status).toBe(422);
        expect(res.body.message).toBe('email is not valid');
    });
    it('When no email is specified, then send field is required ', async () => {
        const res = await request.post('/api/v1/register/firebase-register').send({
            displayName: 'test',
            phoneNumber: '+6289519231081',
            password: 'Manusia12,',
            passwordConfirmation: 'Manusia12,',
        });
        expect(res.status).toBe(422);
        expect(res.body.message).toBe('email is a required field');
    });
    it('When no phone number is specified, then send field is required', async () => {
        const res = await request.post('/api/v1/register/firebase-register').send({
            displayName: 'test',
            email: 'testing@gmail.com',
            password: 'Test12,.12,.',
            passwordConfirmation: 'Test12,.12,.',
        });
        expect(res.status).toBe(422);
        expect(res.body.message).toBe('Phone number is a required field');
    });
    it('When password less than 8, then send error', async () => {
        const res = await request.post('/api/v1/register/firebase-register').send({
            displayName: 'test',
            phoneNumber: '+6289519231081',
            email: 'manusia@gmail.com',
            password: 'Maia12,',
            passwordConfirmation: 'Maia12,',
        });
        expect(res.status).toBe(422);
        expect(res.body.message).toBe('password must be at least 8 characters');
    });
    it("When password doesn't contain at least one uppercase letter, one lowercase letter, one number and one special character, then send error", async () => {
        const res = await request.post('/api/v1/register/firebase-register').send({
            displayName: 'test',
            phoneNumber: '+6289519231081',
            email: 'manusia@gmail.com',
            password: 'Manusia12',
            passwordConfirmation: 'Manusia12',
        });
        expect(res.status).toBe(422);
        expect(res.body.message).toBe(
            'password must be at least one uppercase letter, one lowercase letter, one number and one special character',
        );
    });
    it('When no password is specified, then send field is required ', async () => {
        const res = await request.post('/api/v1/register/firebase-register').send({
            displayName: 'test',
            phoneNumber: '+6289519231081',
            email: 'manusia@gmail.com',
            passwordConfirmation: 'Manusia12,',
        });
        expect(res.status).toBe(422);
        expect(res.body.message).toBe('password is a required field');
    });
    it('When no confirmation password is specified, then send field is required ', async () => {
        const res = await request.post('/api/v1/register/firebase-register').send({
            displayName: 'test',
            phoneNumber: '+6289519231081',
            email: 'manusia@gmail.com',
            password: 'Manusia12,',
        });
        expect(res.status).toBe(422);
        expect(res.body.message).toBe('password confirmation is a required field');
    });
    it("When confirmation password and password don't match, then error", async () => {
        const res = await request.post('/api/v1/register/firebase-register').send({
            displayName: 'test',
            phoneNumber: '+6289519231081',
            email: 'manusia@gmail.com',
            password: 'Manusia12,',
            passwordConfirmation: 'Manusia12,dg',
        });
        expect(res.status).toBe(422);
        expect(res.body.message).toBe('password does not match');
    });
    it('should create a new user', async () => {
        const res = await request.post('/api/v1/register/firebase-register').send({
            displayName: 'test',
            email: 'testing@gmail.com',
            phoneNumber: '+6289019231081',
            password: 'Test12,.12,.',
            passwordConfirmation: 'Test12,.12,.',
        });
        uid.push(res.body.user.uid);
        expect(res.status).toBe(201);

        expect(res.body.user).toHaveProperty('uid');
        expect(res.body.user).toHaveProperty('email');
        expect(res.body.user).toHaveProperty('phoneNumber');
        expect(res.body.user).toHaveProperty('displayName');
        expect(res.body.message).toBe('User successfully registered');
    });
    it('If Email has been registered, send error', async () => {
        const res = await request.post('/api/v1/register/firebase-register').send({
            displayName: 'test',
            email: 'testing@gmail.com',
            phoneNumber: '+6289519201081',
            password: 'Test12,.12,.',
            passwordConfirmation: 'Test12,.12,.',
        });
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Email is already used by another account');
    });
    it('If phone number has been used, send error', async () => {
        const res = await request.post('/api/v1/register/firebase-register').send({
            displayName: 'test',
            email: 'testingwe@gmail.com',
            phoneNumber: '+6289019231081',
            password: 'Test12,.12,.',
            passwordConfirmation: 'Test12,.12,.',
        });
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('User with this phone number already exist');
    });
});

describe('Sign user up with username', () => {
    it("if displayName doesn't exist, send error", async () => {
        const res = await request.post('/api/v1/register/username-register').send({
            username: 'testing',
            phoneNumber: '+6289519231081',
            password: 'Test12,.12,.',
            passwordConfirmation: 'Test12,.12,.',
        });
        expect(res.status).toBe(422);
        expect(res.body.message).toBe('display name is a required field');
    });
    it('When displayName contains non alphapets, then send error ', async () => {
        const res = await request.post('/api/v1/register/username-register').send({
            displayName: 'test234',
            username: 'testing',
            phoneNumber: '+6289519231081',
            password: 'Test12,.12,.',
            passwordConfirmation: 'Test12,.12,.',
        });
        expect(res.status).toBe(422);
        expect(res.body.message).toBe('display name should only contain alphapet or space');
    });
    it('When username is not valid, then send error', async () => {
        const res = await request.post('/api/v1/register/username-register').send({
            displayName: 'test',
            username: 'testinggmail.com',
            phoneNumber: '+6289519231081',
            password: 'Test12,.12,.',
            passwordConfirmation: 'Test12,.12,.',
        });
        expect(res.status).toBe(422);
        expect(res.body.message).toBe('username should only contain alphapet or number');
    });
    it('When no username is specified, then send field is required ', async () => {
        const res = await request.post('/api/v1/register/username-register').send({
            displayName: 'test',
            phoneNumber: '+6289519231081',
            password: 'Manusia12,',
            passwordConfirmation: 'Manusia12,',
        });
        expect(res.status).toBe(422);
        expect(res.body.message).toBe('username is a required field');
    });
    it('When no phone number is specified, then send field is required', async () => {
        const res = await request.post('/api/v1/register/username-register').send({
            displayName: 'test',
            username: 'testing',
            password: 'Test12,.12,.',
            passwordConfirmation: 'Test12,.12,.',
        });
        expect(res.status).toBe(422);
        expect(res.body.message).toBe('Phone number is a required field');
    });
    it('When password less than 8, then send error', async () => {
        const res = await request.post('/api/v1/register/username-register').send({
            displayName: 'test',
            phoneNumber: '+6289519231081',
            username: 'manusia',
            password: 'Maia12,',
            passwordConfirmation: 'Maia12,',
        });
        expect(res.status).toBe(422);
        expect(res.body.message).toBe('password must be at least 8 characters');
    });
    it("When password doesn't contain at least one uppercase letter, one lowercase letter, one number and one special character, then send error", async () => {
        const res = await request.post('/api/v1/register/username-register').send({
            displayName: 'test',
            phoneNumber: '+6289519231081',
            username: 'manusia',
            password: 'Manusia12',
            passwordConfirmation: 'Manusia12',
        });
        expect(res.status).toBe(422);
        expect(res.body.message).toBe(
            'password must be at least one uppercase letter, one lowercase letter, one number and one special character',
        );
    });
    it('When no password is specified, then send field is required ', async () => {
        const res = await request.post('/api/v1/register/username-register').send({
            displayName: 'test',
            phoneNumber: '+6289519231081',
            username: 'manusia',
            passwordConfirmation: 'Manusia12,',
        });
        expect(res.status).toBe(422);
        expect(res.body.message).toBe('password is a required field');
    });
    it('When no confirmation password is specified, then send field is required ', async () => {
        const res = await request.post('/api/v1/register/username-register').send({
            displayName: 'test',
            phoneNumber: '+6289519231081',
            username: 'manusia',
            password: 'Manusia12,',
        });
        expect(res.status).toBe(422);
        expect(res.body.message).toBe('password confirmation is a required field');
    });
    it("When confirmation password and password don't match, then error", async () => {
        const res = await request.post('/api/v1/register/username-register').send({
            displayName: 'test',
            phoneNumber: '+6289519231081',
            username: 'manusia',
            password: 'Manusia12,',
            passwordConfirmation: 'Manusia12,dg',
        });
        expect(res.status).toBe(422);
        expect(res.body.message).toBe('password does not match');
    });
    it('should create a new user', async () => {
        const res = await request.post('/api/v1/register/username-register').send({
            displayName: 'test',
            username: 'testing',
            phoneNumber: '+6289019231088',
            password: 'Test12,.12,.',
            passwordConfirmation: 'Test12,.12,.',
        });
        uid.push(res.body.user.uid);
        expect(res.status).toBe(201);

        expect(res.body.user).toHaveProperty('uid');
        expect(res.body.user).toHaveProperty('email');
        expect(res.body.user).toHaveProperty('phoneNumber');
        expect(res.body.user).toHaveProperty('displayName');
        expect(res.body.message).toBe('User successfully registered');
    });
    it('If username has been registered, send error', async () => {
        const res = await request.post('/api/v1/register/username-register').send({
            displayName: 'test',
            username: 'testing',
            phoneNumber: '+6289519201081',
            password: 'Test12,.12,.',
            passwordConfirmation: 'Test12,.12,.',
        });
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('username is already used by another account');
    });
    it('If phone number has been used, send error', async () => {
        const res = await request.post('/api/v1/register/username-register').send({
            displayName: 'test',
            username: 'testingwe',
            phoneNumber: '+6289019231088',
            password: 'Test12,.12,.',
            passwordConfirmation: 'Test12,.12,.',
        });
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('User with this phone number already exist');
    });
});

describe('Log user in with email', () => {
    it('When email is not valid, then send error', async () => {
        const res = await request.post('/api/v1/login/firebase-login').send({
            email: 'manusia@gmail',
            password: 'Manusia12,',
        });
        expect(res.status).toBe(422);
        expect(res.body.message).toBe('email is not valid');
    });
    it('When no email is specified, then send field is required ', async () => {
        const res = await request.post('/api/v1/login/firebase-login').send({
            password: 'Manusia12,',
        });
        expect(res.status).toBe(422);
        expect(res.body.message).toBe('email is a required field');
    });
    it('when email is not registered, send error', async () => {
        const res = await request.post('/api/v1/login/firebase-login').send({
            email: 'manusia77@gmail.com',
            password: 'Manusia12,',
        });
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Email or password is invalid');
    });
    it('When no password is specified, then send field is required', async () => {
        const res = await request.post('/api/v1/login/firebase-login').send({
            email: 'manusia@gmail.com',
        });
        expect(res.status).toBe(422);
        expect(res.body.message).toBe('password is a required field');
    });
    it('When password is wrong, then send error', async () => {
        const res = await request.post('/api/v1/login/firebase-login').send({
            email: 'manusia@gmail.com',
            password: 'Manusia,',
        });
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Email or password is invalid');
    });
    it('should login as user', async () => {
        const res = await request.post('/api/v1/login/firebase-login').send({
            email: 'testing@gmail.com',
            password: 'Test12,.12,.',
        });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('user');
        expect(res.body.message).toBe('User successfully login');
    });
});

describe('Log user in with username', () => {
    it('When username is not valid, then send error', async () => {
        const res = await request.post('/api/v1/login/username-login').send({
            username: 'manusia@gmail',
            password: 'Manusia12,',
        });
        expect(res.status).toBe(422);
        expect(res.body.message).toBe('username should only contain alphapet or number');
    });

    it('When no username is specified, then send field is required ', async () => {
        const res = await request.post('/api/v1/login/username-login').send({
            password: 'Manusia12,',
        });
        expect(res.status).toBe(422);
        expect(res.body.message).toBe('username is a required field');
    });

    it('when username is not registered, send error', async () => {
        const res = await request.post('/api/v1/login/username-login').send({
            username: 'manusia77',
            password: 'Manusia12,',
        });
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Email or password is invalid');
    });

    it('When no password is specified, then send field is required', async () => {
        const res = await request.post('/api/v1/login/username-login').send({
            username: 'manusia',
        });
        expect(res.status).toBe(422);
        expect(res.body.message).toBe('password is a required field');
    });

    it('When password is wrong, then send error', async () => {
        const res = await request.post('/api/v1/login/username-login').send({
            username: 'manusia',
            password: 'Manusia,',
        });
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Email or password is invalid');
    });

    it('should login as user', async () => {
        const res = await request.post('/api/v1/login/username-login').send({
            username: 'testing',
            password: 'Test12,.12,.',
        });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('user');
        expect(res.body.message).toBe('User successfully login');
    });
});

describe('Revoke refresh token', () => {
    it('should fail if uid is not found', async () => {
        const res = await request.post('/api/v1/refresh-token').send({
            uid: 'asudhaudhwiuad',
        });
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('User with this ID not found');
    });

    it('if UID valid, revoke refresh token', async () => {
        const res = await request.post('/api/v1/refresh-token').send({
            uid: uid[0],
        });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Token revoked successfully');
    });
});

describe('Log user out', () => {
    it('should log user out', async () => {
        const res = await request.post('/api/v1/logout');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Signout successfully');
    });
});
