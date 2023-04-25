<template>
    <div>
        <el-container>
            <el-header height="200px">
                <div class="top">
                    <p class="text">校园二手商城，让您的闲置商品不再闲置，发现更多好玩好物！</p>
                    <div class="login_box">
                        <el-popover placement="top-start" trigger="hover">
                            <span v-if="this.loginRole == 3">
                                <table>
                                <tr>
                                    <td><el-button size="mini"  type="info" round  @click="exit">退出登录</el-button></td>
                                </tr>
                                </table>
                            </span>
                            <span v-else style="align-items:center;">
                                <table>
                                <tr>
                                    <td><el-button size="mini"  type="danger" round  @click="admin">前往后台</el-button>
                                    </td>
                                </tr>
                                <tr>
                                    <td><el-button size="mini"  type="info" round  @click="exit">退出登录</el-button></td>
                                </tr>
                                </table>
                            </span>
                            <el-tag slot="reference" effect="plain">{{ loginname }}</el-tag>
                        </el-popover>

                    </div>
                </div>
                <div class="header">
                    <div class="logo">
                        <img src="@/assets/img/main/logo.jpg" height="90px" width="140px" style="float:left">
                    </div>
                    <div class="tab">
                        <el-menu :default-active="this.$route.path" class="el_menu" mode="horizontal" router>
                            <el-menu-item index="/shop/welcome">首页</el-menu-item>
                            <el-menu-item index="/shop/books">全部商品</el-menu-item>
                            <el-menu-item index="/shop/cart">购物车</el-menu-item>
                            <el-menu-item index="/shop/my">个人中心</el-menu-item>
                            <el-menu-item index="/shop/notice">网站公告</el-menu-item>
                        </el-menu>
                    </div>
                    <div class="btn">
                        <el-input v-model="inputBookName" ref="inputbook" placeholder="搜索图书" class="findall">
                            <el-button slot="append" icon="el-icon-search" native-type="submit"
                                @click="findBook"></el-button>
                        </el-input>

                    </div>
                </div>

            </el-header>
            <el-main>
                <router-view></router-view>
            </el-main>
            <el-footer>
                <el-button class="message_btn" type="danger" circle icon="el-icon-message"
                    @click="dialogVisible = true"></el-button>
                <p style="text-align:center;font-size:10px">买卖二手书，就上二手图书交易商城!&nbsp;&nbsp;&nbsp;&nbsp;© 2022-2023 二手图书交易商城®
                    版权所有</p>
            </el-footer>
        </el-container>
        <div class="dialog">
            <el-dialog :visible.sync="dialogVisible" append-to-body :modal="false" :center="true" :show-close="false">
                <div>
                    <JwChat-index v-model="inputMsg" :taleList="messageList" scrollType="scroll"
                        :winBarConfig="winBarConfig" @enter="bindEnter" :showRightBox='false' :config="headerConfig">
                        <!-- <template slot="header">
                            <p>{{ this.toUser }}</p>
                        </template> -->
                        <template slot="header">
                            <span v-if="this.toUser == ''">请选择用户</span>
                            <span v-else>
                                <span v-if="this.ToUserOnline.includes(this.toUser)">
                                    <div> {{ this.toUser }}
                                        <el-tag type="success" effect="dark">
                                            在线
                                        </el-tag>
                                    </div>
                                </span>
                                <span v-else>
                                    <div> {{ this.toUser }}
                                        <el-tag type="info" effect="dark">
                                            离线
                                        </el-tag>
                                    </div>
                                </span>
                            </span>
                        </template>
                    </JwChat-index>
                </div>
            </el-dialog>
        </div>


    </div>
</template>

<script>
let socket;

export default {
    data() {
        return {
            loginname: "",
            inputBookName: '',
            inputbook: '',
            dialogVisible: false,
            inputMsg: '',
            messageList: [],
            tool: {
                callback: this.toolEvent
            },
            headerConfig: {
                img: '',
                name: '',
                dept: '',
            },
            showRightBox: false,
            winBarConfig: {
                active: "win01",
                width: "180px",
                listHeight: "60px",
                list: [],
                callback: this.bindWinBar,
            },
            config: {
                img: 'photo.png',
                name: 'JwChat',
                dept: '最简单、最便捷',
                callback: this.bindCover
            },
            LinkList: [],   //会话列表
            loginname: "",
            loginid: "",
            userlist: [],
            userOnlineList: [],
            toUser: '',
            ToUserOnline: [],
            loginRole: ''
        }
    },
    created() {
        this.loginid = this.cookie.getCookie("LoginId");
        this.loginname = this.cookie.getCookie("LoginName");
        this.loginRole = this.cookie.getCookie("LoginRole");
        this.getLinkList();
        this.init(this.loginname)
    },
    mounted() {
        this.loginname = this.cookie.getCookie("LoginName");
    },
    computed: {
    },
    watch: {
        userOnlineList(val) {

            this.ToUserOnline.includes(this.toUser)
        }
    },
    methods: {
        //搜索图书用方法
        findBook() {
            let book = this.$refs.inputbook.value
            this.$router.push({
                path: `/shop/books?find=${book}`
            })
            this.inputBookName = ''
        },
        //退出登录
        exit() {
            //调用清楚cookie方法
            socket.close();
            this.cookie.clearCookie("LoginName");
            this.cookie.clearCookie("LoginId");
            this.cookie.clearCookie("LoginRole");
            sessionStorage.removeItem("user");
            this.$router.push({ path: "/login" });
        },
        //前往后台
        admin() {        
            socket.close();
            this.$router.push({ path: "/admin/home" });
        },
        init(toUserName) {
            let username = this.loginname;
            let _this = this;
            if (typeof (WebSocket) == "undefined") {
                console.log("您的浏览器不支持WebSocket");
            } else {
                console.log("您的浏览器支持WebSocket");
                let socketUrl = "ws://localhost:9000/LiveChat/" + username + "/" + toUserName;
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
                    if (data.users) {    //获取当前在线人员
                        _this.userOnlineList = []
                        _this.userOnlineList = data.users;  //把当前在线人员赋给onlineList
                        console.log('在线列表为：', _this.userOnlineList);
                        //更新在线列表查看该用户是否在线
                        _this.ToUserOnline = []
                        for (let i = 0; i < _this.userOnlineList.length; i++) {
                            _this.ToUserOnline.push(_this.userOnlineList[i].username)
                        }
                    } else if (data.LinkUser) {
                        _this.userlist = []
                        console.log('能看出来是LinkUser数据：', data.LinkUser);
                        for (let i = 0; i < data.LinkUser.length; i++) {
                            const linkuser = {
                                "id": i + 1,
                                "img": "photo.png",
                                "name": data.LinkUser[i].username,
                            };
                            _this.userlist.push(linkuser);
                            console.log('linkuser', linkuser);
                        }
                        console.log('userlist', _this.userlist);
                        _this.winBarConfig.list = _this.userlist;
                    } else if (data.HistoryMsg) {  //若接收到HistoryMsg 则表示该消息为历史消息
                        // 先将历史消息置空
                        _this.messageList = [];
                        for (let i = 0; i < data.HistoryMsg.length; i++) {
                            //只显示当前点击用户的消息记录，其他用户不显示
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
                        if (data.from == _this.toUser) {
                            //是当前聊天的对面用户消息时，将其拼接到最新消息的列表内
                            console.log('能看出来是实时聊天消息数据：');
                            const formMsg = {
                                "date": data.time,
                                "img": "photo.png",
                                "text": { "text": data.text },
                                "mine": false,
                                "name": _this.toUser,
                            };
                            _this.messageList.push(formMsg);
                            console.log('接收到的聊天消息：', _this.messageList);
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
                if (this.toUser != '') {
                    let time = this.getCurrentTime();
                    let message = { from: this.loginname, to: this.toUser, text: msg, time: time };
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
                } else {
                    this.$message.warning("请选择您的会话列表或在商品详情页发起会话");
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

        //左侧聊天会话用户被点击时调用的方法
        bindWinBar(e) {
            if (e.data.type == 'remove') {
                this.$alert('确定删除与该用户的所有聊天记录吗？', '删除聊天', {
                    confirmButtonText: '确定',
                    callback: action => {
                        console.log('被执行了删除按钮！', e.data.target);
                        console.log('list，', this.winBarConfig.list)
                        let NewLinkList = [];
                        NewLinkList = this.winBarConfig.list.filter(item => item.name != e.data.target.name)
                        this.$http({
                            method: 'delete',
                            url: '/delLinkAndHxMsg',
                            params: {
                                msgFrom: this.loginname,
                                msgTo: e.data.target.name
                            }
                        })
                            .then(res => {
                                if (res.data.errcode != 0) {
                                    this.$message.error("删除失败！");
                                } else {
                                    this.winBarConfig.list = NewLinkList
                                    this.$message.success("删除成功！");
                                }
                            })
                        console.log('新的会话列表为', NewLinkList)
                    }
                })

            } else {
                this.toUser = e.data.name;
                this.init(e.data.name);
            }
        },
        getLinkList() {
            this.$http({
                method: 'get',
                url: 'linklist',
                params: {
                    user: this.loginname
                }
            })
                .then(res => {
                    console.log('获取的发送者列表为：', res.data.result);
                    this.LinkList = res.data.result;
                    if (this.LinkList.length != 0) {
                        for (let i in this.LinkList) {
                            const linkuser = {
                                "id": i,
                                "img": "photo.png",
                                "name": this.LinkList[i],
                            };
                            this.userlist.push(linkuser);
                            console.log('linkuser', linkuser);
                        }
                        console.log('userlist', this.userlist);
                        this.winBarConfig.list = this.userlist;
                    }
                })
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

        .btn {
            margin-left: 1100px;
            margin-top: 50px;
            display: inline;
            float: right;
            width: 20%;


        }
    }
}

.el-main {
    background-color: rgb(222, 238, 255);
    width: 100%;
    border: 4px solid rgb(64, 158, 255);
    border-right: 0px;
    border-left: 0px;
    padding-left: 0px;
    padding-right: 0px;
    padding-bottom: 0px;
    height: 677px;
}

.el-footer {
    line-height: 50px;

    .message_btn {
        margin-top: 10px;
        float: left;
    }
}

.dialog {
    .el-dialog__header {
        display: none;
    }

    .el-dialog-content {
        padding: 0;
        overflow: unset;
    }

    .el-dialog__header {
        padding: 0;
    }
}
</style>