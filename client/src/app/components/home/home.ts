import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmotionSpheresComponent } from '../emotion-spheres/emotion-spheres';
import { EmotionFormComponent } from '../emotion-form/emotion-form';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, EmotionSpheresComponent, EmotionFormComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  showText = true;
  isFormVisible = false;

  toggleText() {
    this.showText = !this.showText;
  }

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
  }
}
