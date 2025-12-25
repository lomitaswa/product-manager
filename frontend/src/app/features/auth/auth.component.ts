import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthStore } from '../../core/store/auth.store';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  private fb = inject(FormBuilder);
  readonly store = inject(AuthStore);

  isLoginMode = signal(true);
  authForm: FormGroup;

  constructor() {
    this.authForm = this.fb.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['']
    }, { validators: [this.passwordMatchValidator.bind(this), this.nameValidator.bind(this)] });
  }

  toggleMode(): void {
    this.isLoginMode.update(val => !val);
    this.store.clearError();
    this.authForm.reset();
  }

  nameValidator(g: FormGroup) {
    if (this.isLoginMode()) return null;
    return g.get('name')?.value && g.get('name')?.value.trim().length >= 2
      ? null : { 'nameRequired': true };
  }

  passwordMatchValidator(g: FormGroup) {
    if (this.isLoginMode()) return null;
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  onSubmit(): void {
    if (this.authForm.valid) {
      const { email, password, name } = this.authForm.value;
      if (this.isLoginMode()) {
        this.store.login({ email, password });
      } else {
        this.store.signup({ name, email, password });
      }
    }
  }
}
