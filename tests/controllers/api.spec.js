const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../../server');

// setup chai to use http assertion
chai.use(chaiHttp);

// start our tests
describe('API', () => {

  // GET INDEX TEST
  it('should return json message for request at / GET', async() => {
    const res = await chai.request(server).get(`/`);
    res.should.have.status(200);
    res.should.be.json;
    res.body.should.have.key(`message`);
  });

  // NOTFOUND TEST
  it('should return json error for invalid request', async() => {
    const res = await chai.request(server).get(`/invalidpath`);
    res.should.have.status(404);
    res.should.be.json;
    res.body.should.have.key(`error`);
  });
});