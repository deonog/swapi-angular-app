import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Film } from '../models/film.model';
import { People } from '../models/people.model';
import { Planet } from '../models/planet.model';

@Injectable({
  providedIn: 'root'
})
export class SwapiService {
  private apiUrl = 'https://swapi.dev/api';
  private http = inject(HttpClient);

  // Films
  getFilms() {
    return this.http.get<Film[]>(`${this.apiUrl}/films`).pipe(catchError(this.handleError));
  }

  getFilm(id: string) {
    return this.http.get<Film>(`${this.apiUrl}/films/${id}`).pipe(catchError(this.handleError));
  }

  // People
  getPeople() {
    return this.http.get<People[]>(`${this.apiUrl}/people`).pipe(catchError(this.handleError));
  }

  getPerson(id: string) {
    return this.http.get<People>(`${this.apiUrl}/people/${id}`).pipe(catchError(this.handleError));
  }

  // Planets
  getPlanets() {
    return this.http.get<Planet[]>(`${this.apiUrl}/planets`).pipe(catchError(this.handleError));
  }

  getPlanet(id: string) {
    return this.http.get<Planet>(`${this.apiUrl}/planets/${id}`).pipe(catchError(this.handleError));
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error: ${error.status} - ${error.message}`;
    }
    console.error('Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  };
}   