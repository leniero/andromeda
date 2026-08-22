import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmotionService, EmotionData } from '../../services/emotion';
import { LocationService } from '../../services/location';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-emotion-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './emotion-form.html',
  styleUrls: ['./emotion-form.css']
})
export class EmotionFormComponent {
  emotionForm: FormGroup;
  isSubmitting = false;
  private fb = inject(FormBuilder);
  private emotionService = inject(EmotionService);
  private locationService = inject(LocationService);
  authService = inject(AuthService);

  emotions = ['Anger', 'Contempt', 'Disgust', 'Envy', 'Guilt', 'Shame', 'Fear', 'Sadness', 'Surprise', 'Interest', 'Hope', 'Relief', 'Satisfaction', 'Joy', 'Elation', 'Pride'];

  emotionEmojis: { [key: string]: string } = {
    Anger: '😡', Contempt: '😒', Disgust: '🤢', Envy: '😐',
    Guilt: '😣', Shame: '😳', Fear: '😨', Sadness: '😢',
    Surprise: '😲', Interest: '🧐', Hope: '🙂', Relief: '😮‍💨',
    Satisfaction: '😊', Joy: '😆', Elation: '😌', Pride: '🥹'
  };

  emotionColors: { [key: string]: string } = {
    Anger: 'rgba(255, 0, 0, 0.7)', Contempt: 'rgba(255, 69, 0, 0.7)', Disgust: 'rgba(255, 140, 0, 0.7)', Envy: 'rgba(255, 215, 0, 0.7)',
    Guilt: 'rgba(255, 255, 0, 0.7)', Shame: 'rgba(154, 205, 50, 0.7)', Fear: 'rgba(0, 128, 0, 0.7)', Sadness: 'rgba(32, 178, 170, 0.7)',
    Surprise: 'rgba(135, 206, 235, 0.7)', Interest: 'rgba(0, 191, 255, 0.7)', Hope: 'rgba(30, 144, 255, 0.7)',
    Relief: 'rgba(0, 0, 255, 0.7)', Satisfaction: 'rgba(106, 90, 205, 0.7)', Joy: 'rgba(123, 104, 238, 0.7)', Elation: 'rgba(186, 85, 211, 0.7)',
    Pride: 'rgba(148, 0, 211, 0.7)'
  };

  get selectedEmotion() { return this.emotionForm.get('emotion')?.value; }
  get selectedColor() { return this.selectedEmotion ? this.emotionColors[this.selectedEmotion] : ''; }

  successMessage = '';
  randomDelay = '0s';

  constructor() {
    this.randomDelay = `-${Math.random() * 4}s`;
    this.emotionForm = this.fb.group({
      emotion: ['', Validators.required],
      reason: ['', [Validators.required, Validators.maxLength(150)]],
      latitude: [0, Validators.required],
      longitude: [0, Validators.required],
      isPublic: [true]
    });
  }

  ngOnInit() {
    this.locationService.getLocation().then(loc => {
      this.emotionForm.patchValue({
        latitude: loc.latitude,
        longitude: loc.longitude
      });
    });
  }

  onSubmit() {
    if (this.emotionForm.valid) {
      this.isSubmitting = true;
      const formData: EmotionData = {
        ...this.emotionForm.value,
        text_input: this.emotionForm.value.reason // map reason to text_input for backend
      };
      
      this.emotionService.logEmotion(formData).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.emotionForm.reset();
          this.successMessage = 'Emotion Logged Successfully';
          setTimeout(() => {
            this.successMessage = '';
            window.location.reload(); 
          }, 1500);
        },
        error: (err) => {
          console.error('Submission failed', err);
          this.isSubmitting = false;
        }
      });
    }
  }
}
