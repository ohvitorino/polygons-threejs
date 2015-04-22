if (!Detector.webgl) Detector.addGetWebGLMessage();

var container, stats;

var camera, controls, scene, renderer, mesh, material;
var group;

var width = 700, height = 600;

init();
render();

function animate() {

	requestAnimationFrame(animate);
	controls.update();

}

function init() {

	camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
	camera.position.z = 5;

	controls = new THREE.OrbitControls(camera, document.getElementById('container'));
//        controls.damping = 0.2;
	controls.addEventListener('change', render);

	scene = new THREE.Scene();

	// lights

	light = new THREE.DirectionalLight(0xffffff);
	light.position.set(1, 1, 1);
	scene.add(light);

	light = new THREE.DirectionalLight(0x002288);
	light.position.set(-1, -1, -1);
	scene.add(light);

	light = new THREE.AmbientLight(0x222222);
	scene.add(light);


	// texture - texture must not be in same folder or there is an error.
	var texture = THREE.ImageUtils.loadTexture('images/texture.jpg', {}, function () {
			// use to test when image gets loaded if it does
			render();
		},
		function () {
			alert('error')
		});

	material = new THREE.MeshBasicMaterial({map: texture});

	group = new THREE.Object3D();

	//load mesh
	//var loader = new THREE.JSONLoader();
	//loader.load('models/cube.js', modelLoadedCallback);

	mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
	group.add(mesh);
	scene.add(group);


	// renderer

	renderer = new THREE.WebGLRenderer(
		{
			antialias: true,
			alpha: true
		}
	);

	renderer.setSize(width, height);

	container = document.getElementById('container');
	container.appendChild(renderer.domElement);

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild(stats.domElement);

	// Bind dropdown event onchange
	$('#ddlGeometry').on('change', changePolygon);

	//

	window.addEventListener('resize', onWindowResize, false);

	animate();

}

function onWindowResize() {

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize(width, height);

	render();

}

function render() {
//        requestAnimationFrame(render);
//        mesh.rotation.y += 0.05;
	renderer.render(scene, camera);
	stats.update();

}

function changePolygon(e) {
	var selected = $(this).val();

	// Remove current mesh
	group.remove(mesh);

	switch (selected) {
		case 'cylinder':
			mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 1, 32), material);
			break;
		case 'sphere':
			mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), material);
			break;
		case 'cube':
			mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
			break;
	}

	group.add(mesh);

	render();
}