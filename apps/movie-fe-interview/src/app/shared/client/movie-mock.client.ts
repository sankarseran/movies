import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Movie } from './movie.model';

@Injectable({
  providedIn: 'root',
})
export class MovieMockClient {
  private readonly dataURL = 'assets/movie.mock-data.json';

  constructor(private http: HttpClient) {}

  getAll(
    page: number,
    size: number,
    term: string,
    genres: string[]
  ): Observable<{ movies: Movie[]; totalLength: number }> {
    const startIndex = page * size;
    const endIndex = startIndex + size;

    return this.http.get<Movie[]>(this.dataURL).pipe(
      map((movies) => {
        const filteredMovies = movies
          .filter((movie) => (term ? movie.title.toLowerCase().includes(term.toLowerCase()) : true))
          .filter((movie) => (genres.length ? genres.some((genre) => movie.genres.includes(genre)) : true));

        return {
          movies: filteredMovies.slice(startIndex, endIndex),
          totalLength: filteredMovies.length,
        };
      })
    );
  }

  getMovieById(slug: string): Observable<Movie | undefined> {
    return this.http.get<Movie[]>(this.dataURL).pipe(map((movies) => movies.find((movie) => movie.slug === slug)));
  }

  getPopularMovies(): Observable<Movie[]> {
    return this.http
      .get<Movie[]>(this.dataURL)
      .pipe(map((movies) => movies.sort((a, b) => Number(b.popularity) - Number(a.popularity)).slice(0, 10)));
  }

  getLastVisitedMovies(ids: string[]): Observable<Movie[]> {
    return this.http
      .get<Movie[]>(this.dataURL)
      .pipe(map((movies) => ids.map((id) => movies.find((movie: Movie) => movie.id === id)!)));
  }

  getGenres(): Observable<string[]> {
    return this.http
      .get<Movie[]>(this.dataURL)
      .pipe(map((movies) => [...new Set(movies.flatMap((movie: Movie) => movie.genres))]));
  }
}
