<template>
    <div>
        <div class="main_box">
            <el-descriptions class="margin-top" title="我的信息" :column="1" size="medium" border>
                <template slot="extra">
                    <el-button type="primary" size="small" @click="showEditDialog">修改信息</el-button>
                </template>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-user"></i>
                        用户名
                    </template>
                    <p>{{ userInfo.userName }}</p>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-mobile-phone"></i>
                        手机号
                    </template>
                    <p>{{ userInfo.userPhone }}</p>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-message"></i>
                        邮箱
                    </template>
                    <p>{{ userInfo.userEmail }}</p>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-location-outline"></i>
                        收货地址
                    </template>
                    <p>{{ userInfo.userAddress }}</p>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">

                        <i class="el-icon-s-finance"></i>
                        钱包
                    </template>
                    <el-popover placement="bottom" width="200" trigger="hover" content="只有当图书被收货后金额才能到钱包哦！">
                        <p slot="reference">￥ {{ userInfo.userWallet }} 元</p>
                    </el-popover>
                </el-descriptions-item>
            </el-descriptions>
        </div>

        <!-- 弹窗表单区域 -->
        <div>
            <el-dialog title="修改信息" :visible.sync="editDialogVisible" width="500px">
                <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
                    <el-form-item label="用户名" prop="userName">
                        <el-input v-model="editForm.userName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="userPhone">
                        <el-input v-model="editForm.userPhone"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="userEmail">
                        <el-input v-model="editForm.userEmail"></el-input>
                    </el-form-item>
                    <el-form-item label="收货地址" prop="userAddress">
                        <el-input v-model="editForm.userAddress" type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog_footer">
                    <el-button @click="editDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="editUserInfo">保存</el-button>
                </span>
            </el-dialog>
        </div>
    </div>

    <!-- 弹窗表单区域 -->
</template>
    
<script>

export default {
    data() {
        return {
            userInfo: [],
            userId: '',
            editDialogVisible: false,
            editForm: {
                userName: "",
                userEmail: "",
                userPhone: "",
                userAddress: "",
            },
            //修改校验规则
            editFormRules: {
                userEmail: [
                    { required: true, message: "请输入正确的邮箱！", trigger: 'blur', pattern: /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/ }
                ],
                userPhone: [
                    { required: true, message: "请输入正确的手机号！", trigger: 'blur', pattern: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/ }
                ],
                userAddress: [
                    { required: true, message: "请输入正确的地址！", trigger: 'blur', pattern: /^[\u0391-\uFFE5A-Za-z]+$/ }
                ]
            }

        }
    },
    created() {
        this.userId = this.cookie.getCookie("LoginId");
        this.getUserInfo('userInfo');
    },
    mounted() {
    },
    methods: {
        getUserInfo(get) {
            this.$http({
                method: 'get',
                url: '/getuser',
                params: {
                    userId: this.userId
                }
            })
                .then(res => {
                    if (get == 'editForm') {
                        this.editForm = res.data.result;
                        console.log(this.editForm);

                    } else {
                        this.userInfo = res.data.result;
                        console.log(this.userInfo);
                    }
                })
        },

        //弹出修改表单
        showEditDialog() {
            this.getUserInfo('editForm');
            this.editDialogVisible = true;
        },

        //保存修改后的表单信息
        editUserInfo() {
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return;
                //发起修改请求
                const { data: res } = await this.$http.put("updateuser", this.editForm);
                if (res.errcode != "0") {
                    return this.$message.error("修改失败！");
                } else {
                    this.$message.success("修改成功！");
                    this.editDialogVisible = false;
                    this.userInfo = res.result;
                }
            })
        }
    }
}
</script>
    
<style lang="less" scoped>
.main_box {
    margin: 50px 0px 0px 600px;
    width: 400px;
}
</style>