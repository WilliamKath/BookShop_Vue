<template>
    <div class="signup_container">
        <div class="and_box">
            <!-- 登录块 -->
            <div class="login_box">
                <h2 class="t1">已有账号？</h2>
                <p class="t2">有帐号就登录吧，发现好物！</p>
                <el-button class="login_btn" type="loginbtn" round @click="login">登录</el-button>
            </div>
            <!-- 注册块 -->
            <div class="signup_box">
                <!-- 表单区域 -->
                <h2 class="welcome_text">立即注册</h2>
                <el-form ref="signupFormRef" :model="signupForm" :rules="rules" class="signup_form" label-width="80px">
                    <!-- 用户名 -->
                    <el-form-item prop="userName" inline-message="true">
                        账号<br>
                        <el-input v-model="signupForm.userName" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 密码 -->
                    <el-form-item prop="userPassword">
                        密码<br>
                        <el-input v-model="signupForm.userPassword" type="password" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 邮箱 -->
                    <el-form-item prop="userEmail">
                        邮箱<br>
                        <el-input v-model="signupForm.userEmail" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 手机号 -->
                    <el-form-item prop="userPhone">
                        手机号<br>
                        <el-input v-model="signupForm.userPhone" autocomplete="off"></el-input>
                    </el-form-item>
                    <!-- 验证码 -->
                    <!-- <el-form-item prop="captcha">
                        验证码<br>
                        <el-input v-model="signupForm.captcha" autocomplete="off"></el-input>
                    </el-form-item> -->
                    <!-- 验证码图片 -->
                    <!-- <el-form-item >
                        <img src="../assets/images.jpg" alt="" width="128px" height="33px">
                    </el-form-item> -->
                    <!-- 按钮 -->
                    <el-form-item class="signup_btns">
                        <el-button type="signupbtn" round @click="signup">注册</el-button>
                    </el-form-item>
                </el-form>
            </div>

        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            signupForm: {
                userName: "",
                userPassword: "",
                userEmail: "",
                userPhone: "",
                userRole: 3

            },
            rules: {
                userName: [
                    { required: true, message: '请输入账号！', trigger: 'blur' },
                ],
                userPassword: [
                    { required: true, message: '请输入密码！', trigger: 'blur' },
                ],
                // userEmail: [
                //     { required: true, message: '邮箱不能为空！', trigger: 'blur' },
                // ],
                // userPhone: [
                //     { required: true, message: '手机号不能为空！', trigger: 'blur' },
                // ],
                userEmail: [
                    { required: true, message: "请输入正确的邮箱！", trigger: 'blur', pattern: /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/ }
                ],
                userPhone: [
                    { required: true, message: "请输入正确的手机号！", trigger: 'blur', pattern: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/ }
                ],
                // captcha: [
                //     {required: true, message: ' ', trigger: 'blur'},
                // ] 
            }
        }
    },
    created(){
        this.notice()
    },
    methods: {
        //注册用方法
        signup() {
            this.$refs.signupFormRef.validate(async valid => {
                if (!valid) return;
                const { data: res } = await this.$http.post("signup", this.signupForm);
                if (res.errcode == "0") {
                    this.$message.success(res.errmsg);
                    this.$router.push({ path: "/login" });
                } else {    
                    this.$message.error(res.errmsg);
                }
            })
        },

        login() {
            this.$router.push({ path: "/login" })
        },
        notice() {
            this.$notify.info({
                title: '提示',
                message: '账号注册时邮箱手机号实现正则匹配',
                duration: 0
            });
        },
    }
}
</script>

<style lang="less" scoped>
// 根节点样式
.signup_container {
    background-color: rgb(237, 237, 237);
    height: 100%;
    position: relative;
}

// 并联div样式
.and_box {
    width: 900px;
    position: absolute;
    top: 45%;
    margin-top: -250px;
    left: 40%;
    margin-left: -250px;

    .login_box {
        height: 540px;
        .login_btn{
            margin-top: 290px;
        }
    }
}

// 注册块样式
.signup_box {
    background-color: rgb(255, 255, 255);
    width: 640px;
    height: 540px;
    float: left;

    .welcome_text {
        margin-left: 45%;
    }

    .signup_form {
        text-align: center;

        // 表单
        .el-form-item {
            margin-bottom: 0px;
            width: 300px;
            margin-left: 22%;

            .el-input {}
        }

        // 注册按钮
        .signup_btns {
            margin-top: 40px;

            .el-button {
                background: #D4AF7A;
                width: 230px;
                margin-left: -2%;
            }
        }
    }
}

// 登录块样式
.login_box {
    background-color: rgb(102, 102, 102);
    width: 260px;
    height: 570px;
    float: left;

    .t1 {
        color: white;
        text-align: center;
        margin-top: 20%;
    }

    .t2 {
        color: white;
        text-align: center;
    }

    .el-button {
        margin-left: 30%;
        margin-top: 140%;
        background-color: rgb(102, 102, 102);
        color: white;
        width: 100px;
    }
}</style>