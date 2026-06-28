import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NgIf } from '@angular/common';
import { filter } from 'rxjs';
import { NavbarComponent } from './layout/navbar.component';
import { FooterComponent } from './layout/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, NgIf],
  template: `
    <app-navbar *ngIf="showPublicLayout"></app-navbar>
    <router-outlet></router-outlet>
    <app-footer *ngIf="showPublicLayout"></app-footer>
  `
})
export class AppComponent {
  showPublicLayout = true;
  constructor(private router: Router) {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      this.showPublicLayout = !this.router.url.startsWith('/admin') && !this.router.url.startsWith('/login');
    });
  }
}
