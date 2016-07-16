var mongoose = require('mongoose');
var Category = require('./category');
var fx = require('./fx');
var productSchema = {
  name:{type:String, required:true},
  //pictures must start with "http://"
  pictures:[{type:String, match:/^http:\/\//i}],
  price:{
    amount:{
      type:Number, 
      required:true,
      set: function(v){ 
      this.approximatePriceUSD = v/(fx()[this.price.currency]||1); 
      return v;
      }
    },
    currency:{type:String, enum:['Rs','USD','EUR'], required:true,
      set: function(v){
        this.approximatePriceUSD = this.price.amount/ (fx()[v]||1); return v;
      }
    }  
  },
  category: Category.categorySchema,
  internal: {
    approximatePriceUSD:Number
  }
};

var productSchema = new mongoose.Schema(productSchema);
var currencySymbols = {
  'Rs':'₹',
  'USD':'$',
  'EUR':'€'
};
productSchema.virtual('displayPrice').get(function(){
  return currencySymbols[this.price.currency] + '' + this.price.amount;
});
productSchema.set('toObject', {virtuals: true});
productSchema.set('toJSON', {virtuals: true});
module.exports = productSchema;
module.exports.productSchema = productSchema;
