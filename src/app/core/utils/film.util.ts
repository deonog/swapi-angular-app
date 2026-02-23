import { Film } from '../models/film.model';
import { formatDate } from './date.util';

export interface FilmField {
  label: string;
  value: string;
}

export function getFilmFields(film: Film): FilmField[] {
  return [
    { label: 'Director', value: film.director },
    { label: 'Producer', value: film.producer },
    { label: 'Release Date', value: formatDate(film.release_date) }
  ];
}
