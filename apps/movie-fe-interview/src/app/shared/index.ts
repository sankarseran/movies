export { MovieMockClient } from './client/movie-mock.client';
export { Movie, QueryParam, MovieData, MovieStateModel } from './client/movie.model';
export { MovieState } from './state/movie.state';
export {
  AddLastVisitedMovie,
  LoadMovie,
  LoadMovies,
  LoadPopularMovies,
  UpdateQueryParam,
  LoadGenres,
  ClearMovie,
} from './state/movie.actions';
export { compareArr, onImageError } from './utils';
