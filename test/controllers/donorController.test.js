const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const Donor = require('../../models/donor');
const Donation = require('../../models/donation');

chai.should();
chai.use(chaiHttp);

describe('Donor Controller', () => {
    beforeEach((done) => {
        Donor.deleteMany({}, (err) => {
            Donation.deleteMany({}, (err) => {
                done();
            });
        });
    });

    describe('/POST get_completed_donations', () => {
        it('it should GET the completed donations', (done) => {
            const donation = new Donation({
                _id: 'donation1',
                title: 'Donation 1',
                value: 100,
                type: 'monetary',
                tokens: 10,
                donor_id: 'donor1',
                request_id: 'request1',
                accepted: true,
                verified: true,
                profile_image: 'https://via.placeholder.com/150',
                request_title: 'Request for Help A',
            });
            donation.save((err, donation) => {
                chai.request(server)
                    .post('/donor/get_completed_donations')
                    .send({ donor_id: 'donor1' })
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
                .post('/donor/get_completed_donations')
                .send({ donor_id: 'donor1' })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
    });

    describe('/POST get_donations', () => {
        it('it should GET all the donations for a donor', (done) => {
            const donation1 = new Donation({
                _id: 'donation1',
                title: 'Donation 1',
                value: 100,
                type: 'monetary',
                tokens: 10,
                donor_id: 'donor1',
                request_id: 'request1',
                accepted: true,
                verified: true,
            });
            const donation2 = new Donation({
                _id: 'donation2',
                title: 'Donation 2',
                value: 200,
                type: 'goods',
                tokens: 20,
                donor_id: 'donor1',
                request_id: 'request2',
                accepted: true,
                verified: false,
            });
            donation1.save((err, donation1) => {
                donation2.save((err, donation2) => {
                    chai.request(server)
                        .post('/donor/get_donations')
                        .send({ donor_id: 'donor1' })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('donations');
                            res.body.donations.should.be.a('array');
                            res.body.donations.length.should.be.eql(2);
                            done();
                        });
                });
            });
        });

        it('it should not GET the donations if none found', (done) => {
            chai.request(server)
                .post('/donor/get_donations')
                .send({ donor_id: 'donor1' })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
    });

    describe('/POST add_donation', () => {
        it('it should add a new donation', (done) => {
            const donation = {
                _id: 'donation1',
                title: 'Donation 1',
                value: 100,
                type: 'monetary',
                tokens: 10,
                donor_id: 'donor1',
                request_id: 'request1',
                accepted: true,
                verified: false,
            };
            chai.request(server)
                .post('/donor/add_donation')
                .send(donation)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('donation');
                    res.body.donation.should.have.property('title').eql('Donation 1');
                    done();
                });
        });

        it('it should not add a donation with missing fields', (done) => {
            const donation = {
                title: 'Donation 1',
            };
            chai.request(server)
                .post('/donor/add_donation')
                .send(donation)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
    });

    describe('/DELETE delete_donation', () => {
        it('it should delete a donation', (done) => {
            const donation = new Donation({
                _id: 'donation1',
                title: 'Donation 1',
                value: 100,
                type: 'monetary',
                tokens: 10,
                donor_id: 'donor1',
                request_id: 'request1',
                accepted: true,
                verified: false,
            });
            donation.save((err, donation) => {
                chai.request(server)
                    .delete('/donor/delete_donation')
                    .send({ donation_id: 'donation1' })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Donation deleted successfully');
                        done();
                    });
            });
        });

        it('it should not delete a donation if not found', (done) => {
            chai.request(server)
                .delete('/donor/delete_donation')
                .send({ donation_id: 'donation1' })
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
                        .get('/donor/get_donors')
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
                .get('/donor/get_donors')
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
                .post('/donor/add_donor')
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
                .post('/donor/add_donor')
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
                    .delete('/donor/delete_donor')
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
                .delete('/donor/delete_donor')
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