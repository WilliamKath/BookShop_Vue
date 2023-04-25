<template>
    <el-container class="container_middle">
        <el-aside width="250px">
            <el-col>
                <h4 style="text-align:center;color:#424242">个人中心</h4>
                <el-menu default-active="/shop/my/home" class="el-menu-vertical-demo" unique-opened :router='true'>
                    <el-menu-item index="/shop/my/home">
                        <i class="el-icon-s-home"></i>
                        <span slot="title">主页</span>
                    </el-menu-item>
                    <el-menu-item index="/shop/my/myinfo">
                        <i class="el-icon-user-solid"></i>
                        <span slot="title">个人信息</span>
                    </el-menu-item>
                    <el-submenu index="/shop/my/book">
                        <template slot="title">
                            <i class="el-icon-s-goods"></i>
                            <span>图书管理</span>
                        </template>
                        <el-menu-item-group>
                            <template slot="title"></template>
                            <el-menu-item index="/shop/my/book/favorite"><i class="el-icon-star-on"></i>我的收藏</el-menu-item>
                            <el-menu-item index="/shop/my/book/publishRecord"><i
                                    class="el-icon-collection"></i>发布记录</el-menu-item>
                            <el-menu-item index="/shop/my/book/publish"><i class="el-icon-sell"></i>发布图书</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="/shop/my/order">
                        <template slot="title">
                            <i class="el-icon-s-marketing"></i>
                            <span>订单管理</span>
                        </template>
                        <el-menu-item-group>
                            <template slot="title"></template>
                            <el-menu-item index="/shop/my/order/buyrecord"><i class="el-icon-money"></i>购买记录</el-menu-item>
                            <el-menu-item index="/shop/my/order/sellrecord"><i class="el-icon-s-finance"></i>出售记录</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>
            </el-col>
        </el-aside>

        <el-main>
            <router-view>

            </router-view>
        </el-main>
    </el-container>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    created() {
    },
    mounted() {
    },
    methods: {
    }
}
</script>

<style  lang="less" scoped>
.container_middle {
        margin-top: -20px;
        height: 103%;
        .el-aside {
            background-color: #fff;
            width: 50px;
        }
        .el-main {
            background-color: rgb(222, 238, 255);
        }
    }
</style>