import {
  Component,
  OnChanges,
  SimpleChanges,
  input,
  Signal,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
  output,
  DestroyRef,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Store } from '@ngxs/store';
import { LoadGenres, MovieState } from '../../shared';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-movie-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './movie-filter.component.html',
  styleUrl: './movie-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieFilterComponent implements OnInit, OnChanges {
  private store = inject(Store);
  private breakpointObserver = inject(BreakpointObserver);
  private destroyRef = inject(DestroyRef);
  private toastService = inject(ToastService);

  searchTerm = input<string>('');
  selectedGenres = input<string[]>([]);

  filterChanged = output<{ term: string; genres: string[] }>();
  clearFilters = output<void>();

  searchControl = new FormControl('');
  genreControl = new FormControl<string[]>([]);

  genresOptions: Signal<string[]> = this.store.selectSignal(MovieState.getGenresOptions);
  isSmallScreen = signal<boolean>(false);

  ngOnInit(): void {
    this.store
      .dispatch(new LoadGenres())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: () => {
          this.toastService.showError('Error loading genres filter options. Please try again!');
        },
      });

    this.searchControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef), debounceTime(500)).subscribe(() => {
      this.emitFilterChange();
    });

    this.genreControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.emitFilterChange();
    });

    this.breakpointObserver
      .observe([Breakpoints.XSmall])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.isSmallScreen.set(result.matches);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchTerm']) {
      this.searchControl.setValue(this.searchTerm(), { emitEvent: false });
    }
    if (changes['selectedGenres']) {
      this.genreControl.setValue(this.selectedGenres(), { emitEvent: false });
    }
  }

  emitFilterChange() {
    this.filterChanged.emit({
      term: this.searchControl.value || '',
      genres: this.genreControl.value || [],
    });
  }

  clearAllFilters() {
    this.searchControl.setValue('');
    this.genreControl.setValue([]);
    this.clearFilters.emit();
  }
}
