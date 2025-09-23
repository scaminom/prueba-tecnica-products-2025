import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full'
  },
  {
    path: 'products',
    loadChildren: () => import('./features/product/product.routes').then(m => m.productRoutes)
  },
  {
    path: '**',
    redirectTo: '/products'
  }
];
