import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "@/views/HomeView.vue";
import Order from "@/views/Order.vue";

Vue.use(VueRouter);

const routes = [
  {
    meta: {
      title: "Trang chủ"
    },
    path: "/home",
    name: "home",
    component: HomeView
  },
  {
    meta: {
      title: "Order"
    },
    path: "/order",
    name: "order",
    component: Order
  },
  {
    meta: {
      title: "Tables"
    },
    path: "/tables",
    name: "tables",
    component: () => import(/* webpackChunkName: "tables" */ "@/views/TablesView.vue")
  },
  {
    meta: {
      title: "Bảng công"
    },
    path: "/attendance",
    name: "attendance",
    component: () => import(/* webpackChunkName: "tables" */ "@/views/AttendanceTableView.vue")
  },
  {
    meta: {
      title: "Tài khoản nhân viên"
    },
    path: "/forms",
    name: "forms",
    component: () => import(/* webpackChunkName: "forms" */ "@/views/FormsView.vue")
  },
  {
    meta: {
      title: "Profile"
    },
    path: "/profile",
    name: "profile",
    component: () => import(/* webpackChunkName: "profile" */ "@/views/ProfileView.vue")
  },
  {
    meta: {
      title: "New Client"
    },
    path: "/client/new",
    name: "client.new",
    component: () => import(/* webpackChunkName: "client-form" */ "@/views/ClientFormView.vue")
  },
  {
    meta: {
      title: "Edit Client"
    },
    path: "/client/:id",
    name: "client.edit",
    component: () => import(/* webpackChunkName: "client-form" */ "@/views/ClientFormView.vue"),
    props: true
  },
  {
    meta: {
      title: "Đồ uống"
    },
    path: "/item",
    name: "item",
    component: () => import(/* webpackChunkName: "forms" */ "@/views/ItemTableView.vue")
  },
  {
    meta: {
      title: "Loại đồ uống"
    },
    path: "/category",
    name: "category",
    component: () => import(/* webpackChunkName: "forms" */ "@/views/CategoryTableView.vue")
  },
  {
    meta: {
      title: "Nhân viên"
    },
    path: "/employee",
    name: "employee",
    component: () => import(/* webpackChunkName: "client-form" */ "@/views/EmployeeTableView.vue")
  },
  {
    meta: {
      title: "Khách hàng"
    },
    path: "/client",
    name: "client",
    component: () => import(/* webpackChunkName: "client-form" */ "@/views/ClientTableView.vue")
  },
  {
    path: "/",
    component: () => import(/* webpackChunkName: "full-page" */ "@/views/FullPageView.vue"),
    children: [
      {
        meta: {
          title: "Đăng nhập"
        },
        path: "",
        name: "login",
        component: () => import(/* webpackChunkName: "full-page" */ "@/views/full-page/LoginView.vue"),
        alias: '/login'
      }
    ]
  }

];

const router = new VueRouter({
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
});

export default router;

export function useRouter () {
  return router;
}
