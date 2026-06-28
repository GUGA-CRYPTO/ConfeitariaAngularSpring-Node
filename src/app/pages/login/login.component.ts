import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';

@Component({ selector: 'app-login', standalone: true, imports: [FormsModule, RouterLink], templateUrl: './login.component.html' })
export class LoginComponent { 
    user = 'admin'; 
    pass = 'aura2025'; 
    error = false;
     loading = false;
      constructor(private api: ApiService, private router: Router) { } 
      doLogin() { this.loading = true; this.error = false; this.api.login(this.user, this.pass).subscribe({ next: r => { localStorage.setItem('aura_token', r.token); localStorage.setItem('aura_user', JSON.stringify(r.usuario)); this.router.navigate(['/admin/dashboard']); }, error: () => { this.error = true; this.loading = false; } }); } }
