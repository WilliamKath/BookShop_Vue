import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/Login.vue'
import Signup from '../components/Signup.vue'
import error from '../components/404.vue'
import cookie from '@/util/cookie'
import PaySuccess from '../components/PaySuccess.vue'


Vue.use(VueRouter)

const routes = [
  { //这里是前台商城
    path: "/shop",
    redirect: "/shop/welcome",
    component: () => import("@/views/shop/Main.vue"),
    children: [
      {
        path: "/shop/welcome",
        component: () => import("@/views/shop/main/Carousel.vue"),
      },
      {
        path: "/shop/books",
        component: () => import("@/views/shop/main/Books.vue")
      },
      {
        path: "/shop/bookDetail",
        component: () => import("@/components/Detail.vue")
      },
      {
        path: "/shop/cart",
        component: () => import("@/views/shop/main/ShoppingCart.vue")
      },
      {
        path: "/shop/notice",
        component: () => import("@/views/shop/main/Notice.vue")
      },
      {
        path: "/shop/my",
        redirect: "/shop/my/home",
        component: () => import("@/views/shop/main/personalCenter/Aside.vue"),
        children: [
          {
            path: "/shop/my/home",
            component: () => import("@/views/shop/main/personalCenter/main/Home.vue")
          },
          {
            path: "/shop/my/myinfo",
            component: () => import("@/views/shop/main/personalCenter/main/MyInfo.vue")
          },
          {
            path: "/shop/my/book/favorite",
            component: () => import("@/views/shop/main/personalCenter/main/bookManage/FavoriteBook.vue")
          },
          {
            path: "/shop/my/book/publish",
            component: () => import("@/views/shop/main/personalCenter/main/bookManage/PublishBook.vue")
          },
          {
            path: "/shop/my/book/publishrecord",
            component: () => import("@/views/shop/main/personalCenter/main/bookManage/PublishRecord.vue")
          },
          {
            path: "/shop/my/order/buyrecord",
            component: () => import("@/views/shop/main/personalCenter/main/orderManage/buyRecords.vue")
          },
          {
            path: "/shop/my/order/sellrecord",
            component: () => import("@/views/shop/main/personalCenter/main/orderManage/sellRecords.vue")
          },
        ]
      }
    ]
  },
  {
    path: "/admin",
    component: () => import("@/views/admin/Main.vue"),
    children: [{
      path: "/admin/home",
      component: () => import("@/views/admin/main/Home.vue"),
    },
    {
      path: "/admin/book/booklist",
      component: () => import("@/views/admin/main/book/BookList.vue"),
    },
    {
      path: "/admin/order/orderlist",
      component: () => import("@/views/admin/main/order/OrderList.vue"),
    },
    {
      path: "/admin/user/userlist",
      component: () => import("@/views/admin/main/user/UserList.vue"),
    }]
  },
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/signup",
    component: Signup
  },
  {
    path: "/paysuccess",
    component: PaySuccess
  },
  {
    path: "/404",
    component: error
  },
]

const router = new VueRouter({
  routes
})

/*
* beforeEach:从一个页面跳转到另外一个页面时触发
* to:要跳转的页面
* from:从哪个页面出来
* next:决定是否通过
*/
router.beforeEach((to, from, next) => {
  const userFlag = cookie.getCookie("LoginName");
  const userRole = cookie.getCookie("LoginRole");
  if (to.matched.length === 0) {
    next('/404')
  }
  if (userFlag != null) {
    if (userRole == '3' && to.path.startsWith('/admin')) {
      next('/404');
    } else {
      next();
    }
  } else {
    if (to.path === ('/login') || to.path === ('/signup')) {
      next();
    } else {
      next('/login');
    }
  }
})

export default router
