<template>
    <div class="main">
        <div class="main_table" name="divForm">
            <template>
                <el-table :data="orderList" height="658px" style="width: 80%" :row-style="{ height: '120px' }"
                    :header-cell-style="{ 'text-align': 'center', 'height': '90px', 'font-size': '20px', 'color': '#282828' }">
                    <el-table-column prop="orderId" label="订单编号" width="185px">
                    </el-table-column>
                    <el-table-column label="书名" width="165px" style="font-size:28px">
                        <template slot-scope="scope">
                            <span style="font-size:18px;color:#191919">{{ scope.row.bookVo.bookName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="图书图片" width="150px">
                        <template slot-scope="scope">
                            <el-image :src="imgTool.getImgURL(scope.row.bookVo.bookImg)"
                                :preview-src-list="[imgTool.getImgURL(scope.row.bookVo.bookImg)]" align="center"
                                style="width: 120px;height: 120px"></el-image>
                        </template>
                    </el-table-column>
                    <el-table-column prop="bookVo.bookIsbn" label="ISBN号" width="140px">
                    </el-table-column>
                    <el-table-column prop="bookVo.category.categoryName" label="分类">
                    </el-table-column>
                    <el-table-column label="卖家">
                        <template slot-scope="scope">
                            <el-popover ref="popover" placement="bottom" title="联系方式" width="200" trigger="hover">
                                <p>邮箱：{{ scope.row.seller.sellerEmail }}</p>
                                <p>手机号：{{ scope.row.seller.sellerPhone }}</p>
                                <span slot="reference">
                                    <el-button>{{ scope.row.seller.sellerName }}</el-button>
                                </span>
                            </el-popover>

                        </template>
                    </el-table-column>
                    <el-table-column label="价格" align="center">
                        <template slot-scope="scope">
                            <span style="font-size:28px;color:#EF3A44">{{ scope.row.bookVo.bookPrice }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="300px" align="center">
                        <template slot-scope="scope">
                            <el-button type="danger" @click="payOrder(scope.row)">立即支付</el-button>
                            <el-button type="info" size="small" @click="handleDelete(scope.row.orderId)">取消订单</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            orderList: [],

        }
    },
    created() {
        this.getOrderList();
        this.notice();
    },
    mounted() {
    },
    methods: {
        //获取详情列表
        getOrderList() {
            this.$http({
                method: 'get',
                url: 'getOrderList',
                params: {
                    buyerId: this.cookie.getCookie("LoginId")
                }
            })
                .then(res => {
                    this.orderList = res.data.result;
                    if (res.data.errcode != '0') {
                        return this.$message.warning(res.data.errmsg);
                    }
                    console.log("订单详情列表：", this.orderList);
                })
        },
        //删除订单方法
        handleDelete(orderId) {
            this.$http({
                method: 'delete',
                url: '/deleteOrder',
                params: {
                    orderId: orderId
                }
            })
                .then(res => {
                    console.log("res.data:", res.data);
                    if (res.data.errcode != "0") {
                        console.log(res.data.errcode);
                        this.$message.error("取消订单失败！");
                    } else {
                        console.log(res.data.errcode);
                        this.$message.success("您已取消该订单！");
                        return this.getOrderList();
                    }
                })
        },
        //支付订单方法
        payOrder(order) {
            console.log('order', order);
            if (order.bookVo.bookRelease == 3) {
                this.$message.error("支付失败！该图书已被其它用户购买！");
            } else {
                this.$http({
                    method: 'get',
                    url: 'alipay',
                    params: {
                        outTradeNo: order.orderId,
                        subject: order.bookVo.bookName,
                        totalAmount: order.bookVo.bookPrice,
                        body: "感谢您使用二手图书交易平台，该订单将交由卖家：“" + order.seller.sellerName + "”发货处理。平台将为您竭诚服务到底！",
                    }
                })
                    .then(res => {
                        // const divForm = document.getElementsByTagName("divForm");
                        // console.log("res", res.data);
                        // console.log(divForm);
                        // if (divForm.length) {
                        //     document.body.removeChild(divForm[0]);
                        // }
                        // const div = document.createElement("divForm");
                        // div.innerHTML = res.data; // data就是接口返回的form 表单字符串
                        // document.body.appendChild(div);
                        // document.forms[0].setAttribute("target", "_blank"); // 新开窗口跳转
                        // document.forms[0].submit();
                        document.querySelector('body').innerHTML = res.data;//查找到当前页面的body，将后台返回的form替换掉他的内容
                        document.forms[0].submit();  //执行submit表单提交，让页面重定向，跳转到支付宝页面
                    })
            }
        },
        notice() {
            this.$notify.info({
                title: '提示',
                message: '支付时调用支付宝沙箱，账号：mfdner5386@sandbox.com 密码：111111 注意：沙箱环境不稳定且周日至周一维护，可能导致支付失败',
                duration: 0
            });
        },
    }
}
</script>

<style  lang="less" scoped>
.main {

    .main_table {
        margin-top: -10px;
        margin-left: 317px;
    }
}
</style>