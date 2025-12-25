import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextModule, PasswordModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  async loginGoogle() {
    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['/admin']);
    } catch (err) {
      console.error(err);
    }
  }

  async loginEmail() {
    if (this.loginForm.invalid) return;

    try {
      const { email, password } = this.loginForm.value;
      if (email && password) {
        await this.authService.loginWithEmail(email, password);
        this.router.navigate(['/admin']);
      }
    } catch (err) {
        console.error(err);
        alert('Erro ao fazer login. Verifique suas credenciais.');
    }
  }
}
