import Sliders from '../views/sliders/Sliders.vue'
import SlidersNuevo from '../views/sliders/SlidersNuevo.vue'

let sliders = [
    {
        path: '/sliders',
        name: 'sliders',
        component: Sliders,
        meta: {
            requiresAuth: true,
            title: 'Sliders',
            section: 'sliders'
        }
    },
    {
        path: '/sliders/new',
        name: 'new-slider',
        component: SlidersNuevo,
        meta: {
            requiresAuth: true,
            title: 'Nuevo Slider',
            section: 'sliders'
        }
    },
    {
        path: '/sliders/edit/:id',
        name: 'edit-slider',
        component: SlidersNuevo,
        meta: {
            requiresAuth: true,
            title: 'Editar Slider',
            section: 'sliders'
        }
    },
]

export default sliders