import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: '',
        canActivate: [authGuard],
        children: [
            {
                path: 'categories',
                loadComponent: () => import('./features/categories/category-list/category-list.component').then(m => m.CategoryListComponent)
            },
            {
                path: 'products',
                loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent)
            },
            {
                path: 'reports',
                loadComponent: () => import('./features/reports/report-list/report-list.component').then(m => m.ReportListComponent)
            },
            {
                path: '',
                redirectTo: 'products',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'products'
    }
];
