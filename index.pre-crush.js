d=new AudioContext,f=0,g=0,h=!0,l=0,m=[],n=0,p=["#f60","#088"];
function q(e){e=e||{};b=!(Math.random()+.5|0),k=e.b||25,t=e.x||(b?800*Math.random():Math.random()+.5|0?800+k:0-k),b=e.y||(b?Math.random()+.5|0?480+k:0-k:Math.random()+.5|0?480-(80-80*Math.random()):80-80*Math.random());e={f:e.f,o:e.f,x:t,y:b,g:e.f?0:(400-t)/400*5,h:e.f?0:(240-b)/240*3,b:k,fill:e.f?"#00f":p[Math.random()*p.length|0],s:e.s,l:e.l,j:function(){return this.x>800+this.b+1||this.x<0-(this.b+1)||this.y>480+this.b+1||this.y<0-(this.b+1)}};m.push(e);return e}
a.onmousemove=function(e){100<e.clientX&&700>e.clientX&&(l=(e.clientX-800)/800*Math.PI*2+Math.PI)};r=q({f:!0,b:45,x:400,y:240});u();
function u(e){c.fillStyle="#000";c.fillRect(0,0,800,480);m=m.filter(function(b){return!b.i});e-n>=1500-100*g&&(q(),n=e);for(b in m)c.fillStyle=m[b].fill,c.shadowColor=m[b].fill,c.shadowBlur=100,c.beginPath(),c.arc(m[b].x,m[b].y,m[b].b,0,2*Math.PI),c.fill(),m[b].o||(m[b].x+=m[b].g,m[b].y+=m[b].h,m[b].i=m[b].j(),h&&Math.sqrt((r.x-m[b].x)*(r.x-m[b].x)+(r.y-m[b].y)*(r.y-m[b].y))<r.b+m[b].b&&(r.i=!0,h=!1,e=d.createOscillator(),e.frequency.value=150,e.connect(d.destination),e.start(d.currentTime),e.stop(d.currentTime+
2)),h&&!m[b].m&&Math.sqrt((400-m[b].x)*(400-m[b].x)+(240-m[b].y)*(240-m[b].y))<75+m[b].b&&Math.atan2(m[b].y-240,m[b].x-400)>=l-Math.PI/4&&Math.atan2(m[b].y-240,m[b].x-400)<=l+Math.PI/4&&(m[b].m=!0,m[b].g=-1*m[b].g,m[b].h=-1*m[b].h,f+=10,0===f%100&&g++,e=d.createOscillator(),e.frequency.value=190,e.connect(d.destination),e.start(d.currentTime),e.stop(d.currentTime+.1)));c.strokeStyle="#fff";c.beginPath();c.arc(400,240,75,l-Math.PI/4,l+Math.PI/4);c.stroke();c.fillStyle="#fff";c.font="26px Arial";c.fillText(f,
20,40);h||c.fillText("BOOM",360,240);requestAnimationFrame(u)};
