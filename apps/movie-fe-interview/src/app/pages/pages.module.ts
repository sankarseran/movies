import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { provideStates, provideStore } from '@ngxs/store';

import { AppPagesRoutingModule } from './pages-routing.module';
import { MovieState } from '../shared/state/movie.state';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  imports: [CommonModule, AppPagesRoutingModule, MatSnackBarModule],
	providers: [provideStore(), provideStates([MovieState])]
})
export class AppPagesModule {}
