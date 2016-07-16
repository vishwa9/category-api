var express = require('express');

var status = require('http-status');
var bodyParser = require('body-parser');

module.exports = function(wagner){
  var api = express.Router();

  api.get('/category/id/:id', wagner.invoke(function(Category){
    return function(req, res){
      Category.findOne({_id: req.params.id}, function(error, category){
        if(error){
          return res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString() });
        }
        if(!category){
          return res.status(status.NOT_FOUND).json({error:'Not Found'});
        }
        res.json({category:category});
      });
    };
  }));

  api.post('/category/create', wagner.invoke(function(Category){
    return function(req, res){

      var category = new Category();

      category['_id'] = req.body['_id'];
      category.parent = req.body.parent;
      category.ancestors = req.body.ancestors;

      category.save(function(error){
        if(error){
          return res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
        }
        res.json({message: 'Created'});
      });
    };
  }));

  api.get('/category/parent/:id', wagner.invoke(function(Category){
    return function(req, res) {
      Category.find({parent:req.params.id}).sort({_id:1}).exec(function(error, categories) {
        if(error) {
          return res.status(status.INTERNAL_SERVER_ERROR).json({error:error.toString()});
        }
        res.json({categories: categories});
      });
    };
  }));
  api.post('/product/create',wagner.invoke(function(Product){
    return function(req, res){
      var product =new Product();
      product.name = req.body.name;
      product.price.amount = req.body.price.amount;
      product.category = req.body.Category.categorySchema;
      product.price.currency = req.body.price.currency;

      product.save(function(error){
        if(error){
          return res.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
        }
        res.json({message: 'product created successfully'});
      });
    };
  }));
  api.get('/product/id/:id', wagner.invoke(function(Product){
    return function(req, res){
      Product.findOne({ _id: req.params.id},
        handleOne.bind(null, 'product', res));
    };
  }));
  api.get('/product/category/:id', wagner.invoke(function(Product) {
    return function(req, res){
      var sort = {name: 1};
      if(req.query.price==="1"){
        sort = {'internal.approximatePriceUSD':1};
      }else if(req.query.price==="-1"){
        sort = {'internal.approximatePriceUSD':-1};
      }
      Product.find({'category.ancestors': req.params.id}).sort(sort).exec(handleMany.bind(null,'products', res));
    };
  }));
  return api;
}
function handleOne(property, response, error, result){
  if(error) {
    return response.status(status.INTERNAL_SERVER_ERROR).json({error: error.toString()});
  }
  if(!result){
    console.log("result", result);
    return response.status(status.NOT_FOUND).json({error: 'NOT FOUND'});
  }
  var json = {};
  json[property] = result;
  response.json(json);
}
function handleMany(property, response, error, result){
  if(error){
    return response.status(status.INTERNAL_SERVER_ERROR).json({error:error.toString()});
  }
  if(!result){
    return response.status(status.NOT_FOUND).json({error: 'NOT_FOUND'});
  }
  var json = {};
  json[property] = result;
  response.json(json);
}