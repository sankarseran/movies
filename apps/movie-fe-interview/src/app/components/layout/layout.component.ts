import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-layout',
	standalone: true,
	imports: [RouterModule, MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule],
	templateUrl: './layout.component.html',
	styleUrl: './layout.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
	isMenuOpen = false;
}
