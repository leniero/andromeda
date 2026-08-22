import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './verify-email.html',
  styleUrls: ['./verify-email.css']
})
export class VerifyEmailComponent implements OnInit {
  isVerifying = true;
  message = '';
  error = '';

  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    if (token) {
      this.authService.verifyEmail(token).subscribe({
        next: (res) => {
          this.message = res.message;
          this.isVerifying = false;
        },
        error: (err) => {
          this.error = err.error?.message || 'Verification failed. The link may be invalid or expired.';
          this.isVerifying = false;
        }
      });
    } else {
      this.error = 'No verification token provided.';
      this.isVerifying = false;
    }
  }
}
