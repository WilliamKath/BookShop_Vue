<template>
    <el-container class="home-container">
        <el-header>
            <div>
                <img src="/img/logo.acd45697.jpg" height="60px" width="100px" style="float: left;margin-right: 20px;">
                <span>商城后台管理系统</span>
            </div>
            <el-button type="danger" @click="logout">前往前台</el-button>
        </el-header>
        <el-container>
            <el-aside width="250px">
                <el-menu default-active="/admin/home" class="el-menu-vertical-demo" unique-opened :router='true'
                    background-color="#deeeff">
                    <!-- 主页 -->
                    <el-menu-item index="/admin/home">
                        <i class="el-icon-s-home"></i>
                        <span slot="title">主页</span>
                    </el-menu-item>
                    <!-- 图书管理 -->
                    <el-submenu index="/admin/book">
                        <template slot="title">
                            <i class="el-icon-s-goods"></i>
                            <span>图书管理</span>
                        </template>
                        <template slot="title"></template>
                        <el-menu-item index="/admin/book/booklist"><i class="el-icon-star-on"></i>图书清单</el-menu-item>
                    </el-submenu>
                    <!-- 用户管理 -->
                    <el-submenu index="/admin/user">
                        <template slot="title">
                            <i class="el-icon-s-goods"></i>
                            <span>用户管理</span>
                        </template>
                        <template slot="title"></template>
                        <el-menu-item index="/admin/user/userlist"><i class="el-icon-star-on"></i>用户清单</el-menu-item>
                    </el-submenu>
                    <!-- 订单管理 -->
                    <el-submenu index="/admin/order">
                        <template slot="title">
                            <i class="el-icon-s-goods"></i>
                            <span>订单管理</span>
                        </template>
                        <template slot="title"></template>
                        <el-menu-item index="/admin/order/orderlist"><i class="el-icon-star-on"></i>交易清单</el-menu-item>
                    </el-submenu>

                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
  
<script >
export default {
    name: 'Home',

    methods: {
        // 退出操作 
        logout() {
            this.$router.push({ path: "/shop" });
        }
    }
}
</script>
  
  
<style lang="less" scoped>
.home-container {
    height: 100%;
}

.el-header {
    background-color: #409eff;
    display: flex;
    justify-content: space-between;
    padding-left: 0px;
    align-items: center;
    color: #fff;
    font-size: 30px;

    .div {
        display: flex;
        align-items: center;

        .span {
            margin-left: 20px;
        }
    }
}

.el-aside {
    background-color: rgb(222, 238, 255);
}

.el-main {}
</style>