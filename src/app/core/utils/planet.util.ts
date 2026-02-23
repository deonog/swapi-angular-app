import { Planet } from '../models/planet.model';

export interface PlanetField {
  label: string;
  value: string;
}

export function getPlanetFields(planet: Planet): PlanetField[] {
  return [
    { label: 'Rotation Period', value: planet.rotation_period },
    { label: 'Orbital Period', value: planet.orbital_period },
    { label: 'Diameter', value: planet.diameter + ' km' },
    { label: 'Climate', value: planet.climate },
    { label: 'Gravity', value: planet.gravity },
    { label: 'Terrain', value: planet.terrain },
    { label: 'Surface Water', value: planet.surface_water + '%' },
    { label: 'Population', value: planet.population },
  ];
}
