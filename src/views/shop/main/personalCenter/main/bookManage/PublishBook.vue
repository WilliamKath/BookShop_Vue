<template>
    <div class="form_box">
        <h4 style="color:#424242">发布图书</h4>
        <el-form ref="bookForm" :model="bookForm" :rules="rules" label-width="80px">
            <el-form-item label="图书名" style="width:500px" prop="bookName">
                <el-input v-model="bookForm.bookName"></el-input>
            </el-form-item>
            <el-form-item label="ISBN号" style="width:350px" prop="bookIsbn">
                <el-input v-model.number="bookForm.bookIsbn"></el-input>
            </el-form-item>
            <el-form-item label="价格" style="width:250px" prop="bookPrice">
                <el-input v-model="bookForm.bookPrice"></el-input>
            </el-form-item>
            <el-form-item label="图书种类" prop="bookCategory">
                <el-select v-model="bookForm.bookCategory" placeholder="请选择图书分类">
                    <el-option v-for="item in categoryList" :key="item.categoryId" :label="item.categoryName"
                        :value="item.categoryId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="图书简介" prop="bookOutline">
                <el-input type="textarea" v-model="bookForm.bookOutline"></el-input>
            </el-form-item>
            <el-form-item label="上传图片" prop="files">
                <el-upload class="box_upload" :auto-upload="false" action="" :http-request="uploadFile"
                    accept=".jpg, .jpeg, .png" list-type="picture" :limit="4" :on-exceed="exceed" ref="upload" name="File"
                    :show-file-list="true" :on-change="imgPreview" :before-upload="beforeAvatarUpload" multiple>
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">上传的第一张图片默认为展示主图，只能上传jpg/jpeg/png格式图片，且单个图片不超过2MB</div>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit('bookForm')" style="margin-left:185px">发布图书</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>
    
<script>

export default {
    data() {
        return {
            categoryList: [],   //图书种类列表
            rules: {
                bookName: [
                    { required: true, message: '请输入图书名！', trigger: 'blur' },
                ],
                bookIsbn: [
                    { required: true, message: '请输入ISBN号！', trigger: 'blur' },
                    { type: 'number', message: 'ISBN号为数字！' }
                ],
                bookPrice: [
                    { required: true, message: '请输入价格！', trigger: 'blur' },
                ],
                bookOutline: [
                    { required: true, message: '请输入图书简介！', trigger: 'blur' },
                ],
                bookCategory: [
                    { required: true, message: '请选择图书种类！', trigger: 'change' },
                ],
            },
            uploadForm: new FormData(),
            bookForm: {
                files: [],
                bookName: '',
                bookCategory: '',
                bookIsbn: '',
                bookOutline: '',
                bookPrice: '',
            },
            file: []
        }
    },
    created() {
        this.getCategoryList();
    },
    mounted() {
    },
    methods: {
        uploadFile(param) {
            this.uploadForm.append('files', param.file);
        },
        //提交方法
        onSubmit(bookForm) {
            this.$refs[bookForm].validate((valid) => {
                if (!valid) return;
                this.$refs.upload.submit();
                this.uploadForm.append('bookName', this.bookForm.bookName);
                this.uploadForm.append('bookCategory', this.bookForm.bookCategory);
                this.uploadForm.append('bookIsbn', this.bookForm.bookIsbn);
                this.uploadForm.append('bookOutline', this.bookForm.bookOutline);
                this.uploadForm.append('bookPrice', this.bookForm.bookPrice);
                this.uploadForm.append('bookSeller', this.cookie.getCookie("LoginId"));
                this.uploadForm.append('bookRelease', 0);   //默认审核状态为0，提交由后台管理系统审核
                this.$http.post('/insertBook', this.uploadForm)
                .then(res => {
                    if (res.data.errcode != "0") {
                        this.uploadForm = new FormData();   //清空formdata
                        this.clearFiles();
                        return this.$message.error(res.data.errmsg);
                    } else {
                        this.$refs[bookForm].resetFields(); //上传成功清空表单
                        this.clearFiles();  //清空文件列表
                        this.uploadForm = new FormData();   //清空formdata
                        this.$notify({
                            title: '成功',
                            message: res.data.errmsg,
                            type: 'success'
                        })
                    }
                })
            })

        },
        exceed(files, fileList) {
            return this.$message.error("最多上传4张图片！");
        },
        imgPreview(file, fileList) {
            let fileName = file.name;
            let regex = /(.jpg|.jpeg|.png)$/;
            if (regex.test(fileName.toLowerCase())) {
                this.picUrl = URL.createObjectURL(file.raw);
                this.bookForm.files = fileList;
            } else {
                //移除最后一个元素
                fileList.pop();
                this.$message.error('请注意图片格式！');
            }
        },
        beforeAvatarUpload(file) {
            console.log(file)
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message({
                    message: '上传文件大小不能超过 2MB!',
                    type: 'warning'
                });
            }
            return isLt2M
        },
        //清空文件
        clearFiles() {
            this.$refs['upload'].clearFiles();
        },
        //获取种类列表
        getCategoryList() {
            this.$http.get('/allcategory').then(response => {
                this.categoryList = response.data;
                console.log(this.categoryList);
            })
        },
    }
}
</script>
    
<style lang="less" scoped>
.form_box {
    width: 40%;
    margin-left: 25%;
    background-color: #fff;
    padding: 30px;
}
</style>