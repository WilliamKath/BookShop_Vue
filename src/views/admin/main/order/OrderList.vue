<template>
    <div>
        <el-table :data="orderList.slice((currentPage - 1) * pageSize, currentPage * pageSize)" style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="table-expand">
                        <el-form-item label="订单编号">
                            <span>{{ props.row.orderId }}</span>
                        </el-form-item>
                        <el-form-item label="支付单号">
                            <span>{{ props.row.payId }}</span>
                        </el-form-item>
                        <el-form-item label="买家ID：">
                            <span>{{ props.row.buyer.userId }}</span>
                        </el-form-item>
                        <el-form-item label="买家用户名：">
                            <span>{{ props.row.buyer.userName }}</span>
                        </el-form-item>
                        <el-form-item label="卖家ID：">
                            <span>{{ props.row.seller.userId }}</span>
                        </el-form-item>
                        <el-form-item label="卖家用户名：">
                            <span>{{ props.row.seller.userName }}</span>
                        </el-form-item>
                        <el-form-item label="图书ID：">
                            <span>{{ props.row.bookId }}</span>
                        </el-form-item>
                        <el-form-item label="书名：">
                            <span>{{ props.row.book.bookName }}</span>
                        </el-form-item>
                        <el-form-item label="ISBN号：">
                            <span>{{ props.row.book.bookIsbn }}</span>
                        </el-form-item>
                        <el-form-item label="描述：">
                            <span>{{ props.row.book.bookOutline }}</span>
                        </el-form-item>
                        <el-form-item label="交易金额：">
                            <span>{{ props.row.totalAmount }}</span>
                        </el-form-item>
                        <el-form-item label="交易时间：">
                            <span>{{ props.row.createTime }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column label="订单编号" prop="orderId">
            </el-table-column>
            <el-table-column label="图书名称" prop="book.bookName">
            </el-table-column>
            <el-table-column label="买家">
                <template slot-scope="scope">
                    <el-popover ref="popover" placement="left" title="联系方式" width="200" trigger="hover">
                        <p>邮箱：{{ scope.row.buyer.userEmail }}</p>
                        <p>手机号：{{ scope.row.buyer.userPhone }}</p>
                        <span slot="reference">
                            <el-button>{{ scope.row.buyer.userName }}</el-button>
                        </span>
                    </el-popover>
                </template>
            </el-table-column>

            <el-table-column label="卖家">
                <template slot-scope="scope">
                    <el-popover ref="popover" placement="left" title="联系方式" width="200" trigger="hover">
                        <p>邮箱：{{ scope.row.seller.userEmail }}</p>
                        <p>手机号：{{ scope.row.seller.userPhone }}</p>
                        <span slot="reference">
                            <el-button>{{ scope.row.seller.userName }}</el-button>
                        </span>
                    </el-popover>
                </template>
            </el-table-column>

            <el-table-column label="金额" prop="totalAmount">
            </el-table-column>
            <el-table-column label="订单状态" prop="goodsState">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.goodsState == 0" type="info" effect="dark">待发货</el-tag>
                    <el-tag v-if="scope.row.goodsState == 1" type="success" effect="dark">已发货</el-tag>
                    <el-tag v-if="scope.row.goodsState == 2" type="danger" effect="dark">已收货</el-tag>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next" :total="total">
        </el-pagination>
    </div>
</template>
    
<script>

export default {
    data() {
        return {
            orderList: [],
            //以下为分页所用数据
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
            dataShow: []

        }
    },
    created() {
        this.getOrderHxList();
    },
    mounted() {
    },
    methods: {
        getOrderHxList() {
            this.$http({
                method: 'get',
                url: '/getOrderHxList'
            })
                .then(res => {
                    this.orderList = res.data.result;
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
                    console.log("this.orderList", this.orderList);
                })
        },

        // 以下为分页用方法
        calcPageData() {
            // 计算页数(根据后台数据的条数和每页显示数量算出一共几页,得0时设为1)
            if (this.orderList.length > 1) {
                this.pageNum = Math.ceil(this.orderList.length / this.pageSize) || 1;
                console.log('总页数:', this.pageNum);
            }
            // 数据分组
            for (let i = 0; i < this.pageNum; i++) {
                // 每一页都是一个数组 形如 [['第一页的数据'],['第二页的数据'],['第三页数据']]
                // 根据每页显示数量 将后台的数据分割到 每一页,假设pageSize为5， 则第一页是1-5条，即slice(0,5)，第二页是6-10条，即slice(5,10)...
                this.totalPageData[i] = this.orderList.slice(this.pageSize * i, this.pageSize * (i + 1));
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
    width: 30%;
}
.page {
    float: right;
}
</style>