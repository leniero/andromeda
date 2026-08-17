import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.css']
})
export class ChangePasswordComponent {
  passwordForm: FormGroup;
  isSubmitting = false;
  error = '';
  success = '';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      this.isSubmitting = true;
      this.error = '';
      this.success = '';
      this.cdr.detectChanges();

      const { oldPassword, newPassword } = this.passwordForm.value;

      this.authService.changePassword({ oldPassword, newPassword }).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.success = res.message || 'Password changed successfully.';
          this.passwordForm.reset();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.error = err.error?.error || 'Failed to change password. Please check your old password.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/my-account']);
  }
}
