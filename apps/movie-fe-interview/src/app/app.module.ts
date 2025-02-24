import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppPagesModule } from './pages/pages.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [CommonModule, RouterModule, BrowserModule, AppPagesModule],
  providers: [provideHttpClient(withInterceptorsFromDi()), provideAnimationsAsync()],
})
export class AppModule {}
