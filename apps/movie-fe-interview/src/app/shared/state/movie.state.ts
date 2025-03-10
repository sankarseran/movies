import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { of, switchMap, tap } from 'rxjs';
import { Movie, MovieData, MovieStateModel, QueryParam } from '../client/movie.model';
import { MovieMockClient } from '../client/movie-mock.client';
import {
  AddLastVisitedMovieId,
  ClearMovie,
  LoadGenres,
  LoadLastVisitedMovies,
  LoadMovie,
  LoadMovies,
  LoadPopularMovies,
  UpdateLastVisitedMovieIds,
  UpdateQueryParam,
} from './movie.actions';
import { ToastService } from '../services/toast.service';

@State<MovieStateModel>({
  name: 'movies',
  defaults: {
    movieData: { movies: [], totalLength: 0 },
    movie: null,
    lastVisitedMovies: [],
    lastVisitedMovieIds: localStorage.getItem('lastVisitedMovieIds')
      ? JSON.parse(localStorage.getItem('lastVisitedMovieIds') as string)
      : [],
    popularMovies: [],
    queryParam: {
      page: 0,
      size: 10,
      term: '',
      genres: [],
    },
    genresOptions: [],
  },
})
@Injectable()
export class MovieState {
  movieMockClient = inject(MovieMockClient);
  toastService = inject(ToastService);

  @Selector()
  static getPopularMovies(state: MovieStateModel): Movie[] {
    return state?.popularMovies;
  }

  @Selector()
  static getGenresOptions(state: MovieStateModel): string[] {
    return state?.genresOptions;
  }

  @Selector()
  static getMovies(state: MovieStateModel): Movie[] {
    return state.movieData.movies;
  }

  @Selector()
  static getMovie(state: MovieStateModel): Movie | null {
    return state.movie;
  }

  @Selector()
  static getTotalLength(state: MovieStateModel): number {
    return state.movieData.totalLength;
  }

  @Selector()
  static getPageSize(state: MovieStateModel): number {
    return state.queryParam.size;
  }

  @Selector()
  static getPageIndex(state: MovieStateModel): number {
    return state.queryParam.page;
  }

  @Selector()
  static getGenres(state: MovieStateModel): string[] {
    return state.queryParam.genres;
  }

  @Selector()
  static getSearchTerm(state: MovieStateModel): string {
    return state.queryParam.term;
  }

  @Selector()
  static getQueryParam(state: MovieStateModel): QueryParam {
    return state.queryParam;
  }

  @Selector()
  static getLastVisitedMovies(state: MovieStateModel): Movie[] {
    return state.lastVisitedMovies;
  }

  @Action(LoadPopularMovies)
  LoadPopularMovies(ctx: StateContext<MovieStateModel>) {
    return this.movieMockClient.getPopularMovies().pipe(tap((popularMovies) => ctx.patchState({ popularMovies })));
  }

  @Action(LoadLastVisitedMovies)
  LoadLastVisitedMovies(ctx: StateContext<MovieStateModel>) {
    return this.movieMockClient
      .getLastVisitedMovies(ctx.getState().lastVisitedMovieIds)
      .pipe(tap((lastVisitedMovies) => ctx.patchState({ lastVisitedMovies })));
  }

  @Action(UpdateQueryParam)
  updateQueryParam(ctx: StateContext<MovieStateModel>, action: UpdateQueryParam) {
    ctx.patchState({ queryParam: { ...ctx.getState().queryParam, ...action.queryParam } });
    ctx.dispatch(new LoadMovies()).subscribe({
      error: (err) => {
        console.error('Error updating query params:', err);
        this.toastService.showError('Error updating movies for search filters or pagination.');
      },
    });
  }

  @Action(LoadMovies)
  loadMovies(ctx: StateContext<MovieStateModel>) {
    return of(ctx.getState().queryParam).pipe(
      switchMap(({ page, size, term, genres }) =>
        this.movieMockClient
          .getAll(page, size, term, genres)
          .pipe(tap((movieData: MovieData) => ctx.patchState({ movieData })))
      )
    );
  }

  @Action(LoadMovie)
  loadMovie(ctx: StateContext<MovieStateModel>, action: LoadMovie) {
    return this.movieMockClient.getMovieById(action.slug).pipe(tap((movie) => ctx.patchState({ movie })));
  }

  @Action(ClearMovie)
  clearMovie(ctx: StateContext<MovieStateModel>) {
    ctx.patchState({ movie: null });
  }

  @Action(LoadGenres)
  loadGenre(ctx: StateContext<MovieStateModel>) {
    return this.movieMockClient.getGenres().pipe(tap((genresOptions) => ctx.patchState({ genresOptions })));
  }

  @Action(AddLastVisitedMovieId)
  addLastVisitedMovie(ctx: StateContext<MovieStateModel>, action: AddLastVisitedMovieId) {
    try {
      if (!action.movie) return;

      const state = ctx.getState();
      const lastVisitedMovieIds = [action.movie, ...state.lastVisitedMovieIds]
        .filter((idx, index, self) => self.findIndex((id) => id === idx) === index)
        .slice(0, 5);

      localStorage.setItem('lastVisitedMovieIds', JSON.stringify(lastVisitedMovieIds));
      ctx.patchState({ lastVisitedMovieIds });

			ctx.dispatch(new LoadLastVisitedMovies()).subscribe({
				error: (err) => {
					console.error('Error updating query params:', err);
					this.toastService.showError('Error loading last visited movies.');
				},
			});
    } catch (error) {
      console.error('Error saving last visited movies:', error);
      this.toastService.showError('Error saving last visited movie.');
    }
  }

  @Action(UpdateLastVisitedMovieIds)
  updateLastVisitedMovieIds(ctx: StateContext<MovieStateModel>) {
    try {
      const lastVisitedMovieIds = JSON.parse(localStorage.getItem('lastVisitedMovieIds') as string);
      ctx.patchState({ lastVisitedMovieIds: lastVisitedMovieIds || [] });

			ctx.dispatch(new LoadLastVisitedMovies()).subscribe({
				error: (err) => {
					console.error('Error updating query params:', err);
					this.toastService.showError('Error loading last visited movies.');
				},
			});
    } catch (error) {
      console.error('Error saving last visited movies:', error);
      this.toastService.showError('Error saving last visited movie.');
    }
  }
}
