import MercuryTexture from '../assets/textures/2k_mercury.jpg';
import VenusTexture from '../assets/textures/2k_venus_surface.jpg';
import EarthTexture from '../assets/textures/2k_earth_daymap.jpg';
import MarsTexture from '../assets/textures/2k_mars.jpg';
import JupiterTexture from '../assets/textures/2k_jupiter.jpg';
import SaturnTexture from '../assets/textures/2k_saturn.jpg';
import UranusTexture from '../assets/textures/2k_uranus.jpg';
import NeptuneTexture from '../assets/textures/2k_neptune.jpg';

export interface PLANET {
    id: number,
    planetName: string,        
    planetRadius: number,
    distance: number,
    orbitZ: number,
    textures: string,
    labelTop: string
}

export const PLANETS: PLANET[] = [
    {
        id: 2,
        planetName: 'Mercury',        
        planetRadius: 0.2,
        distance: -1.1,
        orbitZ: -1,
        textures: MercuryTexture,
        labelTop: '0.5em'
    },
    {
        id: 3,
        planetName: 'Venus',
        planetRadius: 0.3,
        distance: 2.2,
        orbitZ: 2,
        textures: VenusTexture,
        labelTop: '0.8em'
    },
    {
        id: 4,
        planetName: 'Earth',
        planetRadius: 0.5,
        distance: -3.8,
        orbitZ: 2.2,
        textures: EarthTexture,
        labelTop: '-1.5em'
    },
    {
        id: 5,
        planetName: 'Mars',
        planetRadius: 0.4,
        distance: 5.2,
        orbitZ: -3,
        textures: MarsTexture,
        labelTop: '-1.5em'
    },
    {
        id: 6,
        planetName: 'Jupiter',
        planetRadius: 0.65,
        distance: -5.3,
        orbitZ: -5.3,
        textures: JupiterTexture,
        labelTop: '-1.5em'
    },
    {
        id: 7,
        planetName: 'Saturn',
        planetRadius: 0.55,
        distance: 7.3,
        orbitZ: 5.3,
        textures: SaturnTexture,
        labelTop: '-1.5em'
    },
    {
        id: 8,
        planetName: 'Uranus',
        planetRadius: 0.45,
        distance: -10.5,
        orbitZ: -0.3,
        textures: UranusTexture,
        labelTop: '-1.5em'
    },
    {
        id: 9,
        planetName: 'Neptune',
        planetRadius: 0.45,
        distance: 7.5,
        orbitZ: -9.3,
        textures: NeptuneTexture,
        labelTop: '-1.5em'
    }
]