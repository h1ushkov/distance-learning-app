// router.js
import {createRouter, createWebHistory} from 'vue-router';
import Courses from '../components/Courses.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import Logout from '../components/Logout.vue';
import Dashboard from '../components/Dashboard.vue';
import Index from '../components/Index.vue';
import UserPage from '../components/UserPage.vue';
import LessonDetails from '../components/fragments/LessonDetails.vue';
import Cookies from 'js-cookie';
const routes = [
    {
        path: '/',
        name: 'Index',
        component: Index,
        meta: { requiresAuth: true },
    },
    {
        path: '/dashboard/lesson/:lessonId',
        name: 'LessonDetails',
        component: LessonDetails,
        meta: { requiresAuth: true },
    },
    {
        path: '/u/:userName',
        name: 'UserPage',
        component: UserPage,
        meta: { requiresAuth: true },
    },
    {
        path: '/courses/',
        name: 'Courses',
        component: Courses,
        meta: { requiresAuth: true },
    },
    {
        path: '/dashboard/',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true},
    },
    {
        path: '/dashboard/:courseId',
        name: 'CourseDetails',
        component: Dashboard,
        meta: { requiresAuth: true },

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
        meta: { requiresAuth: true },
    }
];

const router = createRouter({
    history: createWebHistory('/'),
    routes,
});
// Use the accessToken as needed
import axios from 'axios';

router.beforeEach(async (to, from, next) => {
    const accessToken = Cookies.get('accessToken');
    const isAuthenticated = !!accessToken;

    // Check token validity
    if (isAuthenticated) {
        try {
            // Send a request to validate the token
            await axios.get('http://localhost:8080/validate', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        } catch (error) {
            console.error('Invalid token:', error);
            Cookies.remove('accessToken');
            next('/login');
            return;
        }
    }

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login');
    } else {
        try {
            // Fetch user data from the API
            const response = await axios.get('http://localhost:8080/api/users/current', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const userData = response.data;

            // Assuming userData contains user role information
            const userRole = userData.role;

            if (to.name === 'Dashboard' && userRole === 'instructor') {
                next('/'); // Redirect to a different route or handle unauthorized access
            } else {
                next();
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            next('/login'); // Redirect to login in case of an error
        }
    }
});

export default router;


