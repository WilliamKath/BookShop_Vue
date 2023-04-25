<template>
    <div>
        <div class="main_aside1"></div>
        <div class="main_middle">
            <div class="show_box">
                <div class="img_box">
                    <div class="big_img" v-if="BigImgUrl != ''">
                        <img :src="imgTool.getImgURL(BigImgUrl)" style="width: 100%;height: 100%">
                    </div>
                    <div class="small_img">
                        <ul v-for="(img, index) in imgList" :key="index" class="img_ul">
                            <li @mouseenter='getIndex(img.imgUrl)'>
                                <img :src="imgTool.getImgURL(img.imgUrl)" style="width: 80px; height: 80px">
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="text_box">
                    <div class="bookname">
                        <h1 style="font-size:40px">{{ books.bookName }}</h1>
                    </div>
                    <div class="bookprice">
                        <p>价格</p>&nbsp;
                        <h2 style="color:#EF3A44;font-size:30px;">¥{{ books.bookPrice }}</h2>
                    </div>
                    <div class="sellername">
                        <p>卖家</p>&nbsp;
                        <h3>{{ seller.sellerName }}</h3>
                    </div>
                    <div class="selleremail">
                        <p>联系邮箱</p>&nbsp;
                        <h3>{{ seller.sellerEmail }}</h3>
                    </div>
                    <div class="sellerphone">
                        <p>联系电话</p>&nbsp;
                        <h3>{{ seller.sellerPhone }}</h3>
                    </div>
                    <div class="bookoutline">
                        <p>{{ books.bookOutline }}</p>
                    </div>
                    <div class="button_box">
                        <el-button type="primary" class="btn1" @click="addOrder">加入购物车</el-button>
                        <el-button type="danger" round @click="dialogVisible = true">跟ta聊聊</el-button>
                        <el-button icon="el-icon-star-on" circle class="btn2" @click="addFavorite"
                            style="background-color:#f0dcf0;border: 1px solid #8d8d8d;"></el-button>
                    </div>


                    <!-- <p class="test">价钱</p> -->
                </div>
            </div>
        </div>
        <!-- 弹出框内嵌聊天框 -->
        <el-dialog :visible.sync="dialogVisible" width="600px" append-to-body :modal="false" :center="true"
            :show-close="false">
            <JwChat-index width="570px" @enter="bindEnter" v-model="inputMsg" :showRightBox='false' :toolConfig="toolConfig"
                :config="headerConfig" :taleList="messageList" scrollType="scroll">
                <template slot="header">
                    <span v-if="this.OnlineList.includes(this.seller.sellerName)">
                        <div> {{ seller.sellerName }}
                            <el-tag type="success" effect="dark">
                                在线
                            </el-tag>
                        </div>
                    </span>
                    <span v-else>
                        <div> {{ seller.sellerName }}
                            <el-tag type="info" effect="dark">
                                离线
                            </el-tag>
                        </div>
                    </span>
                </template>
            </JwChat-index>
        </el-dialog>
        <!-- ↑ 弹出框内嵌聊天框 ↑ -->
        <div class="main_aside2"></div>
    </div>
</template>

<script>
let socket;

export default {
    data() {
        return {
            dialogVisible: false,
            books: [],   //图书详情
            bookId: `${this.$route.query.bookId}`,
            seller: [],
            imgList: [],
            bookCategory: [],
            loginname: "",
            loginid: "",
            findall: '',
            BigImgUrl: '',
            toolConfig: {
                showEmoji: true, // 是否显示表情图标
            },
            headerConfig: {
                img: '',
                name: '',
                dept: '',
            },
            messageList: [],
            inputMsg: '',//输入框信息
            buyer: undefined,
            sellerIsOnline: '', //卖家是否在线 -> 1:在线 0:离线
            scrollType: 'scroll',
            OnlineList: [],
        }
    },
    created() {
        this.getBookDetail();
        this.loginid = this.cookie.getCookie("LoginId");
        this.loginname = this.cookie.getCookie("LoginName");
    },
    mounted() {

    },
    watch: {
        OnlineList() {
            this.OnlineList.includes(this.seller.sellerName)
        }
    },
    methods: {
        //初始化websocket
        init() {
            this.buyer = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : {}
            let username = this.buyer.userName;
            let sellername = this.seller.sellerName;
            let _this = this;
            if (typeof (WebSocket) == "undefined") {
                console.log("您的浏览器不支持WebSocket");
            } else {
                console.log("您的浏览器支持WebSocket");
                let socketUrl = "ws://localhost:9000/LiveChat/" + username + "/" + sellername;
                if (socket != null) {
                    socket.close();
                    socket = null;
                }
                // 开启一个websocket服务
                socket = new WebSocket(socketUrl);
                //打开事件
                socket.onopen = function () {
                    console.log("websocket已打开");
                };
                //  浏览器端收消息，获得从服务端发送过来的文本消息
                socket.onmessage = function (msg) {
                    console.log("收到服务器发送过来的数据====" + msg.data)
                    let data = JSON.parse(msg.data)  // 对收到的json数据进行解析： {"users": [{"username": "zhang"},{ "username": "admin"}]}
                    // 如果服务器端发送过来的json数据 不包含 users 这个key，那么发送过来的就是聊天文本json数据： {"from": "测试05", "text": "hello"}
                    console.log('其中接收的data为', data);
                    if (data.users) {    //获取当前在线人员
                        _this.OnlineList = [];
                        for(let i=0;i<data.users.length;i++){
                            _this.OnlineList.push(data.users[i].username);
                        }
                    } else if (data.HistoryMsg) {  //若接收到HistoryMsg 则表示该消息为历史消息
                        console.log('能看出来是HistoryMsg数据：', data.HistoryMsg);
                        for (let i = 0; i < data.HistoryMsg.length; i++) {
                            const formMsg = {
                                "date": data.HistoryMsg[i].time,
                                "img": "photo.png",
                                "text": { "text": data.HistoryMsg[i].text },
                                "mine": username == data.HistoryMsg[i].from,
                                "name": data.HistoryMsg[i].from,
                            };
                            _this.messageList.push(formMsg);
                        }
                        console.log('接收的历史消息：', _this.messageList);
                    } else {    //若接收到的数据中不带users则拼接为聊天框消息
                        if (data.from == sellername) {
                            console.log('这里可以识别到是卖家发送的消息并打印');
                            const formMsg = {
                                "date": data.time,
                                "img": "photo.png",
                                "text": { "text": data.text },
                                "mine": false,
                                "name": _this.seller.sellerName,
                            };
                            _this.messageList.push(formMsg);
                            console.log('接收的消息：', _this.messageList);
                        } else {
                            console.log('识别到了不是当前卖家发送的消息！');
                        }
                    }
                };
                //关闭事件
                socket.onclose = function () {
                    console.log("websocket已关闭");
                };
                //发生了错误事件
                socket.onerror = function () {
                    console.log("websocket发生了错误");
                };
            }
        },

        bindEnter() {
            const msg = this.inputMsg; //输入框的消息
            if (msg.length == '0') {
                this.$message.warning("您还未输入任何消息");
            } else {
                if (this.buyer.userName === this.seller.sellerName) {
                    this.$message.warning("请不要给自己发消息！");
                } else {
                    let time = this.getCurrentTime();
                    let message = { from: this.buyer.userName, to: this.seller.sellerName, text: msg, time: time };
                    console.log("要发送给服务器的message:", message);
                    socket.send(JSON.stringify(message));
                    const MyMsg = {
                        "date": time,
                        "img": "photo.png",
                        "text": { "text": msg },
                        "mine": true,
                        "name": this.loginname
                    }
                    this.messageList.push(MyMsg);
                    console.log('发送出去的信息：', this.messageList);
                }
            }
        },

        getCurrentTime() {
            //获取当前时间
            var _this = this;
            let yy = new Date().getFullYear();
            let mm = new Date().getMonth() + 1;
            let dd = new Date().getDate();
            let hh = new Date().getHours();
            let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
            let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();
            _this.gettime = yy + '/' + mm + '/' + dd + ' ' + hh + ':' + mf + ':' + ss;
            return _this.gettime;
        },

        getIndex(imgUrl) {
            this.BigImgUrl = imgUrl;
        },

        getBookDetail() {
            this.$http({
                method: 'get',
                url: '/bookDetail',
                params: {
                    bookId: this.bookId
                }
            })
                .then(res => {
                    console.log("获取图书详情回显值：", res.data)
                    this.books = res.data[0];
                    this.imgList = this.books.bookImgList;
                    this.bookCategory = this.books.category;
                    this.BigImgUrl = this.imgList[0].imgUrl;
                    this.seller = this.books.seller;
                    console.log("this.books", this.books);
                    this.init();

                })
        },
        //添加收藏
        addFavorite() {
            this.$http({
                method: 'post',
                url: '/addfavorite',
                params: {
                    bookId: this.bookId,
                    userId: this.loginid
                }
            })
                .then(res => {
                    console.log("添加收藏回显值：", res.data);
                    if (res.data.errcode != "0") {
                        return this.$message.error(res.data.errmsg);
                    } else {
                        return this.$message.success(res.data.errmsg);
                    }
                })
        },
        //加入购物车
        addOrder() {
            this.$http({
                method: 'put',
                url: '/addOrder',
                params: {
                    bookId: this.bookId,
                    sellerId: this.seller.sellerId,
                    buyerId: this.loginid
                }
            })
                .then(res => {
                    console.log("加入购物车回显值：", res.data);
                    if (res.data.errcode != "0") {
                        return this.$message.error(res.data.errmsg);
                    } else {
                        return this.$message.success(res.data.errmsg);
                    }
                })
        },
    }

}
</script>

<style lang="less" scoped>
.main_aside1 {
    width: 250px;
    height: 669px;
    display: inline-block;
    float: left;
    margin-top: -20px;
    background-color: white;
}

.main_middle {
    margin-top: -20px;
    height: 669px;
    display: inline-block;

    .show_box {
        .img_box {
            display: inline-block;

            .big_img {
                width: 400px;
                height: 400px;
                margin-left: 300px;
                margin-top: 50px;
                border: 2px solid#8d8d8d;
                box-shadow: 0 10px 10px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
            }

            .small_img {
                border: 1px dashed #8d8d8d;
                margin-left: 300px;
                margin-top: -12px;
                height: 100px;

                .img_ul {
                    margin-left: -5px;
                    padding-left: 10px;
                    display: inline-block;
                    list-style: none;
                    box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.1);

                }



            }
        }

        .text_box {
            margin-top: -515px;
            //display:inline-block;    
            margin-left: 750px;

            .bookname {
                color: #313131;
            }

            .bookprice {
                margin-top: -45px;
                color: #313131;
                display: flex;
                flex-wrap: wrap;
                height: 100px;

                p {
                    margin-top: 28px;
                    font-size: 25px;
                    width: 80px;
                    height: 35px;
                    background-color: #f0dcf0;
                    border: 1px solid #8d8d8d;
                    text-align: center;
                    border-radius: 30px;
                }
            }

            .sellername {
                color: #313131;
                display: flex;
                flex-wrap: wrap;
                margin-top: -30px;

                p {
                    font-size: 25px;
                    width: 80px;
                    height: 35px;
                    background-color: #f0dcf0;
                    border: 1px solid #8d8d8d;
                    text-align: center;
                    border-radius: 30px;
                }

                h3 {
                    margin-top: 30px;
                }
            }

            .selleremail {
                color: #313131;
                margin-top: -15px;
                display: flex;
                flex-wrap: wrap;

                p {
                    font-size: 25px;
                    width: 120px;
                    height: 35px;
                    background-color: #f0dcf0;
                    border: 1px solid #8d8d8d;
                    text-align: center;
                    border-radius: 30px;
                }

                h3 {
                    margin-top: 30px;
                }

            }

            .sellerphone {
                color: #313131;
                margin-top: -15px;
                display: flex;
                flex-wrap: wrap;

                p {
                    font-size: 25px;
                    width: 120px;
                    height: 35px;
                    background-color: #f0dcf0;
                    border: 1px solid #8d8d8d;
                    text-align: center;
                    border-radius: 30px;
                }

                h3 {
                    margin-top: 30px;
                }

            }

            .bookoutline {
                width: 500px;
                border: 1px solid #8d8d8d;
                border-radius: 30px;
                background-color: #f0dcf0;
                padding-left: 20px;
                padding-right: 20px;
            }

            .button_box {
                margin-top: 30px;

                .btn1 {
                    height: 60px;
                    width: 150px;
                    border: 1px solid #8d8d8d;
                    border-radius: 30px;
                    font-size: 20px;
                }

                .btn2 {
                    margin-left: 20px;
                    height: 55px;
                    width: 55px;
                }
            }

        }
    }

}

.main_aside2 {
    margin-top: -20px;
    width: 250px;
    height: 669px;
    display: inline-block;
    float: right;
    white-space: nowrap;
    background-color: white;

}
</style>