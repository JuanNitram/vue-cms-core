import Login from '../views/auth/Login.vue'
import Dashboard from '../views/Dashboard.vue'

let others = [
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            isLogin: true,
            title: 'Login',
            section: 'login'
        }
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: {
            requiresAuth: true,
            title: 'Dashboard',
            section: 'dashboard'
        }
    },
    {
        path: '/*',
        redirect: '/dashboard'
    },
]

export default others