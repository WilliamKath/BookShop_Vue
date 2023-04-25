<template>
    <div>
        <!-- 文字走马灯 -->
        <div class="text_banner">
            <el-carousel height="40px" indicator-position="none">
                <el-carousel-item v-for="item in textList" :key="item.id">
                    <span class="el-icon-present">&nbsp;&nbsp;&nbsp;&nbsp;{{ item.text }}</span>
                </el-carousel-item>
            </el-carousel>
        </div>
        <!-- 图片走马灯 -->
        <div class="img_banner">
            <el-carousel height="614px">
                <el-carousel-item v-for="item in imgList" :key="item">
                    <img :src=item alt="" height="614px" width="1960px">
                </el-carousel-item>
            </el-carousel>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            textList: [
                { id: 1, text: '环保公益两不误，与您相约二手图书商城。' },
                { id: 2, text: '您的需求就是我们的需求，您的满意就是我们的满意。' },
                { id: 3, text: '小商城，大环保，让闲置书籍流转起来。' },
                { id: 4, text: '理多不一定对，好书不一定贵。' },
                { id: 5, text: '我读书，我感悟，我快乐。' },
                { id: 6, text: '学习改变命运，知识成就未来。' },
            ],
            imgList: [
                require("@/assets/img/main/focus_0.jpg"),
                require("@/assets/img/main/focus_1.jpg"),
                require("@/assets/img/main/focus_2.jpg"),
                require("@/assets/img/main/focus_3.jpg"),
            ],
        }
    },
    mounted() {
    },
    computed: {
    },
    methods: {

    }

}
</script>

<style lang="less" scoped>
.text_banner {
    background-color: rgb(222, 238, 255);
    color: rgb(64, 158, 255);
    margin-top: -20px;
    text-align: center;
    font-size: 18px;
    font-family: LiSu;
    padding-top: 15px;
}

.img_banner {
    height: 600px;
}
</style>