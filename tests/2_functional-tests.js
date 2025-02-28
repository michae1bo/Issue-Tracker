const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function(done) {
    let projectId = Math.floor(Math.random() * 1000000) 
    let ids = [];
    test('POST: Create issue with every field', function (done) {
        chai.request(server)
            .keepOpen()
            .post(`/api/issues/${projectId}`)
            .type('form')
            .send({
                issue_title: 'test issues #1',
                issue_text: 'text for test issue #1',
                created_by: 'Tester #1',
                assigned_to: 'Tester',
                status_text: 'early test'
            })
            .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.issue_title, 'test issues #1');
                assert.equal(res.body.issue_text, 'text for test issue #1');
                assert.equal(res.body.created_by, 'Tester #1');
                assert.equal(res.body.assigned_to, 'Tester');
                assert.equal(res.body.status_text, 'early test');
                assert.isAtMost(Date.parse(res.body.created_on).valueOf(), new Date().valueOf());
                assert.equal(res.body.created_on, res.body.updated_on);
                assert.property(res.body, '_id');
                ids.push(res.body._id);
                done();
            })
    })
    test('POST: Create issue with only required fields', function (done) {
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
                ids.push(res.body._id);
                done();
            })
    })
    test('POST: Create issue without all the required fields', function (done) {
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
    test('GET: View issues on a project', function (done) {
        chai.request(server)
            .keepOpen()
            .get(`/api/issues/${projectId}`)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.length, 2);
                assert.equal(res.body[0].issue_title, 'test issues #1');
                assert.equal(res.body[0].issue_text, 'text for test issue #1');
                assert.equal(res.body[0].created_by, 'Tester #1');
                assert.equal(res.body[0].assigned_to, 'Tester');
                assert.equal(res.body[0].status_text, 'early test');
                assert.isAtMost(Date.parse(res.body[0].created_on).valueOf(), new Date().valueOf());
                assert.equal(res.body[0].created_on, res.body[0].updated_on);
                assert.equal(res.body[0]._id, ids[0]);
                assert.equal(res.body[1].issue_title, 'test issues #1');
                assert.equal(res.body[1].issue_text, 'text for test issue #1');
                assert.equal(res.body[1].created_by, 'Tester #1');
                assert.equal(res.body[1].assigned_to, '');
                assert.equal(res.body[1].status_text, '');
                assert.isAtMost(Date.parse(res.body[1].created_on).valueOf(), new Date().valueOf());
                assert.equal(res.body[1].created_on, res.body[1].updated_on);
                assert.equal(res.body[1]._id, ids[1]);
                done();
            })
    })
    test('GET: View issues with one filter', function (done) {
        chai.request(server)
            .keepOpen()
            .get(`/api/issues/${projectId}?&assigned_to=Tester`)
            .end(function (err, res) { 
                assert.equal(res.status, 200);
                assert.equal(res.body.length, 1);
                assert.equal(res.body[0].issue_title, 'test issues #1');
                assert.equal(res.body[0].issue_text, 'text for test issue #1');
                assert.equal(res.body[0].created_by, 'Tester #1');
                assert.equal(res.body[0].assigned_to, 'Tester');
                assert.equal(res.body[0].status_text, 'early test');
                assert.isAtMost(Date.parse(res.body[0].created_on).valueOf(), new Date().valueOf());
                assert.equal(res.body[0].created_on, res.body[0].updated_on);
                assert.equal(res.body[0]._id, ids[0]);
                done();
            })
    })
    test('GET: View issues with two filter', function (done) {
        chai.request(server)
            .keepOpen()
            .get(`/api/issues/${projectId}?&assigned_to=Tester&open=false`)
            .end(function (err, res) { 
                assert.equal(res.status, 200);
                assert.equal(res.body.length, 0);
                done();
            })
    })
    test('PUT: Update one field on an issue', function (done) {
        chai.request(server)
            .keepOpen()
            .put(`/api/issues/${projectId}`)
            .type('form')
            .send({
                _id: ids[0],
                issue_title: "new title"
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.text, `{"result":"successfully updated","_id":"${ids[0]}"}`);
                done();
            })
    })
    test('PUT: Update multiple fields', function (done) {
        chai.request(server)
            .keepOpen()
            .put(`/api/issues/${projectId}`)
            .type('form')
            .send({
                _id: ids[1],
                issue_text: "new text",
                open: 'false'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.text, `{"result":"successfully updated","_id":"${ids[1]}"}`);
                done();
            })
    })
    test('PUT: Update with missing _id', function (done) {
        chai.request(server)
            .keepOpen()
            .put(`/api/issues/${projectId}`)
            .type('form')
            .send({
                issue_text: "new text",
                open: 'false'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.text, '{"error":"missing _id"}');
                done();
            })
    })
    test('PUT: Update with no fields to update', function (done) {
        chai.request(server)
            .keepOpen()
            .put(`/api/issues/${projectId}`)
            .type('form')
            .send({
                _id: ids[1]
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.text, `{"error":"no update field(s) sent","_id":"${ids[1]}"}`);
                done();
            })
    })
    test('PUT: Update with invalid _id', function (done) {
        chai.request(server)
            .keepOpen()
            .put(`/api/issues/${projectId}`)
            .type('form')
            .send({
                _id: 'invalid',
                issue_text: 'this is a cool new text'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.text, '{"error":"could not update","_id":"invalid"}');
                done();
            })
    })
    test('DELETE: Delete an issue', function (done) {
        chai.request(server)
            .keepOpen()
            .delete(`/api/issues/${projectId}`)
            .type('form')
            .send({
                _id: ids[1]
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.text, `{"result":"successfully deleted","_id":"${ids[1]}"}`);
                done();
            })
    })
    test('DELETE: Delete an issue with invalid _id', function (done) {
        chai.request(server)
            .keepOpen()
            .delete(`/api/issues/${projectId}`)
            .type('form')
            .send({
                _id: 'invalid'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.text, '{"error":"could not delete","_id":"invalid"}');
                done();
            })
    })
    test('DELETE: Delete an issue with missing _id', function (done) {
        chai.request(server)
            .keepOpen()
            .delete(`/api/issues/${projectId}`)
            .type('form')
            .send({
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.text, '{"error":"missing _id"}');
                done();
            })
    })
});
