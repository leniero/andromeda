import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPasswordComponent {
  form: FormGroup;
  isSubmitting = false;
  message = '';
  error = '';
  
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.isSubmitting = true;
    this.error = '';
    this.message = '';

    this.authService.forgotPassword(this.form.value.email).subscribe({
      next: (res) => {
        this.message = res.message;
        this.isSubmitting = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'An error occurred';
        this.isSubmitting = false;
      }
    });
  }
}
