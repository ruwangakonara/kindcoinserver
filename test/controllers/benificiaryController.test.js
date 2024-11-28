const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const Beneficiary = require('../../models/beneficiary');
const Request = require('../../models/request');

chai.should();
chai.use(chaiHttp);

describe('Beneficiary Controller', () => {
    beforeEach((done) => {
        Beneficiary.deleteMany({}, (err) => {
            Request.deleteMany({}, (err) => {
                done();
            });
        });
    });

    describe('/POST get_my_request', () => {
        it('it should GET the request details', (done) => {
            const request = new Request({
                _id: '12345',
                title: 'Request for Help',
                description: 'We need help with...',
                beneficiary_id: '67890',
                open: false,
                verified: true,
                raised: 1000,
                type: 'goods',
                image1: 'https://via.placeholder.com/150',
                image2: 'https://via.placeholder.com/150',
                image3: 'https://via.placeholder.com/150',
                certificate_image: 'https://via.placeholder.com/150',
            });
            request.save((err, request) => {
                chai.request(server)
                    .post('/beneficiary/get_my_request')
                    .send({ _id: '12345', open: false })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('request');
                        res.body.request.should.have.property('title').eql('Request for Help');
                        done();
                    });
            });
        });

        it('it should not GET the request details if request not found', (done) => {
            chai.request(server)
                .post('/beneficiary/get_my_request')
                .send({ _id: '12345', open: false })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
    });

    describe('/POST get_donations', () => {
        it('it should GET the accepted donations', (done) => {
            const donation = new Request({
                _id: 'donation1',
                title: 'Donation 1',
                value: 100,
                type: 'monetary',
                tokens: 10,
                donor_id: 'donor1',
                request_id: '12345',
                accepted: true,
                verified: false,
            });
            donation.save((err, donation) => {
                chai.request(server)
                    .post('/beneficiary/get_donations')
                    .send({ request_id: '12345', accepted: true, verified: false })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('donations');
                        res.body.donations.should.be.a('array');
                        res.body.donations.length.should.be.eql(1);
                        done();
                    });
            });
        });

        it('it should not GET the donations if none found', (done) => {
            chai.request(server)
                .post('/beneficiary/get_donations')
                .send({ request_id: '12345', accepted: true, verified: false })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
    });

    describe('/POST add_request', () => {
        it('it should add a new request', (done) => {
            const request = {
                _id: '12345',
                title: 'Request for Help',
                description: 'We need help with...',
                beneficiary_id: '67890',
                open: true,
                verified: false,
                raised: 0,
                type: 'goods',
                image1: 'https://via.placeholder.com/150',
                image2: 'https://via.placeholder.com/150',
                image3: 'https://via.placeholder.com/150',
                certificate_image: 'https://via.placeholder.com/150',
            };
            chai.request(server)
                .post('/beneficiary/add_request')
                .send(request)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('request');
                    res.body.request.should.have.property('title').eql('Request for Help');
                    done();
                });
        });

        it('it should not add a request with missing fields', (done) => {
            const request = {
                title: 'Request for Help',
            };
            chai.request(server)
                .post('/beneficiary/add_request')
                .send(request)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
    });

    describe('/DELETE delete_request', () => {
        it('it should delete a request', (done) => {
            const request = new Request({
                _id: '12345',
                title: 'Request for Help',
                description: 'We need help with...',
                beneficiary_id: '67890',
                open: true,
                verified: false,
                raised: 0,
                type: 'goods',
                image1: 'https://via.placeholder.com/150',
                image2: 'https://via.placeholder.com/150',
                image3: 'https://via.placeholder.com/150',
                certificate_image: 'https://via.placeholder.com/150',
            });
            request.save((err, request) => {
                chai.request(server)
                    .delete('/beneficiary/delete_request')
                    .send({ request_id: '12345' })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Request deleted successfully');
                        done();
                    });
            });
        });

        it('it should not delete a request if not found', (done) => {
            chai.request(server)
                .delete('/beneficiary/delete_request')
                .send({ request_id: '12345' })
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
                        .get('/beneficiary/get_beneficiaries')
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
                .get('/beneficiary/get_beneficiaries')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });



    describe('/POST get_my_request', () => {
        it('it should GET the request details', (done) => {
            const request = new Request({
                _id: '12345',
                title: 'Request for Help',
                description: 'We need help with...',
                beneficiary_id: '67890',
                open: false,
                verified: true,
                raised: 1000,
                type: 'goods',
                image1: 'https://via.placeholder.com/150',
                image2: 'https://via.placeholder.com/150',
                image3: 'https://via.placeholder.com/150',
                certificate_image: 'https://via.placeholder.com/150',
            });
            request.save((err, request) => {
                chai.request(server)
                    .post('/beneficiary/get_my_request')
                    .send({ _id: '12345', open: false })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('request');
                        res.body.request.should.have.property('title').eql('Request for Help');
                        done();
                    });
            });
        });

        it('it should not GET the request details if request not found', (done) => {
            chai.request(server)
                .post('/beneficiary/get_my_request')
                .send({ _id: '12345', open: false })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
    });

    describe('/POST get_donations', () => {
        it('it should GET the accepted donations', (done) => {
            const donation = new Request({
                _id: 'donation1',
                title: 'Donation 1',
                value: 100,
                type: 'monetary',
                tokens: 10,
                donor_id: 'donor1',
                request_id: '12345',
                accepted: true,
 verified: false,
            });
            donation.save((err, donation) => {
                chai.request(server)
                    .post('/beneficiary/get_donations')
                    .send({ request_id: '12345', accepted: true, verified: false })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('donations');
                        res.body.donations.should.be.a('array');
                        res.body.donations.length.should.be.eql(1);
                        done();
                    });
            });
        });

        it('it should not GET the donations if none found', (done) => {
            chai.request(server)
                .post('/beneficiary/get_donations')
                .send({ request_id: '12345', accepted: true, verified: false })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
    });

    describe('/POST add_request', () => {
        it('it should add a new request', (done) => {
            const request = {
                _id: '12345',
                title: 'Request for Help',
                description: 'We need help with...',
                beneficiary_id: '67890',
                open: true,
                verified: false,
                raised: 0,
                type: 'goods',
                image1: 'https://via.placeholder.com/150',
                image2: 'https://via.placeholder.com/150',
                image3: 'https://via.placeholder.com/150',
                certificate_image: 'https://via.placeholder.com/150',
            };
            chai.request(server)
                .post('/beneficiary/add_request')
                .send(request)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('request');
                    res.body.request.should.have.property('title').eql('Request for Help');
                    done();
                });
        });

        it('it should not add a request with missing fields', (done) => {
            const request = {
                title: 'Request for Help',
            };
            chai.request(server)
                .post('/beneficiary/add_request')
                .send(request)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
    });

    describe('/DELETE delete_request', () => {
        it('it should delete a request', (done) => {
            const request = new Request({
                _id: '12345',
                title: 'Request for Help',
                description: 'We need help with...',
                beneficiary_id: '67890',
                open: true,
                verified: false,
                raised: 0,
                type: 'goods',
                image1: 'https://via.placeholder.com/150',
                image2: 'https://via.placeholder.com/150',
                image3: 'https://via.placeholder.com/150',
                certificate_image: 'https://via.placeholder.com/150',
            });
            request.save((err, request) => {
                chai.request(server)
                    .delete('/beneficiary/delete_request')
                    .send({ request_id: '12345' })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Request deleted successfully');
                        done();
                    });
            });
        });

        it('it should not delete a request if not found', (done) => {
            chai.request(server)
                .delete('/beneficiary/delete_request')
                .send({ request_id: '12345' })
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
                        .get('/beneficiary/get_beneficiaries')
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
                .get('/beneficiary/get_beneficiaries')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const Beneficiary = require('../../models/beneficiary');

chai.should();
chai.use(chaiHttp);

describe('Beneficiary Controller', () => {
    beforeEach((done) => {
        Beneficiary.deleteMany({}, (err) => {
            done();
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
                .post('/beneficiary/add_beneficiary')
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
                .post('/beneficiary/add_beneficiary')
                .send(beneficiary)
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
                        .get('/beneficiary/get_beneficiaries')
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
                .get('/beneficiary/get_beneficiaries')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('/POST get_beneficiary', () => {
        it('it should GET a beneficiary by the given id', (done) => {
            const beneficiary = new Beneficiary({
                _id: 'beneficiary1',
                name: 'Beneficiary 1',
                email: 'beneficiary1@example.com',
                phoneNo: '1234567890',
                address: '123 Main St',
            });
            beneficiary.save((err, beneficiary) => {
                chai.request(server)
                    .post('/beneficiary/get_beneficiary')
                    .send({ _id: 'beneficiary1' })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('beneficiary');
                        res.body.beneficiary.should.have.property('name').eql('Beneficiary 1');
                        done();
                    });
            });
        });

        it('it should not GET a beneficiary if not found', (done) => {
            chai.request(server)
                .post('/beneficiary/get_beneficiary')
                .send({ _id: 'beneficiary1' })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
    });

    describe('/PUT update_beneficiary', () => {
        it('it should UPDATE a beneficiary given the id', (done) => {
            const beneficiary = new Beneficiary({
                _id: 'beneficiary1',
                name: 'Beneficiary 1',
                email: 'beneficiary1@example.com',
                phoneNo: '1234567890',
                address: '123 Main St',
            });
            beneficiary.save((err, beneficiary) => {
                chai.request(server)
                    .put('/beneficiary/update_beneficiary')
                    .send({ _id: 'beneficiary1', name: 'Updated Beneficiary 1' })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('beneficiary');
                        res.body.beneficiary.should.have.property('name').eql('Updated Beneficiary 1');
                        done();
                    });
            });
        });

        it('it should not UPDATE a beneficiary if not found', (done) => {
            chai.request(server)
                .put('/beneficiary/update_beneficiary')
                .send({ _id: 'beneficiary1', name: 'Updated Beneficiary 1' })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
    });

    describe('/DELETE delete_beneficiary', () => {
        it('it should DELETE a beneficiary given the id', (done) => {
            const beneficiary = new Beneficiary({
                _id: 'beneficiary1',
                name: 'Beneficiary 1',
                email: 'beneficiary1@example.com',
                phoneNo: '1234567890',
                address: '123 Main St',
            });
            beneficiary.save((err, beneficiary) => {
                chai.request(server)
                    .delete('/beneficiary/delete_beneficiary')
                    .send({ _id: 'beneficiary1' })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Beneficiary deleted successfully');
                        done();
                    });
            });
        });

        it('it should not DELETE a beneficiary if not found', (done) => {
            chai.request(server)
                .delete('/beneficiary/delete_beneficiary')
                .send({ _id: 'beneficiary1' })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
    });

    