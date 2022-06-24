import { AmbientLight, BufferGeometry, DoubleSide, Float32BufferAttribute, Line, LineBasicMaterial, MathUtils, Mesh, 
MeshBasicMaterial, MeshStandardMaterial, PerspectiveCamera, PointLight, RingGeometry, Scene, SphereGeometry, 
Texture, TextureLoader, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { PLANETS, PLANET } from './static/planets';
import SpaceTexture from './assets/textures/space.jpg';
import SunTexture from './assets/textures/2k_sun.jpg';
import SaturnRingTexture from './assets/textures/2k_saturn_ring_alpha.png';
import MoonTexture from './assets/textures/2k_moon.jpg';
import MoonHaumeaTexture from './assets/textures/2k_haumea_fictional.jpg';

import './style.css'

let scene: Scene, camera: PerspectiveCamera, renderer:WebGLRenderer, 
controls:OrbitControls, sun:Mesh<SphereGeometry, MeshStandardMaterial>, labelRenderer:CSS2DRenderer;
const spheres: Mesh<SphereGeometry, MeshStandardMaterial>[] = []; 

const addStars = () : void => {
    const geometry:SphereGeometry = new SphereGeometry(0.25, 24, 24);
    const material:MeshStandardMaterial = new MeshStandardMaterial( { color: 0xffffff });
    const star: Mesh<SphereGeometry, MeshStandardMaterial> = new Mesh(geometry, material);

    const [x, y, z] = Array(3).fill(3).map(() => MathUtils.randFloatSpread(100));
    star.position.set(x,y,z);
    scene.add(star);
}

const addOrbits = () : void => {    
    let orbitsScale:number = 1.5
    for (let index = 0; index < 8; index++) {
        const vertices:any[] = [];
        const divisions:number = 30;

        for ( let i = 0; i <= divisions; i ++ ) {
            const v: number = ( i / divisions ) * ( Math.PI * 2 );
            const x: number = Math.sin( v );
            const z: number = Math.cos( v );
            vertices.push( x, 0, z );
        }           
        const geometry: BufferGeometry = new BufferGeometry();
        geometry.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
        const material:LineBasicMaterial = new LineBasicMaterial( { color: 0xcccccc, linewidth: 10 } );
        const line: Line<BufferGeometry, LineBasicMaterial> = new Line( geometry, material );
        line.scale.setScalar(orbitsScale);        
        scene.add( line );
        orbitsScale += 1.5;
    }
}

const addSun = () : void => {
    const planetTextures: Texture = new TextureLoader().load(SunTexture);
    const sphereGeometry:SphereGeometry = new SphereGeometry(1,32,32);
    const sphereMaterial:MeshStandardMaterial = new MeshStandardMaterial( { map: planetTextures } );
    sun = new Mesh( sphereGeometry, sphereMaterial );
    scene.add(sun);
    const moonDiv = document.createElement( 'div' );
    moonDiv.className = 'planetLabel';
    moonDiv.textContent = 'Sun';
    moonDiv.style.marginTop = '-3.5em';
    const moonLabel = new CSS2DObject( moonDiv );
    moonLabel.position.set( 0, 0.5, 0 );
    sun.add( moonLabel );
    moonLabel.layers.set( 0 );
}

const addPlanets = () => {    
    PLANETS.forEach((element:PLANET) => {
        const planetTextures: Texture = new TextureLoader().load(element.textures);
        const sphereGeometry: SphereGeometry = new SphereGeometry(element.planetRadius);
        const sphereMaterial: MeshStandardMaterial = new MeshStandardMaterial( { map: planetTextures } );
        const sphere: Mesh<SphereGeometry, MeshStandardMaterial> = new Mesh( sphereGeometry, sphereMaterial ); 

        sphere.position.x = element.distance;        
        sphere.translateZ(element.orbitZ)
        sphere.name = element.planetName;

        if(element.planetName === 'Earth'){
            const moon: Mesh<SphereGeometry, MeshStandardMaterial> = addEarthMoon();
            sphere.add(moon);
            sphere.layers.enableAll();
        }
        
        if(element.planetName === 'Saturn'){
            const saturnRing = addSaturnRing();
            sphere.add(saturnRing);
            saturnRing.position.x = 0.07;
            saturnRing.rotation.x = -0.5 * Math.PI;
            saturnRing.rotation.z = 0.5 * Math.PI;
        }
        // adds label for each planet
        const planetDiv = document.createElement( 'div' );
        planetDiv.className = 'planetLabel';
        planetDiv.textContent = element.planetName;
        planetDiv.style.marginTop = element.labelTop;
        const planetLabel = new CSS2DObject( planetDiv );
        planetLabel.position.set( 0, 0.5, 0 );
        sphere.add( planetLabel );
        planetLabel.layers.set( 0 );

        sun.add( sphere );
        spheres.push(sphere);               
    });
                
}

const addSaturnRing = () : Mesh<RingGeometry, MeshBasicMaterial> => {
    const saturnRingTexture = new TextureLoader().load(SaturnRingTexture);
    const geo = new RingGeometry(0.7,1,32);
    const material = new MeshBasicMaterial({ map: saturnRingTexture, side: DoubleSide})
    const mesh = new Mesh(geo, material);
    return mesh
}

const addEarthMoon = () :Mesh<SphereGeometry, MeshStandardMaterial> => {
    const moonTextures: Texture = new TextureLoader().load(MoonTexture);
    const normalTextures: Texture = new TextureLoader().load(MoonHaumeaTexture)
    const moonGeometry:SphereGeometry = new SphereGeometry(0.2, 32, 32);
    const moonMaterial:MeshStandardMaterial = new MeshStandardMaterial( { map: moonTextures, normalMap: normalTextures } );
    const sphere: Mesh<SphereGeometry, MeshStandardMaterial> = new Mesh( moonGeometry, moonMaterial );          
    sphere.position.x = 1.3;
    const moonDiv = document.createElement( 'div' );
    moonDiv.className = 'planetLabel';
    moonDiv.textContent = 'Moon';
    moonDiv.style.marginTop = '0.1em';
    const moonLabel = new CSS2DObject( moonDiv );
    moonLabel.position.set( 0, 0.5, 0 );
    sphere.add( moonLabel );
    moonLabel.layers.set( 0 );
    return sphere;
}

const init = () : void => {
    
    scene = new Scene();                
    camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 );        

    // add space image as scene background texture   
    const spaceTexture:Texture = new TextureLoader().load(SpaceTexture)
    scene.background = spaceTexture;

    // add planet
    Array(200).fill(1).forEach(addStars);
    addSun();
    addOrbits();
    addPlanets();         

    // add lights to space
    const light:AmbientLight = new AmbientLight(0xFFFFFF, 1);
    scene.add(light)    

    const pointlight:PointLight = new PointLight(0xFFFFFF, 2, 300);
    scene.add(pointlight)  
    
    camera.position.x = 5;  
    camera.position.y = 5;  
    camera.position.z = 5;  

    renderer = new WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize( window.innerWidth, window.innerHeight );
    const element:HTMLDivElement = document.getElementById('space-container') as HTMLDivElement;
    element.appendChild( renderer.domElement );

    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize( window.innerWidth, window.innerHeight );
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';    
    element.appendChild( labelRenderer.domElement );

    controls = new OrbitControls( camera, labelRenderer.domElement );
    controls.target.set( 0, 0, 0 );
    controls.update();

}

const animate = () : void => {

    requestAnimationFrame( animate );
    
    // Sun rotation
    sun.rotateY(0.004);
    // Planet rotation around the sun
    spheres[0].rotation.y += 0.04;
    spheres[1].rotation.y += 0.015;
    spheres[2].rotation.y += 0.01;
    spheres[3].rotation.y += 0.008;
    spheres[4].rotation.y += 0.002;
    spheres[5].rotation.y += 0.0009;
    spheres[6].rotation.y += 0.0004;
    spheres[7].rotation.y += 0.0001;
  
    controls.update();
    renderer.render( scene, camera );
    labelRenderer.render( scene, camera );
}

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize( window.innerWidth, window.innerHeight );
});

init();
animate();
