export interface Movie {
  id: string;
  title: string;
  popularity: string;
  image: {
    url: string;
    title: string;
  };
  slug: string;
  runtime: string;
  released: string;
  genres: string[];
  budget: number;
  desc: string;
}

export interface QueryParam {
  page: number;
  size: number;
  term: string;
  genres: string[];
}

export interface MovieData {
  movies: Movie[];
  totalLength: number;
}

export interface MovieStateModel {
  movieData: MovieData;
  movie: Movie | null;
  popularMovies: Movie[];
  lastVisitedMovies: Movie[];
  lastVisitedMovieIds: string[];
  queryParam: QueryParam;
  genresOptions: string[];
}
