<template>
    <div>
        <el-container>
            <el-header height="200px">
                <div class="top">
                    <p class="text">校园二手商城，让您的闲置商品不再闲置，发现更多好玩好物！</p>
                    <div class="login_box">
                        <div v-if="loginname != ''">
                            <p style="float:left;margin-top:1px;margin-right:5px">{{ loginname }}</p>
                            <a href="#" @click="exit" style="float:left;">退出登录</a>
                        </div>
                        <a href="/login" v-else>登录&注册</a>
                    </div>
                </div>
                <div class="header">
                    <div class="logo">
                        <img src="@/assets/img/main/logo.jpg" height="90px" width="140px" style="float:left">
                    </div>
                    <div class="tab">
                        <el-menu :default-active="this.$route.path" class="el_menu" mode="horizontal" router>
                            <el-menu-item index="/main">首页</el-menu-item>
                            <el-menu-item index="/show">全部商品</el-menu-item>
                            <el-menu-item index="/cart">购物车</el-menu-item>
                            <el-menu-item index="/my/welcome">个人中心</el-menu-item>
                            <el-menu-item index="/notice">网站公告</el-menu-item>
                        </el-menu>
                    </div>

                </div>

            </el-header>
            <el-main>
                <div class="success_box">
                    <p>{{ this.text }}</p>
                    <el-button type="primary" round @click="ToCart">返回购物车</el-button>
                    <el-button type="warning" round @click="ToBuyHistory">查看购买记录</el-button>
                </div>
            </el-main>
            <el-footer>
                <p style="text-align:center;font-size:10px">买卖二手书，就上二手图书交易商城!&nbsp;&nbsp;&nbsp;&nbsp;© 2022-2023 二手图书交易商城®
                    版权所有</p>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loginname: "",
            findall: '',
            text: '',
        }
    },
    mounted() {
        this.loginname = this.cookie.getCookie("LoginName");
        this.payReturn();
    },
    computed: {
    },
    methods: {
        payReturn() {
            let _this = this;
            if (this.$route.query && this.$route.query.out_trade_no && this.$route.query.trade_no) {
                console.log('支付成功返回值：this.$route.query', this.$route.query);
                this.$http({
                    method: 'post',
                    url: 'payReturn',
                    params: {
                        out_trade_no: this.$route.query.out_trade_no,
                        trade_no: this.$route.query.trade_no,
                        total_amount: this.$route.query.total_amount,
                        timestamp: this.$route.query.timestamp,
                    }
                })
                    .then(res => {
                        let data = res.data;
                        if ( data.errcode == 0){
                            _this.text = "支付成功！";
                        } else {
                            _this.text = "支付失败！";
                        }
                        console.log('后台返回值为：', res.data);
                    })
            }





        },

        //退出登录
        exit() {
            //调用清楚cookie方法
            this.cookie.clearCookie("LoginName");
            this.cookie.clearCookie("LoginId");
            this.cookie.clearCookie("LoginRole");
            sessionStorage.removeItem("user");
            this.$router.push({ path: "/login" });
        },
        ToCart() {
            this.$router.push({ path: "/shop/cart" })

        }
        ,
        ToBuyHistory() {
            this.$router.push({ path: "/shop/my/order/buyrecord" })
        },
    }

}
</script>

<style lang="less" scoped>
.el-header {
    //line-height: 150px;
    padding-left: 0px;
    padding-right: 0px;

    .top {
        height: 50px;

        .text {
            float: left;
            color: #5b5b5b;
            margin: 0 auto;
            margin-top: 15px;
        }

        .login_box {
            float: right;
            margin-top: 15px;

            a:link {
                color: #8d8d8d
            }

            //未被访问的链接
            a:visited {
                color: #8d8d8d
            }

            // 已被访问过的链接 
            a:hover {
                color: #2AC37D
            }

            // 鼠标悬浮在上的链接
            a:active {
                color: #8d8d8d
            }

            // 鼠标点中激活链接
        }

    }

    .header {
        border: 1px solid black;

        .logo {
            margin-top: 15px;
            display: inline;
            float: left;
            width: 20%;
        }

        .tab {
            display: inline;
            float: left;
            margin-left: 100px;
            margin-top: 40px;
            width: 1000px;
            position: absolute;

            .el-menu-item {
                font-size: 25px;
                font-family: Microsoft YaHei;
                font-weight: bolder;
            }

            .el-menu.el-menu--horizontal {
                border-bottom: none;
            }

            .el-dropdown-menu__item,
            .el-menu-item {
                padding: 0 50px;
            }


        }


    }

}

.el-main {
    //background-color: grey;
    width: 100%;
    border: 4px solid rgb(64, 158, 255);
    border-right: 0px;
    border-left: 0px;
    padding-left: 0px;
    padding-right: 0px;
    padding-bottom: 0px;
    height: 677px;
    background-color: rgb(222, 238, 255);

    .success_box {
        margin-left: 40%;

        p {
            font-size: 80px;
            color: #EF3A44;
        }

        .el-button {
            margin-left: 35px;
        }
    }


}

.el-footer {
    line-height: 50px;
}</style>