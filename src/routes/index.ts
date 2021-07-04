import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import CoachList from '../components/pages/CoachList.vue';
import CoachDetails from '../components/pages/CoachDetails.vue';
import Register from '../components/pages/Register.vue';
import Contact from '../components/pages/Contact.vue';
import RequestList from '../components/pages/RequestList.vue';
import NotFound from '../components/pages/NotFound.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/coaches'
  },
  {
    path: '/coaches',
    component: CoachList
  },
  {
    path: '/coaches/:id',
    component: CoachDetails,
    children: [
      {
        path: 'contact',
        component: Contact
      }
    ]
  },
  {
    path: '/register',
    component: Register
  },

  {
    path: '/requests',
    component: RequestList
  },
  {
    path: '/:notFound(.*)',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
