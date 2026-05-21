import { createRouter as createVueRouter, createWebHashHistory, Router } from "vue-router";
import { App } from "vue";
import { createAuthGuard } from "@auth0/auth0-vue";
import HomeView from "@/views/HomeView.vue";
import DashboardView from "@/views/DashboardView.vue";
import ExpensesView from "@/views/ExpensesView.vue";
import ReportsView from "@/views/ReportsView.vue";
import ProfileView from "@/views/ProfileView.vue";
import SettingsView from "@/views/SettingsView.vue";

export function createRouter(app: App): Router {
  return createVueRouter({
    history: createWebHashHistory(),
    routes: [
      {
        path: "/",
        name: "home",
        component: HomeView,
      },
      {
        path: "/dashboard",
        name: "dashboard",
        component: DashboardView,
        beforeEnter: createAuthGuard(app),
      },
      {
        path: "/expenses",
        name: "expenses",
        component: ExpensesView,
        beforeEnter: createAuthGuard(app),
      },
      {
        path: "/reports",
        name: "reports",
        component: ReportsView,
        beforeEnter: createAuthGuard(app),
      },
      {
        path: "/profile",
        name: "profile",
        component: ProfileView,
        beforeEnter: createAuthGuard(app),
      },
      {
        path: "/settings",
        name: "settings",
        component: SettingsView,
        beforeEnter: createAuthGuard(app),
      },
    ],
  });
}
