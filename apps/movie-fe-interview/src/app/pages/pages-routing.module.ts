import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from '../components/layout/layout.component';

const ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'home', loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent) },
      { path: 'movies', loadComponent: () => import('./movies/movies.component').then((m) => m.MoviesComponent) },
      { path: 'movie/:slug', loadComponent: () => import('./movie/movie.component').then((m) => m.MovieComponent) },
      { path: 'recent', loadComponent: () => import('./recent/recent.component').then((m) => m.RecentComponent) },
			{ path: '', redirectTo: '/home', pathMatch: 'full' }
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(ROUTES, {
      // enableTracing: true
    }),
  ],
  exports: [RouterModule],
})
export class AppPagesRoutingModule {}
