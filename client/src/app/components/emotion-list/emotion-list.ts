import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { EmotionService, EmotionData } from '../../services/emotion';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-emotion-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './emotion-list.html',
  styleUrls: ['./emotion-list.css']
})
export class EmotionListComponent implements OnInit {
  emotions: EmotionData[] = [];
  currentUser: any = null;
  private emotionService = inject(EmotionService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  emotionColors: { [key: string]: string } = {
    Anger: 'red', Contempt: 'orangered', Disgust: 'darkorange', Envy: 'gold',
    Guilt: 'yellow', Shame: 'yellowgreen', Fear: 'green', Sadness: 'lightseagreen',
    Surprise: 'skyblue', Interest: 'deepskyblue', Hope: 'dodgerblue',
    Relief: 'blue', Satisfaction: 'slateblue', Joy: 'mediumslateblue', Elation: 'mediumorchid',
    Pride: 'darkviolet'
  };

  emotionEmojis: { [key: string]: string } = {
    Anger: '😡', Contempt: '😒', Disgust: '🤢', Envy: '😐',
    Guilt: '😣', Shame: '😳', Fear: '😨', Sadness: '😢',
    Surprise: '😲', Interest: '🧐', Hope: '🙂', Relief: '😮‍💨',
    Satisfaction: '😊', Joy: '😆', Elation: '😌', Pride: '🥹'
  };

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', month: '2-digit', day: '2-digit', 
      hour: '2-digit', minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  ngOnInit() {
    this.emotionService.getEmotions().subscribe({
      next: (data) => {
        this.emotions = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });

    if (this.authService.isLoggedIn()) {
      this.authService.getCurrentUser().subscribe({
        next: (user) => {
          this.currentUser = user;
          this.cdr.detectChanges();
        },
        error: (err) => {
          // Instead of console.error which triggers the red banner, just warn or silently fail
          console.warn('Could not fetch user profile, they might need to login again.');
          // Optionally logout: this.authService.logout();
        }
      });
    }
  }
}
