import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Movie, MovieState } from '../../shared';
import { Store } from '@ngxs/store';
import { MovieListComponent } from '../../components/movie-list/movie-list.component';

@Component({
  selector: 'app-recent',
  standalone: true,
  imports: [CommonModule, MovieListComponent, MatIconModule],
  templateUrl: './recent.component.html',
  styleUrl: './recent.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentComponent {
  store = inject(Store);
  movies: Signal<Movie[]> = this.store.selectSignal(MovieState.getLastVisitedMovies);
}
