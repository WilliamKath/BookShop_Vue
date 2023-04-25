<template>
    <div>
        <el-table :data="userList.slice((currentPage - 1) * pageSize, currentPage * pageSize)" style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" class="table-expand1">
                        <el-form-item label="用户ID：">
                            <span>{{ props.row.userId }}</span>
                        </el-form-item>
                        <el-form-item label="用户名：">
                            <span>{{ props.row.userName }}</span>
                        </el-form-item>
                        <el-form-item label="邮箱：">
                            <span>{{ props.row.userEmail }}</span>
                        </el-form-item>
                        <el-form-item label="手机号：">
                            <span>{{ props.row.userPhone }}</span>
                        </el-form-item>
                        <el-form-item label="地址：">
                            <span>{{ props.row.userAddress }}</span>
                        </el-form-item>

                    </el-form>
                </template>
            </el-table-column>

            <el-table-column label="用户ID" prop="userId">
            </el-table-column>

            <el-table-column label="用户名" prop="userName">
            </el-table-column>

            <el-table-column label="用户权限" prop="userRole">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.userRole == 1" type="success" effect="dark">超级管理员</el-tag>
                    <el-tag v-if="scope.row.userRole == 2" type="danger" effect="dark">管理员</el-tag>
                    <el-tag v-if="scope.row.userRole == 3" type="" effect="dark">普通用户</el-tag>
                </template>
            </el-table-column>

            <el-table-column label="权限设置">
                <template slot-scope="scope">
                    <span v-if="scope.row.userRole == 1">
                        <el-button type="info" disabled icon="el-icon-error">无法变更</el-button>
                    </span>
                    <span v-else>
                        <el-button type="primary" icon="el-icon-s-custom" @click="showEditDialog(scope.row)">变更</el-button>
                    </span>
                </template>
            </el-table-column>

        </el-table>
        <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next" :total="total">
        </el-pagination>

        <!-- 变更权限弹窗 -->
        <el-dialog title="权限变更" :visible.sync="editDialogVisible" :append-to-body="true" @close="editDialogClosed" width="450px">
            <el-form ref="roleFormRef" :model="roleForm" :rules="roleFormRoles">
                <el-form-item label="用户ID" prop="userId">
                    <el-input v-model="roleForm.userId" disabled></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="roleForm.userName" disabled></el-input>
                </el-form-item>
                <el-form-item label="用户权限" prop="userrole">

                    <span v-if="loginRole == 1">
                        <el-select v-model="roleForm.userrole" placeholder="请选择用户权限">
                            <el-option label="管理员" value="2"></el-option>
                            <el-option label="普通用户" value="3"></el-option>
                        </el-select>
                    </span>

                    <span v-if="loginRole == 2">
                        <el-select v-model="roleForm.userrole" placeholder="您无变更权限！"></el-select>
                    </span>
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
            userList: [],
            editDialogVisible: false,
            roleForm: {
                userId: '',
                userName: '',
                userrole: '',
            },
            roleFormRoles: {
                userId: [
                    { required: true, message: "用户ID不能为空！", trigger: 'blur' }
                ],
                userName: [
                    { required: true, message: "用户名不能为空！", trigger: 'blur' }
                ],
                userrole: [
                    { required: true, message: '请选择用户权限', trigger: 'change' },
                ]
            },
            //分页数据
            totalPageData: [],
            // 共几页
            pageNum: 1,
            // 每页显示数量
            pageSize: 10,
            // 当前显示页码
            currentPage: 1,
            // 总共多少条数据
            total: 1,
            // 当前要显示的数据
            dataShow: [],
            loginRole: ''
        }
    },
    created() {
        this.getUserList();
    },
    mounted() {
        this.loginRole = this.cookie.getCookie("LoginRole");
    },
    methods: {
        getUserList() {
            this.$http({
                method: 'get',
                url: 'getUserList'
            })
                .then(res => {
                    console.log("res.data:", res.data);
                    console.log("userList:", res.data.result);
                    this.userList = res.data.result;
                    this.total = res.data.result.length;
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
                })
        },

        onSubmit() {
            this.$refs.roleFormRef.validate(async valid => {
                if (!valid) return;
                //发起修改请求
                this.$http({
                    method: 'put',
                    url: '/setRole',
                    params: {
                        userId: this.roleForm.userId,
                        userrole: this.roleForm.userrole,
                    }
                })
                    .then(res => {
                        if (res.data.errcode != "0") {
                            this.editDialogVisible = false;
                            return this.$message.error(res.data.errmsg);
                        } else {
                            this.$message.success(res.data.errmsg);
                            this.editDialogVisible = false;
                            this.getUserList();
                        }
                    })
            })
        },

        //弹出diaglog
        showEditDialog(form) {
            this.roleForm = form;
            this.editDialogVisible = true;
        },

        //清空表单
        resetForm() {
            this.$refs['roleFormRef'].resetFields();
        },

        editDialogClosed() {
            this.$refs.roleFormRef.resetFields()
        },

        // 以下为分页用方法
        calcPageData() {
            // 计算页数(根据后台数据的条数和每页显示数量算出一共几页,得0时设为1)
            if (this.userList.length > 1) {
                this.pageNum = Math.ceil(this.userList.length / this.pageSize) || 1;
                console.log('总页数:', this.pageNum);
            }
            // 数据分组
            for (let i = 0; i < this.pageNum; i++) {
                // 每一页都是一个数组 形如 [['第一页的数据'],['第二页的数据'],['第三页数据']]
                // 根据每页显示数量 将后台的数据分割到 每一页,假设pageSize为5， 则第一页是1-5条，即slice(0,5)，第二页是6-10条，即slice(5,10)...
                this.totalPageData[i] = this.userList.slice(this.pageSize * i, this.pageSize * (i + 1));
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
    .table-expand1 {
        .el-form-item {
            display: inline-block;
            width: 50%;
        }
    }
}

.page {
    float: right;
}
</style>