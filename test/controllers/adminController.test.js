const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const Admin = require('../../models/admin');
const User = require('../../models/user');
const Beneficiary = require('../../models/beneficiary');
const Donor = require('../../models/donor');

chai.should();
chai.use(chaiHttp);

describe('Admin Controller', () => {
    beforeEach((done) => {
        Admin.deleteMany({}, (err) => {
            User.deleteMany({}, (err) => {
                Beneficiary.deleteMany({}, (err) => {
                    Donor.deleteMany({}, (err) => {
                        done();
                    });
                });
            });
        });
    });

    describe('/POST add_admin', () => {
        it('it should add a new admin', (done) => {
            const admin = {
                _id: 'admin1',
                name: 'Admin 1',
                email: 'admin1@example.com',
                password: 'password123',
            };
            chai.request(server)
                .post('/admin/add_admin')
                .send(admin)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('admin');
                    res.body.admin.should.have.property('name').eql('Admin 1');
                    done();
                });
        });

        it('it should not add an admin with missing fields', (done) => {
            const admin = {
                name: 'Admin 1',
            };
            chai.request(server)
                .post('/admin/add_admin')
                .send(admin)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
    });

    describe('/POST login', () => {
        it('it should login an admin', (done) => {
            const admin = new Admin({
                _id: 'admin1',
                name: 'Admin 1',
                email: 'admin1@example.com',
                password: 'password123',
            });
            admin.save((err, admin) => {
                chai.request(server)
                    .post('/admin/login')
                    .send({ email: 'admin1@example.com', password: 'password123' })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('token');
                        done();
                    });
            });
        });

        it('it should not login an admin with incorrect credentials', (done) => {
            const admin = new Admin({
                _id: 'admin1',
                name: 'Admin 1',
                email: 'admin1@example.com',
                password: 'password123',
            });
            admin.save((err, admin) => {
                chai.request(server)
                    .post('/admin/login')
                    .send({ email: 'admin1@example.com', password: 'wrongpassword' })
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('error');
                        done();
                    });
            });
        });
    });

    describe('/GET get_users', () => {
        it('it should GET all the users', (done) => {
            const user1 = new User({
                _id: 'user1',
                name: 'User 1',
                email: 'user1@example.com',
                phoneNo: '1234567890',
                address: '123 Main St',
            });
            const user2 = new User({
                _id: 'user2',
                name: 'User 2',
                email: 'user2@example.com',
                phoneNo: '0987654321',
                address: '456 Elm St',
            });
            user1.save((err, user1) => {
                user2.save((err, user2) => {
                    chai.request(server)
                        .get('/admin/get_users')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('array');
                            res.body.length.should.be.eql(2);
                            done();
                        });
                });
            });
        });

        it('it should GET an empty array if no users found', (done) => {
            chai.request(server)
                .get('/admin/get_users')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('/POST add_user', () => {
        it('it should add a new user', (done) => {
            const user = {
                _id: 'user1',
                name: 'User 1',
                email: 'user1@example.com',
                phoneNo: '1234567890',
                address: '123 Main St',
            };
            chai.request(server)
                .post('/admin/add_user')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('user');
                    res.body.user.should.have.property('name').eql('User 1');
                    done();
                });
        });

        it('it should not add a user with missing fields', (done) => {
            const user = {
                name: 'User 1',
            };
            chai.request(server)
                .post('/admin/add_user')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
    });

    describe('/DELETE delete_user', () => {
        it('it should delete a user', (done) => {
            const user = new User({
                _id: 'user1',
                name: 'User 1',
                email: 'user1@example.com',
                phoneNo: '1234567890',
                address: '123 Main St',
            });
            user.save((err, user) => {
                chai.request(server)
                    .delete('/admin/delete_user')
                    .send({ user_id: 'user1' })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('User deleted successfully');
                        done();
                    });
            });
        });

        it('it should not delete a user if not found', (done) => {
            chai.request(server)
                .delete('/admin/delete_user')
                .send({ user_id: 'user1' })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
    });

    describe('/GET get_beneficiaries', () => {
        it('it should GET all the beneficiaries', (done) => {
            const beneficiary1 = new Beneficiary({
                _id: 'beneficiary1',
                name: 'Beneficiary 1',
                email: 'beneficiary1@example.com',
                phoneNo: '1234567890',
                address: '123 Main St',
            });
            const beneficiary2 = new Beneficiary({
                _id: 'beneficiary2',
                name: 'Beneficiary 2',
                email: 'beneficiary2@example.com',
                phoneNo: '0987654321',
                address: '456 Elm St',
            });
            beneficiary1.save((err, beneficiary1) => {
                beneficiary2.save((err, beneficiary2) => {
                    chai.request(server)
                        .get('/admin/get_beneficiaries')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('array');
                            res.body.length.should.be.eql(2);
                            done();
                        });
                });
            });
        });

        it('it should GET an empty array if no beneficiaries found', (done) => {
            chai.request(server)
                .get('/admin/get_beneficiaries')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('/POST add_beneficiary', () => {
        it('it should add a new beneficiary', (done) => {
            const beneficiary = {
                _id: 'beneficiary1',
                name: 'Beneficiary 1',
                email: 'beneficiary1@example.com',
                phoneNo: '1234567890',
                address: '123 Main St',
            };
            chai.request(server)
                .post('/admin/add_beneficiary')
                .send(beneficiary)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('beneficiary');
                    res.body.beneficiary.should.have.property('name').eql('Beneficiary 1');
                    done();
                });
        });

        it('it should not add a beneficiary with missing fields', (done) => {
            const beneficiary = {
                name: 'Beneficiary 1',
            };
            chai.request(server)
                .post('/admin/add_beneficiary')
                .send(beneficiary)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
    });

    describe('/DELETE delete_beneficiary', () => {
        it('it should delete a beneficiary', (done) => {
            const beneficiary = new Beneficiary({
                _id: 'beneficiary1',
                name: 'Beneficiary 1',
                email: 'beneficiary1@example.com',
                phoneNo: '1234567890',
                address: '123 Main St',
            });
            beneficiary.save((err, beneficiary) => {
                chai.request(server)
                    .delete('/admin/delete_beneficiary')
                    .send({ beneficiary_id: 'beneficiary1' })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Beneficiary deleted successfully');
                        done();
                    });
            });
        });

        it('it should not delete a beneficiary if not found', (done) => {
            chai.request(server)
                .delete('/admin/delete_beneficiary')
                .send({ beneficiary_id: 'beneficiary1' })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
    });

    describe('/GET get_donors', () => {
        it('it should GET all the donors', (done) => {
            const donor1 = new Donor({
                _id: 'donor1',
                name: 'Donor 1',
                email: 'donor1@example.com',
                phoneNo: '1234567890',
                address: '123 Main St',
            });
            const donor2 = new Donor({
                _id: 'donor2',
                name: 'Donor 2',
                email: 'donor2@example.com',
                phoneNo: '0987654321',
                address: '456 Elm St',
            });
            donor1.save((err, donor1) => {
                donor2.save((err, donor2) => {
                    chai.request(server)
                        .get('/admin/get_donors')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('array');
                            res.body.length.should.be.eql(2);
                            done();
                        });
                });
            });
        });

        it('it should GET an empty array if no donors found', (done) => {
            chai.request(server)
                .get('/admin/get_donors')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('/POST add_donor', () => {
        it('it should add a new donor', (done) => {
            const donor = {
                _id: 'donor1',
                name: 'Donor 1',
                email: 'donor1@example.com',
                phoneNo: '1234567890',
                address: '123 Main St',
            };
            chai.request(server)
                .post('/admin/add_donor')
                .send(donor)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('donor');
                    res.body.donor.should.have.property('name').eql('Donor 1');
                    done();
                });
        });

        it('it should not add a donor with missing fields', (done) => {
            const donor = {
                name: 'Donor 1',
            };
            chai.request(server)
                .post('/admin/add_donor')
                .send(donor)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
    });

    describe('/DELETE delete_donor', () => {
        it('it should delete a donor', (done) => {
            const donor = new Donor({
                _id: 'donor1',
                name: 'Donor 1',
                email: 'donor1@example.com',
                phoneNo: '1234567890',
                address: '123 Main St',
            });
            donor.save((err, donor) => {
                chai.request(server)
                    .delete('/admin/delete_donor')
                    .send({ donor_id: 'donor1' })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Donor deleted successfully');
                        done();
                    });
            });
        });

        it('it should not delete a donor if not found', (done) => {
            chai.request(server)
                .delete('/admin/delete_donor')
                .send({ donor_id: 'donor1' })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
    });
});