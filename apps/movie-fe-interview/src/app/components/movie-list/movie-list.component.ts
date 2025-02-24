import { ChangeDetectionStrategy, Component, inject, input, InputSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { Movie } from '../../shared';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule, MatButtonModule],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieListComponent {
  movies: InputSignal<Movie[] | undefined> = input();
  private router = inject(Router);
  backupImage = 'assets/images/logo-icon.svg';

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.height = 360;
    imgElement.src = this.backupImage;
  }

  openMovie(movie: Movie): void {
    this.router.navigate(['movie', movie.slug]);
  }
}
