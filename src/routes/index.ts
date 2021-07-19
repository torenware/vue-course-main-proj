import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import CoachList from '../components/pages/CoachList.vue';
import AuthForm from '../components/pages/auth/UserAuth.vue';
import NotFound from '../components/pages/NotFound.vue';
import store from '@/store';

// Lazy loading components.
const CoachDetails = () => import('../components/pages/CoachDetails.vue');
const Register = () => import('../components/pages/Register.vue');
const Contact = () => import('../components/pages/Contact.vue');
const RequestList = () => import('../components/pages/RequestList.vue');

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
    beforeEnter: async to => {
      const cid = to.params.id;
      try {
        // This will either succeed silently, or
        // throw.
        await store.dispatch('validateCoach', cid);
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
    component: Register,
    beforeEnter: to => {
      try {
        const userId = store.getters.loginStatus;
        if (userId) {
          return true;
        }
      } catch (err) {
        // Something catestrophically wrong...
        return '/404';
      }
      return false;
    }
  },

  {
    path: '/requests',
    component: RequestList,
    beforeEnter: async to => {
      try {
        const userId = store.getters.loginStatus;
        if (userId) {
          await store.dispatch('validateCoach', userId);
        }
        if (userId && store.getters.currentCoach) {
          return true;
        }
      } catch (err) {
        return '/coaches';
      }
      return '/coaches';
    }
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

router.beforeResolve(to => {
  return true;
});

export default router;
