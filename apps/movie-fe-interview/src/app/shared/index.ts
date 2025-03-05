export { MovieMockClient } from './client/movie-mock.client';
export { Movie, QueryParam, MovieData, MovieStateModel } from './client/movie.model';
export { MovieState } from './state/movie.state';
export {
  AddLastVisitedMovieId,
  LoadMovie,
  LoadMovies,
  LoadPopularMovies,
  LoadLastVisitedMovies,
  UpdateQueryParam,
  LoadGenres,
  ClearMovie,
	UpdateLastVisitedMovieIds
} from './state/movie.actions';
export { compareArr, onImageError } from './utils';
