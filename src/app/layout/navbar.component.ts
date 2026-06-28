import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar', standalone: true, imports: [RouterLink],
  template: `
<nav class="navbar" id="navbar"><div class="nav-inner"><a class="logo" routerLink="/"><span class="logo-icon">✦</span><span class="logo-text">AURA</span><span class="logo-sub">CONFEITARIA</span></a><ul class="nav-links" id="publicNav"><li><a routerLink="/">Início</a></li><li><a routerLink="/" fragment="about">Sobre</a></li><li><a routerLink="/" fragment="bestsellers">Destaques</a></li><li><a routerLink="/" fragment="testimonials">Depoimentos</a></li><li><a routerLink="/catalogo" class="nav-cta">Catálogo</a></li><li><a routerLink="/login" class="nav-admin-link">⚙ Admin</a></li></ul><button class="hamburger" (click)="menuOpen=!menuOpen"><span></span><span></span><span></span></button></div><div class="mobile-menu" [class.open]="menuOpen"><a routerLink="/" (click)="menuOpen=false">Início</a><a routerLink="/" fragment="about" (click)="menuOpen=false">Sobre</a><a routerLink="/catalogo" (click)="menuOpen=false">Catálogo</a><a routerLink="/login" (click)="menuOpen=false">⚙ Admin</a></div></nav>`
})
export class NavbarComponent { menuOpen = false; }
