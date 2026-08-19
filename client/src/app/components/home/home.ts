import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
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
  @ViewChild(EmotionSpheresComponent) spheresComponent!: EmotionSpheresComponent;
  @ViewChild('fabContainer') fabContainer!: ElementRef;
  showText = true;
  isFormVisible = false;

  toggleText() {
    this.showText = !this.showText;
  }

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
    if (this.isFormVisible && this.spheresComponent) {
      this.spheresComponent.closeDetail();
    }
  }

  @HostListener('document:pointerdown', ['$event'])
  onDocumentClick(event: Event) {
    if (this.isFormVisible && this.fabContainer && !this.fabContainer.nativeElement.contains(event.target)) {
      this.isFormVisible = false;
    }
  }
}
