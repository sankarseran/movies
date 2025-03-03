import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { Movie, onImageError } from '../../shared';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieCardComponent {
  movie: InputSignal<Movie | undefined> = input();
	onImageError = onImageError;
}
