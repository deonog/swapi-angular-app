import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { SwapiService } from './swapi.service';
import { Film } from '../models/film.model';
import { People } from '../models/people.model';
import { Planet } from '../models/planet.model';
import { ApiResponse } from '../models/api-response.model';

describe('SwapiService', () => {
  let service: SwapiService;
  let httpMock: HttpTestingController;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(async () => {
    // Suppress console.error during tests
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    await TestBed.configureTestingModule({
      providers: [
        SwapiService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    });
    service = TestBed.inject(SwapiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Films', () => {
    it('should fetch films list', (done) => {
      const mockResponse: ApiResponse<Film> = {
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            title: 'A New Hope',
            episode_id: 4,
            opening_crawl: 'Test crawl',
            director: 'George Lucas',
            producer: 'Gary Kurtz',
            release_date: '1977-05-25',
            characters: [],
            planets: [],
            starships: [],
            vehicles: [],
            species: [],
            created: '2014-12-10',
            edited: '2014-12-20',
            url: 'https://swapi.dev/api/films/1/'
          }
        ]
      };

      service.getFilms().subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(response.results.length).toBe(1);
        done();
      });

      const req = httpMock.expectOne('https://swapi.dev/api/films');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should fetch films by URL', (done) => {
      const url = 'https://swapi.dev/api/films/?page=2';
      const mockResponse: ApiResponse<Film> = {
        count: 1,
        next: null,
        previous: null,
        results: []
      };

      service.getFilmsByUrl(url).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should fetch single film by URL', (done) => {
      const url = 'https://swapi.dev/api/films/1/';
      const mockFilm: Film = {
        title: 'A New Hope',
        episode_id: 4,
        opening_crawl: 'Test crawl',
        director: 'George Lucas',
        producer: 'Gary Kurtz',
        release_date: '1977-05-25',
        characters: [],
        planets: [],
        starships: [],
        vehicles: [],
        species: [],
        created: '2014-12-10',
        edited: '2014-12-20',
        url: url
      };

      service.getFilmByUrl(url).subscribe((film) => {
        expect(film).toEqual(mockFilm);
        done();
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(mockFilm);
    });

    it('should handle errors when fetching films', (done) => {
      service.getFilms().subscribe({
        next: () => fail('should have failed'),
        error: (error: Error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Error');
          done();
        }
      });

      const req = httpMock.expectOne('https://swapi.dev/api/films');
      req.error(new ProgressEvent('error'), { 
        status: 0, 
        statusText: 'Unknown Error' 
      });
    });
  });

  describe('People', () => {
    it('should fetch people list', (done) => {
      const mockResponse: ApiResponse<People> = {
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            name: 'Luke Skywalker',
            height: '172',
            mass: '77',
            hair_color: 'blond',
            skin_color: 'fair',
            eye_color: 'blue',
            birth_year: '19BBY',
            gender: 'male',
            homeworld: 'https://swapi.dev/api/planets/1/',
            films: [],
            species: [],
            vehicles: [],
            starships: [],
            created: '2014-12-09',
            edited: '2014-12-20',
            url: 'https://swapi.dev/api/people/1/'
          }
        ]
      };

      service.getPeople().subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(response.results.length).toBe(1);
        done();
      });

      const req = httpMock.expectOne('https://swapi.dev/api/people');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should fetch person by URL', (done) => {
      const url = 'https://swapi.dev/api/people/1/';
      const mockPerson: People = {
        name: 'Luke Skywalker',
        height: '172',
        mass: '77',
        hair_color: 'blond',
        skin_color: 'fair',
        eye_color: 'blue',
        birth_year: '19BBY',
        gender: 'male',
        homeworld: 'https://swapi.dev/api/planets/1/',
        films: [],
        species: [],
        vehicles: [],
        starships: [],
        created: '2014-12-09',
        edited: '2014-12-20',
        url: url
      };

      service.getPersonByUrl(url).subscribe((person) => {
        expect(person).toEqual(mockPerson);
        done();
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(mockPerson);
    });
  });

  describe('Planets', () => {
    it('should fetch planets list', (done) => {
      const mockResponse: ApiResponse<Planet> = {
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            name: 'Tatooine',
            rotation_period: '23',
            orbital_period: '304',
            diameter: '10465',
            climate: 'arid',
            gravity: '1 standard',
            terrain: 'desert',
            surface_water: '1',
            population: '200000',
            residents: [],
            films: [],
            created: '2014-12-09',
            edited: '2014-12-20',
            url: 'https://swapi.dev/api/planets/1/'
          }
        ]
      };

      service.getPlanets().subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(response.results.length).toBe(1);
        done();
      });

      const req = httpMock.expectOne('https://swapi.dev/api/planets');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should fetch planet by URL', (done) => {
      const url = 'https://swapi.dev/api/planets/1/';
      const mockPlanet: Planet = {
        name: 'Tatooine',
        rotation_period: '23',
        orbital_period: '304',
        diameter: '10465',
        climate: 'arid',
        gravity: '1 standard',
        terrain: 'desert',
        surface_water: '1',
        population: '200000',
        residents: [],
        films: [],
        created: '2014-12-09',
        edited: '2014-12-20',
        url: url
      };

      service.getPlanetByUrl(url).subscribe((planet) => {
        expect(planet).toEqual(mockPlanet);
        done();
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(mockPlanet);
    });
  });

  describe('Error Handling', () => {
    it('should handle HTTP 404 errors', (done) => {
      service.getFilms().subscribe({
        next: () => fail('should have failed'),
        error: (error: Error) => {
          expect(error).toBeTruthy();
          expect(error.message).toMatch(/404/);
          done();
        }
      });

      const req = httpMock.expectOne('https://swapi.dev/api/films');
      req.flush(null, { 
        status: 404, 
        statusText: 'Http failure response for https://swapi.dev/api/films: 404 Not Found' 
      });
    });

    it('should handle network errors', (done) => {
      service.getPeople().subscribe({
        next: () => fail('should have failed'),
        error: (error: Error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Error');
          done();
        }
      });

      const req = httpMock.expectOne('https://swapi.dev/api/people');
      req.error(new ProgressEvent('error'), { 
        status: 0, 
        statusText: 'Unknown Error' 
      });
    });
  });
});
