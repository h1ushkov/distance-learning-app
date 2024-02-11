// router.js
import { createRouter, createWebHistory } from 'vue-router';
import Courses from '../components/Courses.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import Logout from '../components/Logout.vue';
import Dashboard from '../components/Dashboard.vue';
import Index from '../components/Index.vue';
import UserPage from '../components/UserPage.vue';
import CourseDetails from '../components/fragments/CourseDetails.vue'
const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
  },
  {
    path: '/u/:userName',
    name: 'UserPage',
    component: UserPage,
  },
  {
    path: '/courses/',
    name: 'Courses',
    component: Courses,
  },
  {
    path:'/dashboard/',
    name:'Dashboard',
    component: Dashboard,
  },
  {
    path:'/dashboard/:courseId',
    name:'CourseDet',
    component: Dashboard,
  },
  {
    path:'/c/:courseId',
    name:'CourseDetails',
    component: CourseDetails,
  },
  {
    path: '/login/',
    name: 'login',
    component: Login,
  },
  {
    path: '/register/',
    name: 'register',
    component: Register,
  },
  {
    path: '/logout/',
    name: 'logout',
    component: Logout,
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
})

export default router
