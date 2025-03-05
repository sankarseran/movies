import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal, Signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { LoadLastVisitedMovies, Movie, MovieState } from '../../shared';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit {
  store = inject(Store);
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  movies: Signal<Movie[]> = this.store.selectSignal(MovieState.getLastVisitedMovies);

  isMovies = signal(false);

  ngOnInit(): void {
    this.store.dispatch(new LoadLastVisitedMovies());
    this.router.events
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((event) => event instanceof NavigationEnd)
      )
      .subscribe((event) => {
        this.isMovies.set(event instanceof NavigationEnd && event.url === '/movies');
      });
  }
}
