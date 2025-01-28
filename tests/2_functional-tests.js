const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function(done) {
    let projectId = Math.floor(Math.random() * 1000000) 
    test('POST: Create issue with every field', function() {
        chai.request(server)
            .keepOpen()
            .post(`/api/issues/${projectId}`)
            .type('form')
            .send({
                issue_title: 'test issues #1',
                issue_text: 'text for test issue #1',
                created_by: 'Tester #1',
                assigned_to: 'Tester #2',
                status_text: 'early test'
            })
            .end(function(err, res) {
                console.log(res.body);
                assert.equal(res.status, 200);
                assert.equal(res.body.issue_title, 'test issues #1');
                assert.equal(res.body.issue_text, 'text for test issue #1');
                assert.equal(res.body.created_by, 'Tester #1');
                assert.equal(res.body.assigned_to, 'Tester #2');
                assert.equal(res.body.status_text, 'early test');
                assert.isAtMost(Date.parse(res.body.created_on).valueOf(), new Date().valueOf());
                assert.equal(res.body.created_on, res.body.updated_on);
                assert.property(res.body, '_id');
                done();
            })
    })
    test('POST: Create issue with only required fields', function() {
        chai.request(server)
            .keepOpen()
            .post(`/api/issues/${projectId}`)
            .type('form')
            .send({
                issue_title: 'test issues #1',
                issue_text: 'text for test issue #1',
                created_by: 'Tester #1',
            })
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.issue_title, 'test issues #1');
                assert.equal(res.body.issue_text, 'text for test issue #1');
                assert.equal(res.body.created_by, 'Tester #1');
                assert.equal(res.body.assigned_to, '');
                assert.equal(res.body.status_text, '');
                assert.isAtMost(Date.parse(res.body.created_on).valueOf(), new Date().valueOf());
                assert.equal(res.body.created_on, res.body.updated_on);
                assert.property(res.body, '_id');
                done();
            })
    })
    test('POST: Create issue with only required fields', function() {
        chai.request(server)
            .keepOpen()
            .post(`/api/issues/${projectId}`)
            .type('form')
            .send({
                issue_title: 'test issues #1',
                issue_text: 'text for test issue #1'
            })
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.text, '{"error":"required field(s) missing"}');
                done();
            })
    })
});
