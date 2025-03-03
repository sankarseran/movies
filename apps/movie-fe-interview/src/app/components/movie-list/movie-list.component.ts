import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { Movie } from '../../shared';
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [MovieCardComponent],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieListComponent {
  movies: InputSignal<Movie[] | undefined> = input();
}
