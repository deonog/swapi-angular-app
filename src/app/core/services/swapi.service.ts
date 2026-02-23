import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Film } from '../models/film.model';
import { People } from '../models/people.model';
import { Planet } from '../models/planet.model';
import { Starship } from '../models/starship.model';
import { Vehicle } from '../models/vehicle.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class SwapiService {
  private apiUrl = 'https://swapi.dev/api';
  private http = inject(HttpClient);

  getFilms() {
    return this.http.get<ApiResponse<Film>>(`${this.apiUrl}/films`).pipe(catchError(this.handleError));
  }

  getFilmsByUrl(url: string) {
    return this.http.get<ApiResponse<Film>>(url).pipe(catchError(this.handleError));
  }

  getPeople() {
    return this.http.get<ApiResponse<People>>(`${this.apiUrl}/people`).pipe(catchError(this.handleError));
  }

  getPeopleByUrl(url: string) {
    return this.http.get<ApiResponse<People>>(url).pipe(catchError(this.handleError));
  }

  getPlanets() {
    return this.http.get<ApiResponse<Planet>>(`${this.apiUrl}/planets`).pipe(catchError(this.handleError));
  }

  getPlanetsByUrl(url: string) {
    return this.http.get<ApiResponse<Planet>>(url).pipe(catchError(this.handleError));
  }

  getPersonByUrl(url: string): Observable<People> {
    return this.http.get<People>(url).pipe(catchError(this.handleError));
  }

  getPlanetByUrl(url: string): Observable<Planet> {
    return this.http.get<Planet>(url).pipe(catchError(this.handleError));
  }

  getStarshipByUrl(url: string): Observable<Starship> {
    return this.http.get<Starship>(url).pipe(catchError(this.handleError));
  }

  getVehicleByUrl(url: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(url).pipe(catchError(this.handleError));
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    // Check if it's a client error or server error
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