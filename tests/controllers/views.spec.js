const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../../server');

// setup chai to use http assertion
chai.use(chaiHttp);

// start our tests
describe('Views:', () => {

  // GET INDEX TEST
  it('should return html template for request at / GET', async() => {
    const res = await chai.request(server).get(`/`);
    res.should.have.status(200);
    res.should.be.html;
  });

  // LOGIN PAGE TEST
  it('should return html template for request at /login GET', async() => {
    const res = await chai.request(server).get(`/login`);
    res.should.have.status(200);
    res.should.be.html;
  });

  // SIGNUP PAGE TEST
  it('should return html template for request at /signup GET', async() => {
    const res = await chai.request(server).get(`/signup`);
    res.should.have.status(200);
    res.should.be.html;
  });

  // NOTFOUND TEST
  it('should return json error for invalid request', async() => {
    const res = await chai.request(server).get(`/invalidpath`);
    res.should.have.status(404);
    res.should.be.json;
    res.body.should.have.key(`error`);
  });
});