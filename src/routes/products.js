import Productos from '../views/products/Products.vue'
import ProductosNuevo from '../views/products/ProductsNew.vue'

let products = [
    {
        path: '/products',
        name: 'products',
        component: Productos,
        meta: {
          requiresAuth: true,
          title: 'Productos',
          section: 'products'
        }
      },
      {
        path: '/products/new',
        name: 'new-product',
        component: ProductosNuevo,
        meta: {
          requiresAuth: true,
          title: 'Nuevo Producto',
          section: 'products'
        }
      },
      {
        path: '/products/edit/:id',
        name: 'edit-product',
        component: ProductosNuevo,
        meta: {
          requiresAuth: true,
          title: 'Editar Producto',
          section: 'products'
        }
      },
]

export default products