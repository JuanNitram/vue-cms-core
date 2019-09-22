import Vue from 'vue'
import Router from 'vue-router'

import admins from './admins'
import products from './products'
import sliders from './sliders'
import categories from './categories'
import subcategories from './subcategories'
import sections from './sections'
import others from './others'

Vue.use(Router)

let routes = [];

routes = routes.concat(admins)
routes = routes.concat(products)
routes = routes.concat(sliders)
routes = routes.concat(categories)
routes = routes.concat(subcategories)
routes = routes.concat(sections)
routes = routes.concat(others)

let router = new Router({
    mode: 'history',
    routes: routes,
})

router.beforeEach((to, from, next) => {
    next();
});

export default router