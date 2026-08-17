import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EmotionData {
  _id?: string;
  userId?: string;
  emotion: string;
  reason: string;
  latitude: number;
  longitude: number;
  local_time: string;
  text_input?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmotionService {
  private http = inject(HttpClient);
  private apiUrl = 'https://andromeda-server.vercel.app/api/emotions';

  constructor() {}

  getEmotions(): Observable<EmotionData[]> {
    return this.http.get<EmotionData[]>(`${this.apiUrl}/get_emotions`);
  }

  logEmotion(data: EmotionData): Observable<EmotionData> {
    return this.http.post<EmotionData>(`${this.apiUrl}/submit`, data);
  }
}
