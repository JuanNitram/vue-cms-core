import Sections from '../views/sections/Sections.vue'
import SectionsNew from '../views/sections/SectionsNew.vue'

let sections = [
    {
        path: '/sections',
        name: 'sections',
        component: Sections,
        meta: {
          requiresAuth: true,
          title: 'Sections',
          section: 'sections'
        }
      },
      {
        path: '/sections/new',
        name: 'new-section',
        component: SectionsNew,
        meta: {
          requiresAuth: true,
          title: 'Nueva Seccion',
          section: 'sections'
        }
      },
      {
        path: '/sections/edit/:id',
        name: 'edit-section',
        component: SectionsNew,
        meta: {
          requiresAuth: true,
          title: 'Editar Seccion',
          section: 'sections'
        }
      },
]

export default sections