e=0,g=0,h=!0,l={x:400,y:240,j:0,b:75,m:!0,r:function(b){this.j=(b.clientX-800)/800*Math.PI*2+Math.PI},i:function(){return{u:this.j-Math.PI/4,e:this.j+Math.PI/4}},h:function(b){return k(this,b)&&Math.atan2(b.y-240,b.x-400)>=this.i().u&&Math.atan2(b.y-240,b.x-400)<=this.i().e},g:function(b){b.w=!0;b.o=-1*b.o;b.s=-1*b.s;e+=10;0===e%100&&g++}},m=[],n=0,p=["#f60","#088"],q=[];
function r(b){b=b||{};d=!(Math.random()+.5|0),f=b.b||25,t=b.x||(d?800*Math.random():Math.random()+.5|0?800+f:0-f),d=b.y||(d?Math.random()+.5|0?480+f:0-f:Math.random()+.5|0?480-(80-80*Math.random()):80-80*Math.random()),f={f:b.f,m:b.f,x:t,y:d,o:b.f?0:(400-t)/400*5,s:b.f?0:(240-d)/240*3,b:f,fill:b.f?"#00f":p[Math.random()*p.length|0],g:b.g,h:b.h,B:function(){c.fillStyle=this.fill;c.shadowColor=this.fill;c.shadowBlur=100;c.beginPath();c.arc(this.x,this.y,this.b,0,2*Math.PI);c.fill()},A:function(){this.x+=
this.o;this.y+=this.s},v:function(){return this.x>800+this.b+1||this.x<0-(this.b+1)||this.y>480+this.b+1||this.y<0-(this.b+1)}};b.f&&q.push(f);m.push(f)}a.onmousemove=function(b){100<b.clientX&&700>b.clientX&&l.r(b)};q.push(l);r({f:!0,b:45,x:400,y:240,g:function(){this.l=!0;h=!1},h:function(b){return k(this,b)}});function k(b,d){return Math.sqrt((b.x-d.x)*(b.x-d.x)+(b.y-d.y)*(b.y-d.y))<b.b+d.b}u();
function u(b){c.fillStyle="#000";c.fillRect(0,0,800,480);m=m.filter(function(b){return!b.l});b-n>=1500-100*g&&(r(),n=b);for(d in m)if(m[d].B(),m[d].m||(m[d].A(),m[d].l=m[d].v()),!m[d].m&&!m[d].w&&h)for(f in q)!q[f].l&&q[f].h(m[d])&&q[f].g&&q[f].g(m[d]);c.strokeStyle="#fff";c.beginPath();c.arc(l.x,l.y,l.b,l.i().u,l.i().e);c.stroke();c.fillStyle="#fff";c.font="26px Arial";c.fillText(e,20,40);h||c.fillText("BOOM",360,240);requestAnimationFrame(u)};
