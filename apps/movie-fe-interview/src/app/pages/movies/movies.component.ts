import { ChangeDetectionStrategy, Component, OnInit, inject, Signal, computed, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { MovieState } from '../../shared/state/movie.state';
import { compareArr, LoadMovies, Movie, UpdateQueryParam } from '../../shared';
import { MovieListComponent } from '../../components/movie-list/movie-list.component';
import { MovieFilterComponent } from '../../components/movie-filter/movie-filter.component';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastService } from '../../shared/services/toast.service';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, MovieListComponent, MovieFilterComponent, MatPaginatorModule, MatIconModule],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesComponent implements OnInit {
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  movies: Signal<Movie[]> = this.store.selectSignal(MovieState.getMovies);
  totalLength: Signal<number> = this.store.selectSignal(MovieState.getTotalLength);
  pageSize: Signal<number> = this.store.selectSignal(MovieState.getPageSize);
  pageIndex: Signal<number> = this.store.selectSignal(MovieState.getPageIndex);
  selectedGenres: Signal<string[]> = this.store.selectSignal(MovieState.getGenres);
  searchTerm: Signal<string> = this.store.selectSignal(MovieState.getSearchTerm);

  loading = computed(() => this.movies().length === 0);

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const searchTerm = params['searchTerm'] || '';
      let genres: string[] = [];

      if (params['genre']) {
        genres = Array.isArray(params['genre']) ? params['genre'] : params['genre'].split(',');
      }

      if (this.searchTerm() !== searchTerm || !compareArr(this.selectedGenres(), genres)) {
        this.store.dispatch(new UpdateQueryParam({ term: searchTerm, genres, page: 0, size: 10 }));
      }
    });

    if (!this.searchTerm() && !this.selectedGenres().length) {
      this.store
        .dispatch(new LoadMovies())
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError((err) => {
            this.toastService.showError('Error loading movies. Please try again!');
            return err;
          })
        )
        .subscribe();
    }
  }

  updateQueryParams(params: { term: string; genres: string[] }) {
    this.store.dispatch(new UpdateQueryParam({ ...params, page: 0, size: 10 }));

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        searchTerm: params.term.length ? params.term : null,
        genre: params.genres.length ? params.genres : null,
      },
      queryParamsHandling: 'merge',
    });
  }

  onPageChange(event: PageEvent): void {
    this.store.dispatch(new UpdateQueryParam({ page: event.pageIndex, size: event.pageSize }));
  }

  clearFilters(): void {
    this.updateQueryParams({ term: '', genres: [] });
  }
}
