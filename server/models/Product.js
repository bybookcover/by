const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  item_name: { type: String },
  item_number: { type: String ,"unique":true},
  icon: { type: String },
  categories: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' },
})

schema.virtual('children', {
  localField: 'item_number',
  foreignField: 'item',
  justOne: false,
  ref: 'Detail'
})

module.exports = mongoose.model('Product', schema)