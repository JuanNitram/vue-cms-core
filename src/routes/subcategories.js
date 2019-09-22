import Subcategories from "../views/subcategories/Subcategories.vue";
import SubcategoriesNew from "../views/subcategories/SubcategoriesNew.vue";

let subcategories = [
  {
    path: "/subcategories",
    name: "subcategories",
    component: Subcategories,
    meta: {
      requiresAuth: true,
      title: "Subcategories",
      section: "subcategories"
    }
  },
  {
    path: "/subcategories/new",
    name: "new-subcategory",
    component: SubcategoriesNew,
    meta: {
      requiresAuth: true,
      title: "Nueva Subcategoria",
      section: "subcategories"
    }
  },
  {
    path: "/subcategories/edit/:id",
    name: "edit-subcategory",
    component: SubcategoriesNew,
    meta: {
      requiresAuth: true,
      title: "Editar Subcategoria",
      section: "subcategories"
    }
  }
];

export default subcategories
