import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import CoachList from '../components/pages/CoachList.vue';
import CoachDetails from '../components/pages/CoachDetails.vue';
import Register from '../components/pages/Register.vue';
import Contact from '../components/pages/Contact.vue';
import RequestList from '../components/pages/RequestList.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/coaches',
    component: CoachList
  },
  {
    path: '/coaches/:id',
    component: CoachDetails
  },
  {
    path: '/register',
    component: Register
  },
  {
    path: '/contact',
    component: Contact
  },
  {
    path: '/requests',
    component: RequestList
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
