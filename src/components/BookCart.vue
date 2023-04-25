<template>
    <div @click="linkTo(book.bookId)">
        <el-card>
            <img class="image" :src="imgTool.getImgURL( book.bookImg )" >
            <div class="text">
                <!-- <h4 class="title">{{ book.bookName }}</h4> -->
                <my-tooltip :text=" book.bookName " class="book_title"></my-tooltip>
                <div class="outline_price">
                    <my-tooltip :text=" book.bookOutline "></my-tooltip>
                    <p class="price">{{ book.bookPrice }}元</p>
                </div>
            </div>
        </el-card>
    </div>  
</template>

<script>
import myTooltip from '../components/myTooltip.vue'

export default {
    name: 'bookCart',
    props:{
        book:{

        }
    },
    components: {
        'my-tooltip': myTooltip,
    },
    data(){
        return{
        }
    },

    methods:{
        linkTo(bookId){
            console.log(bookId);
            this.$router.push({
                path:`bookDetail?bookId=${bookId}`
            })
        }

    }

    
}
</script>

<style lang="less" scoped>
.el-card{
    width: 250px;
    height: 385px;
    margin: 0px 12px 20px 0px;
    padding: 0px 0px 0px 0px;
    float: left;
    .book_title ::v-deep {
        .text-box{
            font-weight:bold;
            font-size:23px;
            font-family:"STXinwei";
        }
    }
    .outline{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }          
    .price{
    margin-top: 5px;
    float: right;
    }                    
    .image{
        width: 215px;
        height: 230px;
    }

}

</style>