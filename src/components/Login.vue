<template>
    <div class="login_container">
        <div class="and_box">
            <!-- 登录块 -->
            <div class="login_box">
                <!-- 表单区域 -->
                <h2 class="welcome_text">欢迎回来</h2>
                <el-form ref="loginFormRef" :model="loginForm" :rules="rules" class="login_form" label-width="80px">
                    <!-- 用户名 -->
                    <el-form-item prop="userName">
                        账号<br>
                        <el-input v-model="loginForm.userName"></el-input>
                    </el-form-item>
                    <!-- 密码 -->
                    <el-form-item prop="userPassword">
                        密码<br>
                        <el-input v-model="loginForm.userPassword" type="password"></el-input>
                    </el-form-item>
                    <!-- 验证码 -->
                    <!-- <el-form-item prop="captcha">
                        验证码<br>
                        <el-input v-model="loginForm.captcha"></el-input>
                    </el-form-item> -->
                    <!-- 验证码图片 -->
                    <!-- <el-form-item >
                        <img src="../assets/images.jpg" alt="" width="128px" height="33px">
                    </el-form-item> -->
                    <!-- 忘记密码 -->
                    <!-- <el-form-item >
                        <a href="#" color="#CFCFCF">忘记密码？</a>
                    </el-form-item> -->
                    <!-- 按钮 -->
                    <el-form-item class="login_btns">
                        <el-button type="loginbtn" round @click="login">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 注册块 -->
            <div class="signup_box">
                <h2 class="t1">还未注册？</h2>
                <p class="t2">立即注册，让闲置不再是闲置！</p>
                <el-button type="signupbtn" round @click="signup">注册</el-button>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            loginForm: {
                userName: "",
                userPassword: "",
            },
            rules: {
                userName: [
                    { required: true, message: "账号不能为空", trigger: 'blur' }
                ],
                userPassword: [
                    { required: true, message: "密码不能为空", trigger: 'blur' }
                ],
                // captcha: [
                //     {required: true, message: "验证码不能为空", trigger: 'blur'}
                // ]
            }
        }
    },
    created() {
        this.notice()
    },
    methods: {
        //登录用方法
        login() {
            //1.先进行表单验证
            this.$refs.loginFormRef.validate(async valid => {
                if (!valid) return;    //验证失败退出
                const { data: res } = await this.$http.post("login", this.loginForm);   //2.验证成功访问后台对应方法
                if (res.errcode == "0") {   //3.对返回值进行判断             
                    let loginInfo = {
                        LoginId: res.result.userId,
                        LoginName: res.result.userName,
                        LoginRole: res.result.userRole
                    }
                    let UserInfo = {
                        userId: res.result.userId,
                        userName: res.result.userName,
                    }
                    this.cookie.setCookie(loginInfo, 7);  //调用setCookie方法存储cookie 7天
                    sessionStorage.setItem('user', JSON.stringify(UserInfo));
                    this.$message.success(res.errmsg);
                    let Role = this.cookie.getCookie("LoginRole");
                    if (Role != '3') {
                        this.$router.push({ path: "/admin/home" }); //4.对应路由跳转
                    } else {
                        this.$router.push({ path: "/shop" }); //4.对应路由跳转
                    }



                } else {
                    this.$message.error(res.errmsg);  //5.对应错误提示
                }
            })
        },
        signup() {
            this.$router.push({ path: "/signup" })
        },

        notice() {
            this.$notify.info({
                title: '提示',
                message: '默认超级管理账号密码：admin\n或注册新账号',
                duration: 0
            });
        },
    },
}
</script>

<style lang="less" scoped>
// 根节点样式
.login_container {
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
}

// 登录块样式
.login_box {
    background-color: rgb(255, 255, 255);
    width: 640px;
    height: 540px;
    float: left;

    .welcome_text {
        margin-left: 45%;
    }

    .login_form {
        text-align: center;

        // 表单
        .el-form-item {
            width: 300px;
            margin-left: 22%;

            .el-input {}
        }

        // 登录按钮
        .login_btns {
            margin-top: 200px;

            .el-button {
                background: #D4AF7A;
                width: 230px;
                margin-left: -0%;
            }
        }
    }
}

// 注册块样式
.signup_box {
    background-color: rgb(102, 102, 102);
    width: 260px;
    height: 540px;
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
        margin-top: 310px;
        background-color: rgb(102, 102, 102);
        color: white;
        width: 100px;
    }
}</style>