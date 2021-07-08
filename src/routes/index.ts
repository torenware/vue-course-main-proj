import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import CoachList from '../components/pages/CoachList.vue';
import CoachDetails from '../components/pages/CoachDetails.vue';
import Register from '../components/pages/Register.vue';
import Contact from '../components/pages/Contact.vue';
import RequestList from '../components/pages/RequestList.vue';
import AuthForm from '../components/pages/auth/UserAuth.vue';
import NotFound from '../components/pages/NotFound.vue';
import store from '@/store';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/coaches'
  },
  {
    path: '/signup',
    name: 'signup',
    component: AuthForm
  },
  {
    path: '/signin',
    name: 'signin',
    component: AuthForm
  },
  {
    path: '/coaches',
    component: CoachList
  },
  {
    path: '/coaches/:id',
    component: CoachDetails,
    beforeEnter: to => {
      const cid = to.params.id;
      try {
        // This will either succeed silently, or
        // throw.
        store.dispatch('validateCoach', cid);
        return true;
      } catch (err) {
        // Something catestrophically wrong...
        return '/404';
      }
    },
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
    path: '/404',
    component: NotFound
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
