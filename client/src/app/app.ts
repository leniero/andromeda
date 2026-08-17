import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { LocationService } from './services/location';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('client');
  private locationService = inject(LocationService);

  ngOnInit() {
    // Prompt for location immediately on app load
    this.locationService.getLocation().catch(err => console.warn(err));
  }
}
