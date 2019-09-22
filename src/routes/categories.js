import Categories from '../views/categories/Categories.vue'
import CategoriesNew from '../views/categories/CategoriesNew.vue'

let categories = [
    {
        path: '/categories',
        name: 'categories',
        component: Categories,
        meta: {
            requiresAuth: true,
            title: 'Categories',
            section: 'categories'
        }
    },
    {
        path: '/categories/new',
        name: 'new-category',
        component: CategoriesNew,
        meta: {
            requiresAuth: true,
            title: 'Nueva Categoria',
            section: 'categories'
        }
    },
    {
        path: '/categories/edit/:id',
        name: 'edit-category',
        component: CategoriesNew,
        meta: {
            requiresAuth: true,
            title: 'Editar Categoria',
            section: 'categories'
        }
    },
]

export default categories