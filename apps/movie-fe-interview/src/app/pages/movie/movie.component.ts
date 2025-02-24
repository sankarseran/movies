import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  OnDestroy,
  OnInit,
  Signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { MovieState } from '../../shared/state/movie.state';
import { AddLastVisitedMovie, LoadMovie, Movie, ClearMovie } from '../../shared';
import { ToastService } from '../../shared/services/toast.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private toastService = inject(ToastService);
  movie: Signal<Movie | null> = this.store.selectSignal(MovieState.getMovie);
  backupImage = 'assets/images/logo-icon.svg';

  constructor() {
    effect(() => {
      const currentMovie = this.movie();

      if (currentMovie !== null) {
        this.store.dispatch(new AddLastVisitedMovie(currentMovie));
      }
    });
  }

  ngOnInit(): void {
    this.loadMovie();
  }

  ngOnDestroy(): void {
    this.store.dispatch(new ClearMovie());
  }

  loadMovie(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.store
        .dispatch(new LoadMovie(slug))
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          error: () => {
            this.toastService.showError('Error loading movies. Please try again!');
          },
        });
    }
  }

  roundPopularity(popularity: string | undefined): number {
    return popularity ? parseFloat(Number(popularity).toFixed(2)) : 0;
  }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.backupImage;
  }
}
