var express = require('express');
var wagner = require('wagner-core');
var URL_ROOT = 'http://localhost:3000';

describe('Category API', function() {
  var server;
  var Category;

  before(function() {
    var app = express();

    //Bootstrap server
    models = require('./models')(wagner);
    app.use(require('./api')(wagner));

    server = app.listen(3000);

    //Make Category model available in tests
    Category = models.Category();
  });

  after(function(){
    //shut the server down when we're done
    server.close();
  });
  
  /*beforeEach(function(done) {
    //Make sure categories are empty before each test
    Category.remove({}, function(error) {
      assert.ifError(error);
      done();
    });
  });*/

  it('can load a category by id', function(done){
    //create a single category
    Category.create({_id: 'Electronics'}, function(error, response) {
      assert.ifError(error);
      var url = URL_ROOT+'category/id/Electronics';
      //Make an HTTP reqquest to localhost:3000/category/id/electronics
      superagent.get(url, function(error, response){
        assert.ifError(error);
        var result;
        //and make sure we got { _id: 'Electroics'} back
        assert.doesNotThrow(function(){
          result = json.parse(response.text);
        });
        assert.ok(result.category);
        assert.equal(result.category._id, 'Electronics');
        done();
      });
    });
  })
  it('can load all categories that have a certain parent', function(done) {
    var categories = [
      {_id: 'Electronics' },
      {_id: 'Phones', parent: 'Electronics'},
      {_id:'Laptops', parent: 'Electronics'},
      {_id:'Bacon'}
    ];

    //create 4 categories

    Category.create(categories, function(error, categories) {
    //make an HTTP request to localhost:3000/category/parent/Electronics
    superagent.get(url, function(error, response) {
      assert.ifError(error);
      var result;
      assert.doesNotThrow(function() {
        result = JSON.parse(response.text);
      });
      assert.equal(result.categories.length, 2);
      //should be in asceendding order by _id
      assert.equal(result.categories[0]._id, 'Laptops');
      assert.equal(result.categories[1]._id, 'Phones');
      done();
      });
    });
  });
});
