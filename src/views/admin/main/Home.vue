<template>
    <div class="img_box">
        <span v-if="this.loginRole == 1">
            <img src="@/assets/img/admin/SuperAdministrator.png" alt="" height="100%" width="100%">
        </span>
        <span v-else>
            <img src="@/assets/img/admin/Administrator.png" alt="" height="100%" width="100%">
        </span>
    </div>
</template>
    
<script>

export default {
    data() {
        return {
            loginRole: '',

        }
    },
    created() {
        this.loginRole = this.cookie.getCookie("LoginRole");
        console.log('role',this.loginRole);
        
    },
    mounted() {
    },
    methods: {

    }
}
</script>
    
<style lang="less" scoped>
.img_box{
    height: 100%;
    width: 100%;
}
</style>