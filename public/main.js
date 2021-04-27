import * as THREE from '/build/three.module.js';
import {
  OrbitControls
} from '/jsm/controls/OrbitControls.js';
import {
  ColladaLoader
} from '/jsm/loaders/ColladaLoader.js';

import {
  OBJLoader
} from '/jsm/loaders/OBJLoader.js';




var camera, renderer, scene, controls, intersects;
var mouse = new THREE.Vector2(),
  INTERSECTED;
var raycaster = new THREE.Raycaster();
var objects = [];
const images = [];
const floors = [];
var mesh_id;

load();
init();
animate();


async function load() {
  

  //const texture = new THREE.TextureLoader().load( 'img/campus.jpg' );
  

// immediately use the texture for material creation
  //const material = new THREE.MeshBasicMaterial( { map: texture } );

  const loader = new ColladaLoader();
  const maploader = new OBJLoader();
  const response = await fetch('/api');
  const data = await response.json();

  const f_response = await fetch('/getfloors');
  const f_data = await f_response.json();
  
 

  loader.load( 'models/xxx.dae', function (x) {
    
    var m = x.scene.children[0];
    m.rotation.x = -(Math.PI / 2);
    m.position.x = -3200;
    m.position.z = -180;
    m.rotation.z = Math.PI * 2;
    //m.children[8].rotation.z = Math.PI / 2;
    m.children[8].position.x = 20000;
   
    var count = 0;
    m.children[8].visible = false;
   //m.children[8].material = material;
   

 



    
   for (const row of data) {
    m.children[count].material = m.children[count].material.clone();
    m.children[count].material.color.setHex(FetchColor(row.meshSector));
    m.children[count].name = row.meshName;
    m.children[count].meshid = row.meshId;
    m.children[count].desc = row.meshDesc;
    count++;
    images.push([row.meshImg,row.meshName]);
   
    var legendul = document.getElementById('legendul');
    var li = document.createElement('li');
    var status = document.createElement('img');
        status.className = 'status';
        status.src = 'img/ICON.png';
    
    li.className = 'legendli';
    li.id = `li${row.meshId}`
    legendul.appendChild(li);
    li.innerText = row.meshName;
   
    li.append(status);
    
    for (const f_row of f_data) {
      floors.push(f_row);
      if(f_row.floorId == row.meshId){
        var f_ = document.createElement('li');
        f_.className = 'lifloor';
        f_.id = f_row.Id;
        f_.innerText = f_row.floorName;
        li.appendChild(f_);
      

        if(f_row.floorActivity != "" && f_row.floorActivity != null){
          li.children[0].style.visibility ='visible';
        
          var st = document.createElement('img');
          st.className = 'status';
          st.src = 'img/ICON.png';
          
          f_.append(st);
          f_.children[0].style.visibility ='visible';
        }
      }
    }

    
   
    //console.log(m.children[count]);
   }
   
    
    
    scene.add(m);
    scene.traverse(function (children) {
      objects.push(children);
  
    });
    
  
  }, undefined, function ( error ) {
  
    console.error( error );
  
  } );

  

}

function init() {

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf4f4f4);
  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 155000);
  camera.rotation.y = 45 / 180 * Math.PI;
  controls = new OrbitControls(camera, renderer.domElement);
 
  camera.position.set(1,28000,5000);
  controls.addEventListener('change', render);
  controls.minPolarAngle = 0;
  controls.maxPolarAngle = Math.PI * 0.5;

  // create a global illumination light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  var textureLoader = new THREE.TextureLoader();
  var map = textureLoader.load('/img/1111.PNG');
  const geometry = new THREE.PlaneGeometry(10500, 10500);
  const material = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide, map: map} );
  const plane = new THREE.Mesh( geometry, material );
  plane.rotation.x = -(Math.PI / 2); 
  plane.rotation.z = 8.74;;

  plane.position.z = -7000;
  plane.position.x = 5000;
  scene.add( plane );
  

  const pointlight = new THREE.PointLight(0xffffff, 0.8);
  camera.add(pointlight);
  scene.add(camera);


 
  //const axesHelper = new THREE.AxesHelper(5);
  //scene.add(axesHelper);
  //console.log(axesHelper);

  document.addEventListener('click', onDocumentClick, false);
  document.addEventListener('mousemove', onDocumentMouseMove, false);

}

function animate() {
  controls.update();
  requestAnimationFrame(animate);
  castray();
  render();
}

function render() {
  renderer.render(scene, camera);
}

function castray() {
  raycaster.setFromCamera(mouse, camera);
 
  intersects = raycaster.intersectObjects(objects);
  

  if (intersects.length > 0 ) {
   
    if (intersects[0].object != INTERSECTED) {
      if(intersects[0].object.geometry.type == "PlaneGeometry"){
        return;
      }
      if (INTERSECTED )
      
        INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
        INTERSECTED = intersects[0].object;
       
      INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
      INTERSECTED.material = INTERSECTED.material.clone();
      INTERSECTED.material.color.setHex(0x00ffff);
    }
  } else {
    if (INTERSECTED)
      INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
    INTERSECTED = null;
  }
}

function onDocumentMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  intersects = raycaster.intersectObjects(objects);
}


function GetValues(){
  

  let output = document.querySelector('.output')
  let outputmap = document.querySelector('.mapimg');
  let outputmodal = document.querySelector('#img01');
  let descbody = document.getElementById('desc');
  let str = intersects[0].object.name;
  mesh_id = intersects[0].object.meshid;
  output.innerHTML = str;
  descbody.innerHTML = intersects[0].object.desc;
console.log(images);
  images.forEach(pair => {
    if(pair[1] == str){
      
      outputmodal.src = outputmap.src = `embed/${pair[0]}`;
    }
  });


  
}

function onDocumentClick(event) {
 
  if(event.target.id == 'editbutton'){
    EditModel();
  }

  if(event.target.id == 'ctrlR'){
    var div = document.getElementById('slider');
    var divs = div.getElementsByClassName('slideritem');
    for (const d of divs) {
      d.style.Left == '50px';
    }
  }
  
  

  

  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  console.log(event.target);
  raycaster.setFromCamera(mouse, camera);
  intersects = raycaster.intersectObjects(objects);
  
  if (intersects.length > 0 && intersects[0].object.visible != false) {
    if(intersects[0].object.geometry.type == "PlaneGeometry"){
      return;
    }
    

    openNav();
    console.log(intersects[0].object);
    GetValues();
   

  
    

    let obj_ = intersects[0].object.name;
    var lis = document.getElementsByTagName('li');
   
    
    for (const li_item of lis) {
      if(li_item.innerText == obj_){
      
        li_item.style.fontWeight = 600;
        setTimeout(() => {
          
          li_item.style.fontWeight = 200;
        }, 1000);
        for (const child of li_item.children) {
          child.classList.toggle('visible');
        }
      }
    }
   
  }

  if(event.target.className == 'legendli'){
    openNav();

    var res = scene.getObjectByName(event.target.childNodes[0].data);
    let output = document.querySelector('.output')
    let outputmap = document.querySelector('#mapimg');
    let outputmodal = document.querySelector('#img01');
    let descbody = document.getElementById('desc');

    output.innerHTML = res.name;
   
    descbody.innerHTML = res.desc;
    images.forEach(pair => {
      if(pair[1] == event.target.childNodes[0].data){
        outputmodal.src = outputmap.src = `embed/${pair[0]}`;
      }
    });
    
    for (const c of event.target.children) {
     c.classList.toggle('visible'); 
    }
  }

  if(event.target.classList.contains('lifloor')){
    //var res = scene.getObjectByName(event.target.parentNode.firstChild.nodeValue);
   // console.log(res);
   document.querySelector('#exptype').innerHTML = "floor";
    var id = event.target.id;
    var uniquefloors = [...new Set(floors)];
   uniquefloors.forEach(floor => {
     if(floor.Id == id){

      let output = document.querySelector('.output')
      let descbody = document.getElementById('desc');
      let outputmap = document.querySelector('.mapimg');
    let outputmodal = document.querySelector('#img01');

      output.innerText = floor.floorName;
      descbody.innerText = floor.floorActivity; 
      outputmap.src = `embed/${floor.floorPath}`;
      outputmodal.src = `embed/${floor.floorPath}`;

     }
   });
   
   //const f1_response = await fetch('/getfloor/' + id);
  //const f1_data = await f1_response.json();

  
  }

  
}




function EditModel() {
  
  var btn = document.getElementById('editbutton');
  var title = document.getElementById('title');
  var desc = document.getElementById('desc');
  var sel = document.getElementById('segmentselect');
  var selopt = sel.value;
 console.log(selopt);

 
  
    console.log(btn.innerText);
    if(btn.innerText == 'EDIT'){
      
      btn.innerText = 'SAVE';
      title.contentEditable = true;
      desc.contentEditable = true;
      title.style.backgroundColor = "#fff";
      desc.style.backgroundColor = "#fff";
      sel.style.display = 'block';
      console.log(btn.innerText);
     
   
    }

     else if (btn.innerText == 'SAVE'){
   
     
        const data = [title.innerText,desc.innerText,selopt,mesh_id];
      
        console.log(data);
       fetch('/update', {
          method: 'put',
          body: JSON.stringify(data),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          
        }
      
      })
          .then(checkStatus)
          .then((res)=>{location.reload()});
      
      
      // if(expresstype.innerHTML == 'floor'){
        
      //   const data = [title.innerText,desc.innerText, title.innerText];

      //   console.log(data);
      //  fetch('/updatefloor', {
      //     method: 'put',
      //     body: JSON.stringify(data),
      //     headers: {
      //       'Accept': 'application/json',
      //       'Content-Type': 'application/json'
          
      //   }
      
      // })
      //     .then(checkStatus)
      //     .then((res)=>{location.reload()});
      // }
      
      
      }
      
      function checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
          return response
        } else {
          var error = new Error(response.statusText)
          error.response = response
          throw error
        }
      }
    
  }
 

  
  


function FetchColor(m) {
  switch (m) {
    case "Parkeren":
      m = "0xe8e5d8";
      break;
    case "Restaurant":
      m = "0xc2a487";
      break;
    case "Kantoor":
      m = "0xdcc68e";
      break;
    case "Logistiek":
      m = "0xbccaca";
      break;
    case "Installaties":
      m = "0xadd0b3";
      break;
    case "Algemeen":
      m = "0xcc50b3";
      break
  }
  return m;
};

var legendul = document.getElementById('legendul');
  legendul.addEventListener('click', function(e) {

   if(e.target){
      var endres = scene.getObjectByName(e.target.innerText);
      var curhex = endres.material.color.getHex();
      endres.material.clone();
      endres.material.color.setHex(0xff00ff);
  
      setTimeout(() => {
        endres.material.color.setHex(curhex);
      }, 1000);
   }

  });

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}


window.addEventListener('resize', onWindowResize);


