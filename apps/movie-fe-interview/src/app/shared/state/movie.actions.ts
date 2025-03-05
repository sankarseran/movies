import { QueryParam } from '../client/movie.model';

const ACTION_SCOPE = '[Movies]';

export class LoadMovies {
  static readonly type = `${ACTION_SCOPE} Load Movies`;
}

export class LoadGenres {
  static readonly type = `${ACTION_SCOPE} Load Genres`;
}

export class LoadMovie {
  static readonly type = `${ACTION_SCOPE} Load Movie`;
  constructor(public slug: string) {}
}

export class ClearMovie {
  static readonly type = `${ACTION_SCOPE} Clear Movie`;
}

export class LoadPopularMovies {
  static readonly type = `${ACTION_SCOPE} Load Popular Movies`;
}

export class LoadLastVisitedMovies {
  static readonly type = `${ACTION_SCOPE} Load Last Visited Movies`;
}

export class UpdateLastVisitedMovieIds {
  static readonly type = `${ACTION_SCOPE} Update Last visited Movies`;
}

export class AddLastVisitedMovieId {
  static readonly type = `${ACTION_SCOPE} Add Last Visited Movie`;
  constructor(public movie: string) {}
}

export class UpdateQueryParam {
  static readonly type = `${ACTION_SCOPE} Update Query Param`;
  constructor(public queryParam: Partial<QueryParam>) {}
}
