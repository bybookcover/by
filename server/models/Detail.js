const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  item: { type: mongoose.SchemaTypes.ObjectId, ref: 'Product' },
  name: { type: String },
  picture: { type: String },
  title: { type: String },
  keywords: { type: String },
  description: { type: String },
  body: { type: String },
  tips: { type: String },
})


module.exports = mongoose.model('Detail', schema, 'details')