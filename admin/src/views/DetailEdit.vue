<template>
  <div class="about">
    <h1>{{id ? '编辑' : '新建'}}详情</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
       
          <el-form-item label="标题">
            <el-input v-model="model.title"></el-input>
          </el-form-item>

          <el-form-item label="主图">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :headers="getAuthHeaders()"
              :show-file-list="false"
              :on-success="res => $set(model, 'picture', res.url)"
            >
              <img v-if="model.picture" :src="model.picture" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item label="型号">
            <!-- multiple 定义可以多选 -->
            <el-select filterable v-model="model.item">
              <el-option 
                v-for="item in items"
                :key="item._id"
                :label="item.item_number"
                :value="item._id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="关键字">
            <el-input v-model="model.keywords"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="model.description"></el-input>
          </el-form-item>

          <el-form-item label="主体内容">
            <vue-editor v-model="model.body"></vue-editor>
          </el-form-item>

          <el-form-item label="标签">
            <el-input v-model="model.tips"></el-input>
          </el-form-item>


      <el-form-item style="margin-top: 1rem;">
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { VueEditor } from "vue2-editor";

export default {
  props: {
    id: {}
  },
  components: {
    VueEditor
  },
  data() {
    return { 
      items: [],
      model: {}
    };
  },
  methods: {
    async save() {
      let res; // eslint-disable-line no-unused-vars
      if (this.id) {
        res = await this.$http.put(`rest/details/${this.id}`, this.model);
      } else {
        res = await this.$http.post("rest/details", this.model);
      }
      this.$router.push("/details/list");
      this.$message({
        type: "success",
        message: "保存成功"
      });
    },
    async fetch() {
      const res = await this.$http.get(`rest/details/${this.id}`);
      // this.model = Object.assign({}, this.model, res.data);
      this.model = {...this.model,...res.data}
    },

    async fetchProducts() {
      const res = await this.$http.get("rest/products");
      this.items = res.data;
    },
  },
  created() {
    this.fetchProducts();
    this.id && this.fetch();
  }
};
</script>
