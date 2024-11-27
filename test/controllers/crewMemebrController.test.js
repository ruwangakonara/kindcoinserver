const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const CrewMember = require('../../models/crewMember');
const Donation = require('../../models/donation');

chai.should();
chai.use(chaiHttp);

describe('CrewMember Controller', () => {
    beforeEach((done) => {
        CrewMember.deleteMany({}, (err) => {
            Donation.deleteMany({}, (err) => {
                done();
            });
        });
    });

    describe('/POST verify_donation', () => {
        it('it should verify the donation', (done) => {
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
                    .post('/crew/verify_donation')
                    .send({ donation_id: 'donation1', verified: true })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('donation');
                        res.body.donation.should.have.property('verified').eql(true);
                        done();
                    });
            });
        });

        it('it should not verify the donation if not found', (done) => {
            chai.request(server)
                .post('/crew/verify_donation')
                .send({ donation_id: 'donation1', verified: true })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
    });

    describe('/POST dispatch_tokens', () => {
        it('it should dispatch tokens', (done) => {
            const crewMember = new CrewMember({
                _id: 'crew1',
                name: 'Crew Member 1',
                publicKey: 'GDRXE2BQUC3AZVY4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y',
                secretKey: 'SDRXE2BQUC3AZVY4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y',
            });
            crewMember.save((err, crewMember) => {
                chai.request(server)
                    .post('/crew/dispatch_tokens')
                    .send({ crew_id: 'crew1', amount: 100 })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('transaction');
                        done();
                    });
            });
        });

        it('it should not dispatch tokens if crew member not found', (done) => {
            chai.request(server)
                .post('/crew/dispatch_tokens')
                .send({ crew_id: 'crew1', amount: 100 })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
    });

    describe('/GET get_donations', () => {
        it('it should GET all the donations', (done) => {
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
                donor_id: 'donor2',
                request_id: 'request2',
                accepted: true,
                verified: false,
            });
            donation1.save((err, donation1) => {
                donation2.save((err, donation2) => {
                    chai.request(server)
                        .get('/crew/get_donations')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('array');
                            res.body.length.should.be.eql(2);
                            done();
                        });
                });
            });
        });

        it('it should GET an empty array if no donations found', (done) => {
            chai.request(server)
                .get('/crew/get_donations')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('/POST assign_donation', () => {
        it('it should assign a donation to a crew member', (done) => {
            const crewMember = new CrewMember({
                _id: 'crew1',
                name: 'Crew Member 1',
                publicKey: 'GDRXE2BQUC3AZVY4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y',
                secretKey: 'SDRXE2BQUC3AZVY4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y',
            });
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
            crewMember.save((err, crewMember) => {
                donation.save((err, donation) => {
                    chai.request(server)
                        .post('/crew/assign_donation')
                        .send({ crew_id: 'crew1', donation_id: 'donation1' })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('donation');
                            res.body.donation.should.have.property('crew_id').eql('crew1');
                            done();
                        });
                });
            });
        });

        it('it should not assign a donation if crew member not found', (done) => {
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
                    .post('/crew/assign_donation')
                    .send({ crew_id: 'crew1', donation_id: 'donation1' })
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('error');
                        done();
                    });
            });
        });

        it('it should not assign a donation if donation not found', (done) => {
            const crewMember = new CrewMember({
                _id: 'crew1',
                name: 'Crew Member 1',
                publicKey: 'GDRXE2BQUC3AZVY4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y',
                secretKey: 'SDRXE2BQUC3AZVY4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y',
            });
            crewMember.save((err, crewMember) => {
                chai.request(server)
                    .post('/crew/assign_donation')
                    .send({ crew_id: 'crew1', donation_id: 'donation1' })
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('error');
                        done();
                    });
            });
        });
    });

    describe('/GET get_crew_members', () => {
        it('it should GET all the crew members', (done) => {
            const crewMember1 = new CrewMember({
                _id: 'crew1',
                name: 'Crew Member 1',
                publicKey: 'GDRXE2BQUC3AZVY4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y',
                secretKey: 'SDRXE2BQUC3AZVY4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y',
            });
            const crewMember2 = new CrewMember({
                _id: 'crew2',
                name: 'Crew Member 2',
                publicKey: 'GDRXE2BQUC3AZVY4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y',
                secretKey: 'SDRXE2BQUC3AZVY4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y',
            });
            crewMember1.save((err, crewMember1) => {
                crewMember2.save((err, crewMember2) => {
                    chai.request(server)
                        .get('/crew/get_crew_members')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('array');
                            res.body.length.should.be.eql(2);
                            done();
                        });
                });
            });
        });

        it('it should GET an empty array if no crew members found', (done) => {
            chai.request(server)
                .get('/crew/get_crew_members')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('/POST add_crew_member', () => {
        it('it should add a new crew member', (done) => {
            const crewMember = {
                _id: 'crew1',
                name: 'Crew Member 1',
                publicKey: 'GDRXE2BQUC3AZVY4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y',
                secretKey: 'SDRXE2BQUC3AZVY4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y',
            };
            chai.request(server)
                .post('/crew/add_crew_member')
                .send(crewMember)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('crewMember');
                    res.body.crewMember.should.have.property('name').eql('Crew Member 1');
                    done();
                });
        });

        it('it should not add a crew member with missing fields', (done) => {
            const crewMember = {
                name: 'Crew Member 1',
            };
            chai.request(server)
                .post('/crew/add_crew_member')
                .send(crewMember)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
    });

    describe('/DELETE delete_crew_member', () => {
        it('it should delete a crew member', (done) => {
            const crewMember = new CrewMember({
                _id: 'crew1',
                name: 'Crew Member 1',
                publicKey: 'GDRXE2BQUC3AZVY4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y',
                secretKey: 'SDRXE2BQUC3AZVY4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y4Q6X6JZQ5Y',
            });
            crewMember.save((err, crewMember) => {
                chai.request(server)
                    .delete('/crew/delete_crew_member')
                    .send({ crew_id: 'crew1' })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Crew member deleted successfully');
                        done();
                    });
            });
        });

        it('it should not delete a crew member if not found', (done) => {
            chai.request(server)
                .delete('/crew/delete_crew_member')
                .send({ crew_id: 'crew1' })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
    });
});