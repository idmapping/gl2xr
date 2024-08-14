const drawObjIndex=4;
// Primitive Types / Mode : POINTS,LINES,LINE_LOOP,LINE_STRIP,TRIANGLES,TRIANGLE_STRIP,TRIANGLE_FAN
const vertices_circle=[];
for(var i=0;i<=360;i+=0.1){
  var radii=i*(Math.PI/180);
  vertices_circle.push(Math.cos(radii),Math.sin(radii),0);
}
let drawObj;

draw=(view,glLayer)=>{
  if(!xrSession) gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // black
  // gl.clearColor(1.0, 0.0, 0.0, 1.0); // red
  // gl.clearColor(1.0, 1.0, 0.0, 1.0); // yellow
  // gl.clearColor(1.0, 0.0, 1.0, 1.0); // magenta
  // gl.clearColor(0.0, 1.0, 0.0, 1.0); // green
  // gl.clearColor(0.0, 1.0, 1.0, 1.0); // cyan
  // gl.clearColor(0.0, 0.0, 1.0, 1.0); // blue
  // gl.clearColor(1.0, 1.0, 1.0, 1.0); // white
  // gl.colorMask(false,false,false,true);
  if(glLayer){
    const viewport = glLayer.getViewport(view);
    gl.viewport(viewport.x + (view.eye == 'left' ? eyeOffset : -eyeOffset), viewport.y, viewport.width, viewport.height);
  }
  const vertex_buffer=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,vertex_buffer);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(drawObj.vertices),gl.STATIC_DRAW);
  const index_buffer=gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,index_buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(drawObj.indices),gl.STATIC_DRAW);
  var coord = gl.getAttribLocation(program,"coordinates");
  gl.vertexAttribPointer(coord,3,gl.FLOAT,false,0,0);
  gl.enableVertexAttribArray(coord);

  if(drawObj.type=='array'){
    gl.drawArrays(drawObj.mode,drawObj.indices.length,drawObj.count);
  }else{
    gl.drawElements(drawObj.mode,drawObj.indices.length,drawObj.count,0);
  }

}
init=()=>{
  const objectArray=[
    { // 0
      vertices: [0,0,0,],
      mode: gl.POINTS,
      indices: [],
      count: 1,
      size: 10,
      type: 'array'
    },
    { // 1
      vertices: [0,0,0, 0,1,0, 1,0,0],
      mode: gl.POINTS,
      indices: [],
      count: 3,
      size: 10,
      type: 'array'
    },
    { // 2
      vertices: [0,1,0,1,0,0],
      mode: gl.TRIANGLES,
      indices: [],
      count: 3,
      size: 0,
      type: 'array'
    },
    { // 3
      vertices: [0,1,0,1,0,0], //[-0.5,0.5,0.0,-0.5,-0.5,0.0,0.5,-0.5,0.0,],
      mode: gl.TRIANGLES,
      indices: [0,1,2],
      count: gl.UNSIGNED_SHORT,
      size: 0,
      type: 'element'
    },
    { // 4
      vertices: vertices_circle,
      mode: gl.LINES,
      indices: [],
      count: vertices_circle.length/3,
      size: 0,
      type: 'array'
    },
    { // 5
      vertices: vertices_circle,
      mode: gl.LINES,
      indices: [],
      count: vertices_circle.length/3,
      size: 0,
      type: 'array'
    },
  ];
  drawObj=objectArray[drawObjIndex];
  vshader='attribute vec3 coordinates;void main(){gl_Position=vec4(coordinates,2.0);gl_PointSize='+drawObj.size+'.0;}';
  fshader='void main(){gl_FragColor=vec4(1.0,1.0,1.0,1.0);}';
};

initXR();
