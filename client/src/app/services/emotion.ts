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
  distance?: number;
  isPublic?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EmotionService {
  private http = inject(HttpClient);
  private isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  private apiUrl = this.isLocal ? 'http://localhost:5001/api/emotions' : 'https://andromeda-server.vercel.app/api/emotions';

  constructor() {}

  getEmotions(): Observable<EmotionData[]> {
    return this.http.get<EmotionData[]>(`${this.apiUrl}/get_emotions`);
  }

  getUserEmotions(): Observable<EmotionData[]> {
    return this.http.get<EmotionData[]>(`${this.apiUrl}/get_user_emotions`);
  }

  logEmotion(data: EmotionData): Observable<EmotionData> {
    return this.http.post<EmotionData>(`${this.apiUrl}/submit`, data);
  }

  deleteEmotion(emotionId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${emotionId}`);
  }
}
