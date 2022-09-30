<template>
  <div class="about">
    <h1>{{id ? '编辑' : '新建'}}分类</h1>
    <!--  submit.native.prevent 阻止默认跳转页面  save方法 保存到数据库-->
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="上级分类"> 
        <el-select v-model="model.parent">
          <el-option v-for="item in parents" :key="item._id"
          :label="item.name" :value="item._id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称">
        <!-- 添加name 到model 对象 -->
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    id: {}
  },
  data(){
    return {
      model: {},
      parents: [],
    }
  },
  methods: {
    async save(){
      let res
      // 如果存在 id 修改id的 model 对象
      if (this.id) {
        res = await this.$http.put(`rest/categories/${this.id}`, this.model)
        // 如果不存在 提交model对象到数据库
      } else {
        res = await this.$http.post('rest/categories', this.model)
      }
      // 跳转到 list 
      this.$router.push('/categories/list')
      // element 提供的 $message 方法 提示成功
      this.$message({
        type: 'success',
        message: '保存成功'
      })
    },
    // 获取 id 的信息 赋值到 model 中去
    async fetch(){
      const res = await this.$http.get(`rest/categories/${this.id}`)
      this.model = res.data
    },
    async fetchParents(){
      const res = await this.$http.get(`rest/categories`)
      this.parents = res.data
    },
    
  },
  created(){
    this.fetchParents()
    this.id && this.fetch()
  }
}
</script>
