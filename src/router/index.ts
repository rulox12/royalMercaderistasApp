import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/tab1',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginPage.vue'),
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        name: 'tab1',
        component: () => import('@/views/Tab1Page.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.name === 'login') {
    if (isAuthenticated(token)) {
      next('tab1');
    } else {
      next();
    }
  } else {
    if (isAuthenticated(token)) {
      next();
    } else {
      next({ name: 'login' });
    }
  }
});

function isAuthenticated(token: string | null) {
  return !!token && isValidToken(token);
}

function isValidToken(token: string | null) {
  return true;
}

export default router
