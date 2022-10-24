<template>
  <div class="about">
    <h1>{{id ? '编辑' : '新建'}}物品</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="名称">
        <el-input v-model="model.item_name"></el-input>
      </el-form-item>
      <el-form-item label="型号">
        <el-input v-model="model.item_number"></el-input>
      </el-form-item>
      <el-form-item label="所属分类"> 
        <!-- 双向绑定储存到model的categories中 -->
        <el-select v-model="model.categories">
          <!-- for循环 展示 categories 数组中的所有选项 -->
          <el-option v-for="item in categories" :key="item._id"
          :label="item.name" :value="item._id"></el-option>
        </el-select>
      </el-form-item>
       
      <el-form-item label="图标">
        <!-- uploadUrl 在全局配置上传地址 查看main.js -->
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :headers="getAuthHeaders()"
          :show-file-list="false"
          :on-success="afterUpload"
        >
          <img v-if="model.icon" :src="model.icon" :alt="model.item_name" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
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
  data() {
    return {
      categories:[],
      model: {}
    };
  },
  methods: {
    afterUpload(res){
      this.$set(this.model, 'icon', res.url)
      // this.model.icon = res.url
    },
    async fetchCategories() {
      const res = await this.$http.get("rest/categories");
      this.categories = res.data;
    },
    async save() {
      let res;
      if (this.id) {
        res = await this.$http.put(`rest/products/${this.id}`, this.model);
      } else {
        res = await this.$http.post("rest/products", this.model);
      }
      this.$router.push("/products/list");
      this.$message({
        type: "success",
        message: "保存成功"
      });
    },
    async fetch() {
      const res = await this.$http.get(`rest/products/${this.id}`);
      this.model = res.data;
    }
  },
  created() {
    this.fetchCategories();
    this.id && this.fetch();
  }
};
</script>

