<template>
    <div>
        <el-table :data="bookList.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" class="table-expand">
                        <el-form-item label="图书ID：">
                            <span>{{ props.row.bookId }}</span>
                        </el-form-item>
                        <el-form-item label="卖家：">
                            <span>{{ props.row.seller.sellerName }}</span>
                        </el-form-item>
                        <el-form-item label="书名：">
                            <span>{{ props.row.bookName }}</span>
                        </el-form-item>
                        <el-form-item label="ISBN号：">
                            <span>{{ props.row.bookIsbn }}</span>
                        </el-form-item>
                        <el-form-item label="分类：">
                            <span>{{ props.row.bookCategory }}</span>
                        </el-form-item>
                        <el-form-item label="价格：">
                            <span>{{ props.row.bookPrice }}元</span>
                        </el-form-item>
                        <el-form-item label="描述：">
                            <span>{{ props.row.bookOutline }}</span>
                        </el-form-item>
                        <el-form-item label="图书图片：">
                            <!-- <ul v-for="(img, index) in props.row.bookImgList" :key="index" class="img_ul">
                            <li>
                                <el-image :src="imgTool.getImgURL(img.imgUrl)" style="width: 80px; height: 80px"></el-image>
                            </li>
                        </ul> -->
                            <div v-for="(img, index) in props.row.bookImgList" :key="index" class="img_box">
                                <el-image :fit="scale - down" :src="imgTool.getImgURL(img.imgUrl)"
                                    :preview-src-list="[imgTool.getImgURL(img.imgUrl)]"></el-image>
                            </div>
                        </el-form-item>

                    </el-form>
                </template>
            </el-table-column>
            <el-table-column label="图书ID" prop="bookId">
            </el-table-column>
            <el-table-column label="图书名称" prop="bookName">
            </el-table-column>
            <el-table-column label="卖家" prop="seller.sellerName">
            </el-table-column>
            <el-table-column label="图书状态" prop="bookRelease" column-key="bookRelease" :filters="releaseList"
                :filter-method="filterHandler" :filter-multiple="false">
                <!-- <template slot-scope="scope">{{ scope.row.bookRelease === 1 ? '男' : '女' }}</template> -->
                <template slot-scope="scope">
                    <!-- <p v-if="scope.row.bookRelease == 0">待审核</p>
                <p v-if="scope.row.bookRelease == 1">审核通过</p>
                <p v-if="scope.row.bookRelease == 2">审核不通过</p> -->
                    <el-tag v-if="scope.row.bookRelease == 0" type="info" effect="dark">待审核</el-tag>
                    <el-tag v-if="scope.row.bookRelease == 1" type="success" effect="dark">审核通过</el-tag>
                    <el-tag v-if="scope.row.bookRelease == 2" type="danger" effect="dark">审核不通过</el-tag>
                    <el-tag v-if="scope.row.bookRelease == 3" type="info" effect="dark">已下架</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="审核图书">
                <template slot-scope="scope">
                    <span v-if="scope.row.bookRelease == 3">
                        <el-button type="info" disabled icon="el-icon-error" @click="showEditDialog(scope.row)">已下架</el-button>
                    </span>
                    <span v-else>
                        <el-button type="primary" icon="el-icon-s-check" @click="showEditDialog(scope.row)">审核</el-button>
                    </span>


                </template>
                <!-- <el-button type="primary" icon="el-icon-s-check" >审核</el-button> -->

            </el-table-column>
        </el-table>
        <el-pagination 
            class="page" 
            @size-change="handleSizeChange" 
            @current-change="handleCurrentChange"
            :current-page="currentPage" 
            :page-sizes="[10, 20, 30, 40]" 
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next" 
            :total="total">
        </el-pagination>

        <el-dialog title="图书审核" :visible.sync="editDialogVisible" :append-to-body="true" width="450px">
            <el-form ref="releaseFormRef" :model="releaseForm" :rules="releaseFormRules">
                <el-form-item label="图书ID" prop="bookId">
                    <el-input v-model="releaseForm.bookId" disabled></el-input>
                </el-form-item>
                <el-form-item label="书名" prop="bookName">
                    <el-input v-model="releaseForm.bookName" disabled></el-input>
                </el-form-item>
                <el-form-item label="审核状态" prop="bookrelease">
                    <el-select v-model="releaseForm.bookrelease" placeholder="请选择审核状态">
                        <el-option label="通过" value="1"></el-option>
                        <el-option label="不通过" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
    
<script>

export default {
    data() {
        return {
            bookList: [],   //图书列表
            editDialogVisible: false,
            releaseForm: {
                bookId: '',
                bookName: '',
                bookrelease: '',
            },
            releaseFormRules: {
                bookId: [
                    { required: true, message: "图书ID不能为空！", trigger: 'blur' }
                ],
                bookName: [
                    { required: true, message: "图书名不能为空！", trigger: 'blur' }
                ],
                bookrelease: [
                    { required: true, message: '请选择审核状态', trigger: 'change' },
                ]
            },
            releaseList: [
                { text: '待审核', value: '0' },
                { text: '审核通过', value: '1' },
                { text: '审核不通过', value: '2' },
            ],
            // 分页数据,这里用来保存每页切割后的数据
            // 看起来格式是这样的[[{},{},{}],[{},{},{}]]
            // 数组内套数组，每个数组就是一页数据
            totalPageData: [],
            // 共几页
            pageNum:1,
            // 每页显示数量
            pageSize:10,
            // 当前显示页码
            currentPage:1,
            // 总共多少条数据
            total:1,
            // 当前要显示的数据
            dataShow:[]       
        }
    },
    created() {
        this.getBookList();
    },
    mounted() {
    },
    methods: {
        getBookList() {
            this.$http({
                method: 'get',
                url: '/getBookList',
            })
                .then(res => {
                    this.bookList = res.data.result;
                    this.total = res.data.result.length;
                    this.calcPageData();
                    if (res.data.errcode != "0") {
                        return this.$notify({
                            title: '警告',
                            message: res.data.errmsg,
                            type: 'warning'
                        });
                    } else {
                        this.$notify({
                            title: '成功',
                            message: res.data.errmsg,
                            type: 'success'
                        });
                    }
                    console.log("bookList",res.data.result)
                })
        },
        onSubmit() {
            this.$refs.releaseFormRef.validate(async valid => {
                if (!valid) return;
                //发起修改请求
                this.$http({
                    method: 'put',
                    url: '/releaseBook',
                    params: {
                        bookId: this.releaseForm.bookId,
                        bookrelease: this.releaseForm.bookrelease,
                    }
                })
                    .then(res => {
                        if (res.data.errcode != "0") {
                            this.editDialogVisible = false;
                            return this.$message.error(res.data.errmsg);
                        } else {
                            this.$message.success(res.data.errmsg);
                            this.editDialogVisible = false;
                            this.getBookList();
                        }
                    })
            })
        },
        //筛选符合条件表头数据
        filterHandler(value, row, column) {
            const property = column["property"];
            return row[property] == value;  //！！！是== 不是===
        },

        //弹出diaglog
        showEditDialog(form) {
            this.releaseForm = form;
            this.editDialogVisible = true;
            console.log("this.releaseForm",form);
        },

        //清空表单
        resetForm() {
            console.log("resetForm");
            this.$refs['releaseFormRef'].resetFields();
        },
        
        calcPageData() {
            // 计算页数(根据后台数据的条数和每页显示数量算出一共几页,得0时设为1)
            if (this.bookList.length > 1) {
                this.pageNum = Math.ceil(this.bookList.length / this.pageSize) || 1;
                console.log('总页数:', this.pageNum);
            }
            // 数据分组
            for (let i = 0; i < this.pageNum; i++) {
                // 每一页都是一个数组 形如 [['第一页的数据'],['第二页的数据'],['第三页数据']]
                // 根据每页显示数量 将后台的数据分割到 每一页,假设pageSize为5， 则第一页是1-5条，即slice(0,5)，第二页是6-10条，即slice(5,10)...
                this.totalPageData[i] = this.bookList.slice(this.pageSize * i, this.pageSize * (i + 1));
            }
            // 获取到数据后显示第一页内容,数组下标是从0开始的，这里一定要减去1，不然会丢失一组数据
            this.dataShow = this.totalPageData[this.currentPage - 1];
            console.log(this.dataShow);
        },

        // 每页条数发生变化
        handleSizeChange(newPageSize) {
            this.pageSize = newPageSize;
            // 重新计算页数并分组
            this.calcPageData();
        },

        // 当前页码发生变化
        handleCurrentChange(newPageNum) {
            console.log('当前页码:', newPageNum);
            this.currentPage = newPageNum;
            // 这里仍然不要忘记减去1
            this.dataShow = this.totalPageData[newPageNum - 1];
        },
    }
}
</script>
    
<style lang="less" scoped>
.el-table {
    .table-expand {
        font-size: 0;
    }

    .table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .table-expand .el-form-item {
        padding-left: 50px;
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }

    .img_box {
        display: inline-block;
        margin-left: 10px;
        width: 120px;
        height: 120px;
    }
}
.page{
    float: right;
}
</style>