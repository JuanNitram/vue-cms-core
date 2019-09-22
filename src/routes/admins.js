import Administradores from '../views/admins/Admins.vue'
import AdministradoresNuevo from '../views/admins/AdminsNew.vue'

let admins = [
    {
        path: '/admins',
        name: 'admins',
        component: Administradores,
        meta: {
          requiresAuth: true,
          title: 'Administradores',
          section: 'admins'
        }
      },
      {
        path: '/admins/new',
        name: 'new-admin',
        component: AdministradoresNuevo,
        meta: {
          requiresAuth: true,
          title: 'Nuevo Administrador',
          section: 'admins',
        }
      },
      {
        path: '/admins/edit/:id',
        name: 'edit-admin',
        component: AdministradoresNuevo,
        meta: {
          requiresAuth: true,
          title: 'Editar Administrador',
          section: 'admins'
        }
      },
]

export default admins