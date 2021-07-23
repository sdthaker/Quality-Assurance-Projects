/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const libraryModel = require('../models/lib') 

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({title: 'to be deleted'})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.body, {_id: res.body._id, title: res.body.title})
          done();
        })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.text, 'missing required field title')
          done();
      });
    });
  })

    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.isArray(res.body)
          assert.property(res.body[0], 'comments')
          assert.property(res.body[0], 'commentcount')
          assert.property(res.body[0], '_id')
          assert.property(res.body[0], 'title')
          assert.deepEqual(res.body[0], {comments:res.body[0].comments, commentcount:res.body[0].commentcount,_id:res.body[0]._id, title: res.body[0].title, __v:res.body[0].__v})
          done();
        });
      });      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/60f56b8c80d8f30591c3d003')
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.text, 'no book exists')
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  async function() {

        let foundID = await libraryModel.find({}).exec()

        chai.request(server)
        .get(`/api/books/${foundID[0]._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.isObject(res.body)
          assert.property(res.body, 'comments')
          assert.property(res.body, 'commentcount')
          assert.property(res.body, '_id')
          assert.property(res.body, 'title')
          assert.deepEqual(res.body, {comments:res.body.comments, commentcount:res.body.commentcount,_id: res.body._id, title: res.body.title , __v:res.body.__v})
        });
      });
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', async function(){

        let foundID = await libraryModel.find({}).exec()

        chai.request(server)
        .post(`/api/books/${foundID[0]._id}`)
        .send({comment: 'comm'})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.isArray(res.body.comments)
          assert.property(res.body, 'comments')
          assert.property(res.body, 'commentcount')
          assert.property(res.body, '_id')
          assert.property(res.body, 'title')
          assert.deepEqual(res.body, {comments: res.body.comments, commentcount: res.body.commentcount, _id: res.body._id, title: res.body.title, __v: res.body.__v})
        })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
        .post('/api/books/60f56b8c80d8f30591c3d003')
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.text, 'missing required field comment')
          done();
        })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
        .post('/api/books/60f56b8c80d8f30591c3d003')
        .send({comment: "comment"})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.text, 'no book exists')
          done();
        })
      });
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {
     
      test('Test DELETE /api/books/[id] with valid id in db', async function(){
        const foundDoc = await libraryModel.findOne({title: 'to be deleted'})

        chai.request(server)
        .delete(`/api/books/${foundDoc._id}`)
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.text, 'delete successful')
        })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
        .delete('/api/books/60f56b8c80d8f30591c3d003')
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.deepEqual(res.text, 'no book exists')
          done();
        })
      });
    })

  });

});

