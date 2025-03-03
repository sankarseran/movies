import { Component, ChangeDetectionStrategy, OnInit, inject, Signal, DestroyRef } from '@angular/core';
import { MovieState } from '../../shared/state/movie.state';
import { Store } from '@ngxs/store';
import { LoadPopularMovies, Movie } from '../../shared';
import { MovieListComponent } from '../../components/movie-list/movie-list.component';
import { ToastService } from '../../shared/services/toast.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';

const NAME_KEBAB = 'app-home';

@Component({
  templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
  standalone: true,
  imports: [MovieListComponent, MatIconModule],
  host: { class: NAME_KEBAB },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private toastService = inject(ToastService);
  store = inject(Store);
  movies: Signal<Movie[]> = this.store.selectSignal(MovieState.getPopularMovies);

  ngOnInit(): void {
    this.store.dispatch(new LoadPopularMovies())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: () => {
          this.toastService.showError('Error loading popular movies. Please try again!');
        },
      });
  }
}
