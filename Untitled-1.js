<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Kimi no Na wa Background Test</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<style>
body{ margin:0; overflow:hidden; background:linear-gradient(135deg,#0a0f2a,#1c1034,#1b1f3f);}
#canvas-container{position:fixed;inset:0;}
</style>
</head>
<body>
<div id="canvas-container"></div>

<script>
/* ===== Optimized Three.js Background ===== */
const isMobile = matchMedia("(max-width:768px)").matches;
const renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true });
renderer.setSize(innerWidth,innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
document.getElementById("canvas-container").appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
camera.position.z = 50;
scene.add(new THREE.AmbientLight(0x222222));

// Stars
const stars = [];
const starCount = isMobile ? 60 : 150;
const starGeo = new THREE.SphereGeometry(0.1,6,6);
const starMat = new THREE.MeshBasicMaterial({ color:0xffffff, transparent:true, blending:THREE.AdditiveBlending });
for(let i=0;i<starCount;i++){
  const star = new THREE.Mesh(starGeo, starMat.clone());
  star.position.set((Math.random()-0.5)*200,(Math.random()-0.5)*150,(Math.random()-0.5)*100);
  star.userData={ speed: Math.random()*0.0015+0.0005, offset: Math.random()*Math.PI*2 };
  scene.add(star);
  stars.push(star);
}

// Moon + Halo
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(4,16,16),
  new THREE.MeshBasicMaterial({ color:0xffffcc, transparent:true, opacity:0.9, blending:THREE.AdditiveBlending })
);
moon.position.set(20,15,-20);
scene.add(moon);

const loader = new THREE.TextureLoader();
const moonGlow = new THREE.Sprite(
  new THREE.SpriteMaterial({
    map: loader.load('https://i.imgur.com/7b6J8VJ.png'),
    color:0xffffcc,
    transparent:true,
    opacity:0.5,
    blending:THREE.AdditiveBlending
  })
);
moonGlow.scale.set(20,20,1);
moonGlow.position.copy(moon.position);
scene.add(moonGlow);

// Comet
const comet = new THREE.Mesh(
  new THREE.SphereGeometry(0.4,8,8),
  new THREE.MeshBasicMaterial({ color:0xffcc88, transparent:true, opacity:0.9, blending:THREE.AdditiveBlending })
);
comet.position.set(60,40,-20);
scene.add(comet);

const tailMaterial = new THREE.LineBasicMaterial({ color:0xffcc88, transparent:true, opacity:0.5 });
const tailGeometry = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(0,0,0),
  new THREE.Vector3(-5,-2,0)
]);
const tail = new THREE.Line(tailGeometry, tailMaterial);
comet.add(tail);

// Animate
const clock = new THREE.Clock();
function animate(){
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  stars.forEach(s=>{
    s.position.y += Math.sin(Date.now()*s.userData.speed+s.userData.offset)*0.02;
    s.material.opacity = 0.5+0.5*Math.sin(Date.now()*s.userData.speed+s.userData.offset);
  });

  moon.rotation.y += 0.0005;

  comet.position.x -= 30*delta;
  comet.position.y -= 12*delta;
  if(comet.position.x<-60 || comet.position.y<-20) comet.position.set(60,40,-20);

  renderer.render(scene,camera);
}
animate();

// Resize
window.addEventListener("resize", ()=>{
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});
</script>
</body>
</html>
