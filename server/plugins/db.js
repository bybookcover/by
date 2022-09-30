module.exports = app => {
  const mongoose = require("mongoose")
  mongoose.connect('mongodb://127.0.0.1:27017/by', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  // 新数据库
  require('require-all')(__dirname + '/../models')
}