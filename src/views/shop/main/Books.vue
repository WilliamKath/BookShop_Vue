<template>
    <el-container class="container_middle">
        <el-aside width="250px">
            <div class="aside_box">
                <div class="select_box">
                    <h2 class="text_select">图书分类</h2>
                    <el-select v-model="cid" filterable remote @change="chooseCategory" placeholder="请选择"
                        class="input_select">
                        <el-option :key=0 value=0 label="全部"></el-option>
                        <el-option v-for="item in categoryList" :key="item.categoryId" :label="item.categoryName"
                            :value="item.categoryId"></el-option>
                    </el-select>
                </div>

            </div>
        </el-aside>
        <el-main>
            <div class="main_box">
                <div class="book_box">
                    <book-card :book="book"
                        v-for="(book, index) in books.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
                        :key="index"></book-card>
                </div>
                <div class="page_box">
                    <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page="currentPage" :page-sizes="[6, 12, 24, 48]" :page-size="pageSize"
                        layout="total, sizes, prev, pager, next" :total="total">
                    </el-pagination>
                </div>
            </div>
        </el-main>
    </el-container>
</template>

<script>
import bookCart from '@/components/BookCart.vue'

export default {
    name: '',
    components: {
        'book-card': bookCart
    },
    data() {
        return {
            inputBookName: '',
            //图书种类列表
            cid: '',
            categoryId: 0,
            categoryList: [],
            books: [],
            // 分页数据,这里用来保存每页切割后的数据
            // 看起来格式是这样的[[{},{},{}],[{},{},{}]]
            // 数组内套数组，每个数组就是一页数据
            totalPageData: [],
            // 共几页
            pageNum: 1,
            // 每页显示数量
            pageSize: 6,
            // 当前显示页码
            currentPage: 1,
            // 总共多少条数据
            total: 1,
            // 当前要显示的数据
            dataShow: []
        }
    },
    watch: {
        $route: {
            immediate: true,
            handler(){
                if(this.$route.query.find){
                    this.getBook();
                }
            }
        }
    },
    created() {
        this.getBook();
        // this.getBookList();
        this.getCategoryList();
    },
    mounted() {
    },
    methods: {
        getBook(){
            if(this.$route.query.find){
                this.findBook(this.$route.query.find);
            } else {
                this.getBookList();
            }
        },
        //根据图书种类获取所有图书，当catagoryId=0（默认）时获取所有图书
        getBookList() {
            this.$http({
                method: 'get',		//请求方式，默认为‘get’ ，可省略
                url: '/allbook',		//请求的接口网址
                params: {
                    categoryId: this.categoryId,			//种类ID，通过此来实现筛选图书分类功能
                    //bookname:this.inputBookName,
                }
            })
                .then(res => {
                    console.log("books:", res.data)			//请求到的数据打印出来检查有没有出错
                    this.books = res.data;		//将请求到的数据赋值到数组list中
                    this.total = res.data.length;
                    this.calcPageData();
                })
        },
        //搜索图书用方法
        findBook(book) {
            this.$http({
                method: 'get',		//请求方式，默认为‘get’ ，可省略
                url: '/allbook',		//请求的接口网址
                params: {
                    categoryId: 0,
                    bookName: book,
                }
            })
                .then(res => {
                    console.log("books:", res.data)			//请求到的数据打印出来检查有没有出错
                    this.books = res.data;		//将请求到的数据赋值到数组list中
                    this.total = res.data.length;
                    this.calcPageData();
                })
        },

        getCategoryList() {
            this.$http.get('/allcategory').then(response => {
                this.categoryList = response.data;
                console.log("categoryList", this.categoryList);
            })
        },

        calcPageData() {
            // 计算页数(根据后台数据的条数和每页显示数量算出一共几页,得0时设为1)
            if (this.books.length > 1) {
                this.pageNum = Math.ceil(this.books.length / this.pageSize) || 1;
                console.log('总页数:', this.pageNum);
            }
            // 数据分组
            for (let i = 0; i < this.pageNum; i++) {
                // 每一页都是一个数组 形如 [['第一页的数据'],['第二页的数据'],['第三页数据']]
                // 根据每页显示数量 将后台的数据分割到 每一页,假设pageSize为5， 则第一页是1-5条，即slice(0,5)，第二页是6-10条，即slice(5,10)...
                this.totalPageData[i] = this.books.slice(this.pageSize * i, this.pageSize * (i + 1));
            }
            // 获取到数据后显示第一页内容,数组下标是从0开始的，这里一定要减去1，不然会丢失一组数据
            this.dataShow = this.totalPageData[this.currentPage - 1];
            console.log("dataShow", this.dataShow);
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

        chooseCategory(id) {
            this.categoryId = id;
            this.getBookList();
            console.log("当前的输入值为：", this.categoryId);
        },
    }
}
</script>

<style  lang="less" scoped>
.container_middle {
    margin-top: -20px;

    .el-aside {
        //background-color: rgb(240, 220, 240);
        height: 669px;
        background-color: #fff;

        .aside_box {
            .select_box {
                .text_select {
                    text-align: center;
                    font-family: Microsoft YaHei;
                    font-weight: bolder;
                    font-size: 30px;
                    color: #424242;
                }

                .input_select {
                    margin-left: 20px;
                }
            }
        }
    }

    .el-main {
        background-color: aquamarine;
        height: 669px;
        background-color: rgb(222, 238, 255);

        .page_box {
            bottom: 15px;
            left: 75%;
            position: absolute;

            .page {
                float: right;
            }
        }


    }
}
</style>