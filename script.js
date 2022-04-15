import '/style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import gsap, { random } from 'gsap'
import { RedFormat } from 'three'


/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
// const matcapTexture = textureLoader.load('textures/matcaps/2.png')

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight()
ambientLight.color = new THREE.Color(0xffffff)
ambientLight.intensity = 0.1
scene.add(ambientLight)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001).name('ambientLight')

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(2024, 2024)
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, - 2.25)
scene.add(directionalLight)

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001).name('lightX')
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001).name('lightY')
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001).name('lightZ')
// gui.add(directionalLight.shadow.mapSize, 'x').min(30).max(3000).step(0.001).name('shadowX')
// gui.add(directionalLight.shadow.mapSize, 'y').min(- 5).max(5).step(0.001).name('shadowY')


//reflexion use the color of the floor
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.3)
scene.add(hemisphereLight)
const hemisphere = gui.addFolder('Hemisphere');
hemisphere.add(hemisphereLight, 'intensity').min(0).max(1).step(0.001).name('hemisphereLight')


/**
 * Update all materials
 */
const updateAllMaterials = () => {
    scene.traverse((child) => {
        console.log(child.material)

        if (child.material) {

            child.material.forEach(el => {
                el.envMapIntensity = debugObject.envMapIntensity
                el.needsUpdate = true
                el.roughness = debugObject.elRoughness

            })
            child.material[0].roughness = debugObject.frontRoughness
            child.material[1].roughness = debugObject.sideRoughness
            child.material[0].metalness = debugObject.frontMetalness
            child.material[1].metalness = debugObject.sideMetalness
            child.material.envMap = environmentMap

        }
        // child.castShadow = true
        // child.receiveShadow = true
    })
}


//  Environment map

const environmentMap = cubeTextureLoader.load([
    '/textures/envMap/0/px.jpg',
    '/textures/envMap/0/nx.jpg',
    '/textures/envMap/0/py.jpg',
    '/textures/envMap/0/ny.jpg',
    '/textures/envMap/0/pz.jpg',
    '/textures/envMap/0/nz.jpg'
])

environmentMap.encoding = THREE.sRGBEncoding

scene.background = environmentMap
scene.environment = environmentMap

debugObject.envMapIntensity = 5
gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllMaterials)

debugObject.frontRoughness = 0.1
gui.add(debugObject, 'frontRoughness').min(0).max(1).step(0.0001).onChange(updateAllMaterials)

debugObject.sideRoughness = 0.2
gui.add(debugObject, 'sideRoughness').min(0).max(1).step(0.0001).onChange(updateAllMaterials)

debugObject.frontMetalness = 0
gui.add(debugObject, 'frontMetalness').min(0).max(1).step(0.0001).onChange(updateAllMaterials)
debugObject.sideMetalness = 0
gui.add(debugObject, 'sideMetalness').min(0).max(1).step(0.0001).onChange(updateAllMaterials)



/**
 * Resize
 */
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = -1
camera.position.y = -0.5
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 3 //exposition
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap


gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping
})
    .onFinishChange(() => {
        renderer.toneMapping = Number(renderer.toneMapping)
        updateAllMaterials()
    })
gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)

/**
 * Fonts
 */


var fontLoader = new THREE.FontLoader();

fontLoader.load(
    '/fonts/cypher-A.json',
    (font) => {
        fontLoader.load(
            '/fonts/cypher-A.json',
            (font) => {
                // text
                let sentence = "LlEeRrEeEeLmSw@xEeCeRyIzTuDpAaNpSjLlEeVbIdRhTDUaEeLk".split(' ').join('').split('');
                sentence.forEach((letter, index) => {
                    let geometry = new THREE.TextBufferGeometry(
                        letter,
                        {
                            font: font,
                            size: 0.5,
                            height: 0.1,
                        }
                    )
                    geometry.center()

                    // Material
                    // const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
                    // const material = new THREE.MeshStandardMaterial()
                    const material = [
                        new THREE.MeshStandardMaterial({ color: 0xffffff, }),
                        new THREE.MeshStandardMaterial({ color: 0x000000, })
                    ]
                    const text = new THREE.Mesh(geometry, material)
                    text.position.x = (index - 25) * 0.18;
                    scene.add(text)
                    /**
                           * Animate
                           */
                    gsap.to(text.scale, { duration: 3, delay: 1, z: 2 * Math.random(7), yoyo: true, repeat: -1, })

                    updateAllMaterials()

                })//end foreach

                const background = new THREE.MeshStandardMaterial({
                    color: 0x000000
                })

                const plane = new THREE.Mesh(
                    new THREE.PlaneBufferGeometry(10, 0.7),
                    background
                )
                plane.rotation.y = 0
                plane.position.x = 0
                plane.position.z = -0.01
                scene.add(plane)
            })

    })

/**
 * Animate
 */

const animate = () => {
    // Render
    renderer.render(scene, camera)
    // Update controls
    controls.update()

    // Call animate again on the next frame
    window.requestAnimationFrame(animate)
}

animate()
