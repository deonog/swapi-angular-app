import { People } from '../models/people.model';

export interface PeopleField {
  label: string;
  value: string;
}

export function getPeopleFields(people: People): PeopleField[] {
  return [
    { label: 'Height', value: people.height + ' cm' },
    { label: 'Mass', value: people.mass + ' kg' },
    { label: 'Hair Color', value: people.hair_color },
    { label: 'Skin Color', value: people.skin_color },
    { label: 'Eye Color', value: people.eye_color },
    { label: 'Birth Year', value: people.birth_year },
    { label: 'Gender', value: people.gender },
  ];
}
