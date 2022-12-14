const Detail = require('../../models/Detail')

module.exports = app => {
  const express = require('express')
  const assert = require('http-assert')
  const jwt = require('jsonwebtoken')
  const AdminUser = require('../../models/AdminUser')

  const Product = require('../../models/Product')
  const Category = require('../../models/Category')
  const router = express.Router({
    mergeParams: true
  })


  // 创建资源
  router.post('/', async (req, res) => {
    const model = await req.Model.create(req.body)
    res.send(model)
  })
  // 更新资源
  router.put('/:id', async (req, res) => {
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
    res.send(model)
  })
  // 删除资源
  router.delete('/:id', async (req, res) => {
    await req.Model.findByIdAndDelete(req.params.id)
    res.send({
      // 返回 success 为true , 前端 $message 提示 成功  
      success: true
    })
  })
  // 资源列表
  router.get('/', async (req, res) => {
    const queryOptions = {}
    if (req.Model.modelName === 'Category') {
      queryOptions.populate = 'parent'
    }
    const items = await req.Model.find().setOptions(queryOptions).limit(100)
    res.send(items)
  })

  // 资源详情
  router.get('/:id', async (req, res) => {
    const model = await req.Model.findById(req.params.id)
    res.send(model)
  })
  // 登录校验中间件
  // const authMiddleware = require('../../middleware/auth')
  const resourceMiddleware = require('../../middleware/resource')
  app.use('/admin/api/rest/:resource', resourceMiddleware(), router)

  // 文件上传中间件 multer 
  const multer = require('multer')
  const MAO = require('multer-aliyun-oss');
  const upload = multer({
    dest: __dirname + '/../../uploads',
    // storage: MAO({
    //   config: {
    //     region: 'oss-cn-zhangjiakou',
    //     accessKeyId: '替换为你的真实id',
    //     accessKeySecret: '替换为你的真实secret',
    //     bucket: 'node-vue-moba'
    //   }
    // })
  })
  app.post('/admin/api/upload',  upload.single('file'), async (req, res) => {
    const file = req.file
    file.url = `http://localhost:3000/uploads/${file.filename}`
    res.send(file)
  })

  app.post('/admin/api/login', async (req, res) => {
    const { username, password } = req.body
    // 1.根据用户名找用户
    // select('+password') 表示 user 取出 password 的密文

    const user = await AdminUser.findOne({ username }).select('+password')
    // assert 异常错误处理插件
    assert(user, 422, '用户不存在')
    // 2.校验密码
    const isValid = require('bcrypt').compareSync(password, user.password)
    assert(isValid, 422, '密码错误')
    // 3.返回token
    // app.get('secret') 密钥
    const token = jwt.sign({ id: user._id }, app.get('secret'))
    res.send({ token })
  })
  
  // 产品详情带目录
  app.get('/admin/api/prodcate', async (req, res) => {
    const prodcate = await Product.aggregate([
      {
        $lookup: {
            from: "categories",
            localField: "categories",    // field in the orders collection
            foreignField: "_id",  // field in the items collection
            as: "fromItems"
        }
      },
      {$project:{item_name:1,item_number:1,icon:1,fromItems:1}}
    ]).limit(100)
    const items = JSON.stringify(prodcate)
    // console.log(items)
    res.send(items)
  })

    // 产品详情带目录
    app.get('/admin/api/detaitem', async (req, res) => {
      const detaitem = await Detail.aggregate([
        {
          $lookup: {
              from: "products",
              localField: "item",    // field in the orders collection
              foreignField: "_id",  // field in the items collection
              as: "detailItems"
          }
        },
        {$project:{name:1,picture:1,item:1,title:1,detailItems:1}}
      ]).limit(100)
      const items = JSON.stringify(detaitem)
      // console.log(items)
      res.send(items)
    })

  // 错误处理函数
  app.use(async (err, req, res, next) => {
    // console.log(err)
    res.status(err.statusCode || 500).send({
      message: err.message
    })
  })
}