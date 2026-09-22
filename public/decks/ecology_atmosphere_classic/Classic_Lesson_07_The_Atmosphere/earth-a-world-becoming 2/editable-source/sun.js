'use strict';
(() => {
 const photograph=new Image();photograph.src='assets/sun.png';
 const surface=document.createElement('canvas');surface.width=768;surface.height=768;
 const gl=surface.getContext('webgl',{alpha:true,premultipliedAlpha:false,antialias:false,powerPreference:'low-power'});
 let drawTexture=null,fallbackSurface=photograph;
 const solar=window.SolarSurface={ready:false,draw(ctx,t,w,h){
  const r=Math.min(w,h)*.28,cx=-r*.56,cy=-r*.53,extent=r/.397;
  ctx.save();ctx.globalCompositeOperation='screen';
  const halo=ctx.createRadialGradient(cx,cy,r*.80,cx,cy,r*2.2);halo.addColorStop(0,'#ff93272a');halo.addColorStop(.24,'#e94b1015');halo.addColorStop(.6,'#bc3e0906');halo.addColorStop(1,'#a4290000');ctx.fillStyle=halo;ctx.fillRect(0,0,r*2.5,r*2.5);
  if(drawTexture){drawTexture(t);ctx.drawImage(surface,cx-extent/2,cy-extent/2,extent,extent);}else ctx.drawImage(fallbackSurface,cx-extent/2,cy-extent/2,extent,extent);
  // Fine plasma strands follow rising magnetic loops, rooted on the visible solar limb.
  for(let k=0;k<4;k++){
   const a=.18+k*.37,cycle=(t*.028+k*.27)%1,life=Math.sin(cycle*Math.PI),height=r*(.12+.31*life),spread=.12+.04*k;
   const x0=cx+Math.cos(a)*r*.985,y0=cy+Math.sin(a)*r*.985,x3=cx+Math.cos(a+spread)*r*.986,y3=cy+Math.sin(a+spread)*r*.986;
   const x1=cx+Math.cos(a-.1)*(r+height),y1=cy+Math.sin(a-.1)*(r+height),x2=cx+Math.cos(a+spread+.1)*(r+height),y2=cy+Math.sin(a+spread+.1)*(r+height);
   for(let strand=0;strand<9;strand++){
    ctx.beginPath();for(let i=0;i<=70;i++){let u=i/70,v=1-u,x=v*v*v*x0+3*v*v*u*x1+3*v*u*u*x2+u*u*u*x3,y=v*v*v*y0+3*v*v*u*y1+3*v*u*u*y2+u*u*u*y3;let ripple=Math.sin(u*26-t*1.8+strand*.8)*Math.sin(u*Math.PI)*(1+strand*.25);x+=ripple;y+=Math.cos(u*19-t*1.2+strand)*Math.sin(u*Math.PI)*(1+strand*.2);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
    ctx.strokeStyle=`rgba(255,${95+strand*12},${18+strand*4},${life*(strand===4?.65:.14)})`;ctx.lineWidth=strand===4?1.1:.55;ctx.shadowBlur=strand===4?9:3;ctx.shadowColor='#ff651d';ctx.stroke();
   }
   ctx.shadowBlur=0;
   for(let i=0;i<8;i++){const u=(t*.14+i/8+k*.13)%1,v=1-u,x=v*v*v*x0+3*v*v*u*x1+3*v*u*u*x2+u*u*u*x3,y=v*v*v*y0+3*v*v*u*y1+3*v*u*u*y2+u*u*u*y3;const glow=ctx.createRadialGradient(x,y,0,x,y,4);glow.addColorStop(0,`rgba(255,193,91,${life*.45})`);glow.addColorStop(1,'#ff550000');ctx.fillStyle=glow;ctx.fillRect(x-4,y-4,8,8);}
  }
  // A diffuse, outward-moving storm plume periodically leaves the corona.
  const pulse=(t*.035)%1;for(let i=0;i<38;i++){const p=(pulse+i*.018)%1,a=.55+Math.sin(i*13)*.11,rr=r*(1.01+p*.7),x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr,rrr=2+p*7,alpha=Math.sin(p*Math.PI)*.045;const g=ctx.createRadialGradient(x,y,0,x,y,rrr);g.addColorStop(0,`rgba(255,125,42,${alpha})`);g.addColorStop(1,'#d9490000');ctx.fillStyle=g;ctx.fillRect(x-rrr,y-rrr,rrr*2,rrr*2);}
  ctx.restore();
 }};
 photograph.onload=()=>{solar.ready=true;
  const fallback=document.createElement('canvas');fallback.width=photograph.width;fallback.height=photograph.height;const fc=fallback.getContext('2d');fc.drawImage(photograph,0,0);const pixels=fc.getImageData(0,0,fallback.width,fallback.height);for(let i=0;i<pixels.data.length;i+=4){let m=Math.max(pixels.data[i],pixels.data[i+1],pixels.data[i+2]);pixels.data[i+3]=Math.min(255,Math.max(0,(m-2)*16));}fc.putImageData(pixels,0,0);fallbackSurface=fallback;
  if(!gl)return;
  const vertex='attribute vec2 a;varying vec2 uv;void main(){uv=vec2((a.x+1.)*.5,(1.-a.y)*.5);gl_Position=vec4(a,0.,1.);}';
  const fragment=`precision mediump float;varying vec2 uv;uniform sampler2D tex;uniform float t;
  float hash(vec2 p){return fract(sin(dot(p,vec2(123.34,345.45)))*45673.32);}
  float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
  void main(){vec2 p=uv-.5;float r=length(p);float disk=1.-smoothstep(.385,.414,r);vec2 drift=vec2(noise(uv*23.+vec2(t*.06,0.)),noise(uv*31.+vec2(0.,t*.055)))-.5;vec2 flow=uv+drift*.005*disk;float ang=atan(p.y,p.x);float corona=smoothstep(.386,.43,r);flow+=normalize(p+.0001)*sin(ang*21.-t*.65+r*75.)*.0025*corona;vec3 col=texture2D(tex,flow).rgb;float granular=noise(uv*220.+drift*2.+t*.03);col*=.94+granular*.12;float flare=pow(max(0.,sin(ang*7.-t*.36)),8.)*corona;col+=col*flare*.22;gl_FragColor=vec4(col,smoothstep(.006,.07,max(col.r,max(col.g,col.b))));}`;
  try{const shader=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('Solar shader compilation failed');return s;};const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return;gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const loc=gl.getAttribLocation(program,'a');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,photograph);const tLoc=gl.getUniformLocation(program,'t');gl.viewport(0,0,768,768);drawTexture=t=>{gl.uniform1f(tLoc,t);gl.drawArrays(gl.TRIANGLES,0,6);};surface.addEventListener('webglcontextlost',()=>{drawTexture=null;});}catch{drawTexture=null;}
 };
})();
