import { Routes } from '@angular/router';

export const productRoutes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    loadComponent: () =>
      import('./pages/product-list-page/product-list.page').then((m) => m.ProductListPageComponent),
    title: 'Lista de Productos',
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./components/product-form/product-form').then((m) => m.ProductFormComponent),
    title: 'Crear Producto',
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./components/product-form/product-form').then((m) => m.ProductFormComponent),
    title: 'Editar Producto',
  },
];
