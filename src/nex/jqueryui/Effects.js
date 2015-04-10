(function(b){b(jQuery)})(function(b){b.effects={effect:{}};(function(b,m){function a(a,b,e){var c=l[b.type]||{};if(null==a)return e||!b.def?null:b.def;a=c.floor?~~a:parseFloat(a);return isNaN(a)?b.def:c.mod?(a+c.mod)%c.mod:0>a?0:c.max<a?c.max:a}function e(a){var e=k(),c=e._rgba=[];a=a.toLowerCase();q(g,function(b,d){var g,h=d.re.exec(a);g=h&&d.parse(h);h=d.space||"rgba";if(g)return g=e[h](g),e[f[h].cache]=g[f[h].cache],c=e._rgba=g._rgba,!1});return c.length?("0,0,0,0"===c.join()&&b.extend(c,n.transparent),
e):n[a]}function c(a,b,e){e=(e+1)%1;return 1>6*e?a+(b-a)*e*6:1>2*e?b:2>3*e?a+(b-a)*(2/3-e)*6:a}var d=/^([\-+])=\s*(\d+\.?\d*)/,g=[{re:/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(a){return[a[1],a[2],a[3],a[4]]}},{re:/rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(a){return[2.55*a[1],2.55*a[2],2.55*a[3],a[4]]}},{re:/#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,parse:function(a){return[parseInt(a[1],
16),parseInt(a[2],16),parseInt(a[3],16)]}},{re:/#([a-f0-9])([a-f0-9])([a-f0-9])/,parse:function(a){return[parseInt(a[1]+a[1],16),parseInt(a[2]+a[2],16),parseInt(a[3]+a[3],16)]}},{re:/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,space:"hsla",parse:function(a){return[a[1],a[2]/100,a[3]/100,a[4]]}}],k=b.Color=function(a,e,c,d){return new b.Color.fn.parse(a,e,c,d)},f={rgba:{props:{red:{idx:0,type:"byte"},green:{idx:1,type:"byte"},blue:{idx:2,
type:"byte"}}},hsla:{props:{hue:{idx:0,type:"degrees"},saturation:{idx:1,type:"percent"},lightness:{idx:2,type:"percent"}}}},l={"byte":{floor:!0,max:255},percent:{max:1},degrees:{mod:360,floor:!0}},s=k.support={},p=b("<p>")[0],n,q=b.each;p.style.cssText="background-color:rgba(1,1,1,.5)";s.rgba=-1<p.style.backgroundColor.indexOf("rgba");q(f,function(a,b){b.cache="_"+a;b.props.alpha={idx:3,type:"percent",def:1}});k.fn=b.extend(k.prototype,{parse:function(c,d,g,w){if(c===m)return this._rgba=[null,null,
null,null],this;if(c.jquery||c.nodeType)c=b(c).css(d),d=m;var l=this,p=b.type(c),y=this._rgba=[];d!==m&&(c=[c,d,g,w],p="array");if("string"===p)return this.parse(e(c)||n._default);if("array"===p)return q(f.rgba.props,function(b,e){y[e.idx]=a(c[e.idx],e)}),this;if("object"===p)return c instanceof k?q(f,function(a,b){c[b.cache]&&(l[b.cache]=c[b.cache].slice())}):q(f,function(e,d){var f=d.cache;q(d.props,function(b,e){if(!l[f]&&d.to){if("alpha"===b||null==c[b])return;l[f]=d.to(l._rgba)}l[f][e.idx]=a(c[b],
e,!0)});l[f]&&0>b.inArray(null,l[f].slice(0,3))&&(l[f][3]=1,d.from&&(l._rgba=d.from(l[f])))}),this},is:function(a){var b=k(a),e=!0,c=this;q(f,function(a,d){var f,g=b[d.cache];g&&(f=c[d.cache]||d.to&&d.to(c._rgba)||[],q(d.props,function(a,b){if(null!=g[b.idx])return e=g[b.idx]===f[b.idx]}));return e});return e},_space:function(){var a=[],b=this;q(f,function(e,c){b[c.cache]&&a.push(e)});return a.pop()},transition:function(b,e){var c=k(b),d=c._space(),g=f[d],h=0===this.alpha()?k("transparent"):this,
m=h[g.cache]||g.to(h._rgba),n=m.slice(),c=c[g.cache];q(g.props,function(b,d){var f=d.idx,g=m[f],h=c[f],k=l[d.type]||{};null!==h&&(null===g?n[f]=h:(k.mod&&(h-g>k.mod/2?g+=k.mod:g-h>k.mod/2&&(g-=k.mod)),n[f]=a((h-g)*e+g,d)))});return this[d](n)},blend:function(a){if(1===this._rgba[3])return this;var e=this._rgba.slice(),c=e.pop(),d=k(a)._rgba;return k(b.map(e,function(a,b){return(1-c)*d[b]+c*a}))},toRgbaString:function(){var a="rgba(",e=b.map(this._rgba,function(a,b){return null==a?2<b?1:0:a});1===
e[3]&&(e.pop(),a="rgb(");return a+e.join()+")"},toHslaString:function(){var a="hsla(",e=b.map(this.hsla(),function(a,b){null==a&&(a=2<b?1:0);b&&3>b&&(a=Math.round(100*a)+"%");return a});1===e[3]&&(e.pop(),a="hsl(");return a+e.join()+")"},toHexString:function(a){var e=this._rgba.slice(),c=e.pop();a&&e.push(~~(255*c));return"#"+b.map(e,function(a){a=(a||0).toString(16);return 1===a.length?"0"+a:a}).join("")},toString:function(){return 0===this._rgba[3]?"transparent":this.toRgbaString()}});k.fn.parse.prototype=
k.fn;f.hsla.to=function(a){if(null==a[0]||null==a[1]||null==a[2])return[null,null,null,a[3]];var b=a[0]/255,e=a[1]/255,c=a[2]/255;a=a[3];var d=Math.max(b,e,c),f=Math.min(b,e,c),g=d-f,h=d+f,k=.5*h,h=0===g?0:.5>=k?g/h:g/(2-h);return[Math.round(f===d?0:b===d?60*(e-c)/g+360:e===d?60*(c-b)/g+120:60*(b-e)/g+240)%360,h,k,null==a?1:a]};f.hsla.from=function(a){if(null==a[0]||null==a[1]||null==a[2])return[null,null,null,a[3]];var b=a[0]/360,e=a[1],d=a[2];a=a[3];e=.5>=d?d*(1+e):d+e-d*e;d=2*d-e;return[Math.round(255*
c(d,e,b+1/3)),Math.round(255*c(d,e,b)),Math.round(255*c(d,e,b-1/3)),a]};q(f,function(e,c){var f=c.props,g=c.cache,l=c.to,n=c.from;k.fn[e]=function(e){l&&!this[g]&&(this[g]=l(this._rgba));if(e===m)return this[g].slice();var c,d=b.type(e),p="array"===d||"object"===d?e:arguments,r=this[g].slice();q(f,function(e,b){var c=p["object"===d?e:b.idx];null==c&&(c=r[b.idx]);r[b.idx]=a(c,b)});return n?(c=k(n(r)),c[g]=r,c):k(r)};q(f,function(a,c){k.fn[a]||(k.fn[a]=function(f){var g=b.type(f),k="alpha"===a?this._hsla?
"hsla":"rgba":e,l=this[k](),m=l[c.idx];if("undefined"===g)return m;"function"===g&&(f=f.call(this,m),g=b.type(f));if(null==f&&c.empty)return this;"string"===g&&(g=d.exec(f))&&(f=m+parseFloat(g[2])*("+"===g[1]?1:-1));l[c.idx]=f;return this[k](l)})})});k.hook=function(a){a=a.split(" ");q(a,function(a,c){b.cssHooks[c]={set:function(a,d){var f,g="";if("transparent"!==d&&("string"!==b.type(d)||(f=e(d)))){d=k(f||d);if(!s.rgba&&1!==d._rgba[3]){for(f="backgroundColor"===c?a.parentNode:a;(""===g||"transparent"===
g)&&f&&f.style;)try{g=b.css(f,"backgroundColor"),f=f.parentNode}catch(l){}d=d.blend(g&&"transparent"!==g?g:"_default")}d=d.toRgbaString()}try{a.style[c]=d}catch(m){}}};b.fx.step[c]=function(a){a.colorInit||(a.start=k(a.elem,c),a.end=k(a.end),a.colorInit=!0);b.cssHooks[c].set(a.elem,a.start.transition(a.end,a.pos))}})};k.hook("backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor");b.cssHooks.borderColor=
{expand:function(a){var b={};q(["Top","Right","Bottom","Left"],function(e,c){b["border"+c+"Color"]=a});return b}};n=b.Color.names={aqua:"#00ffff",black:"#000000",blue:"#0000ff",fuchsia:"#ff00ff",gray:"#808080",green:"#008000",lime:"#00ff00",maroon:"#800000",navy:"#000080",olive:"#808000",purple:"#800080",red:"#ff0000",silver:"#c0c0c0",teal:"#008080",white:"#ffffff",yellow:"#ffff00",transparent:[null,null,null,0],_default:"#ffffff"}})(b);(function(){function h(a){var c,d=a.ownerDocument.defaultView?
a.ownerDocument.defaultView.getComputedStyle(a,null):a.currentStyle,g={};if(d&&d.length&&d[0]&&d[d[0]])for(a=d.length;a--;)c=d[a],"string"===typeof d[c]&&(g[b.camelCase(c)]=d[c]);else for(c in d)"string"===typeof d[c]&&(g[c]=d[c]);return g}var m=["add","remove","toggle"],a={border:1,borderBottom:1,borderColor:1,borderLeft:1,borderRight:1,borderTop:1,borderWidth:1,margin:1,padding:1};b.each(["borderLeftStyle","borderRightStyle","borderBottomStyle","borderTopStyle"],function(a,c){b.fx.step[c]=function(a){if("none"!==
a.end&&!a.setAttr||1===a.pos&&!a.setAttr)b.style(a.elem,c,a.end),a.setAttr=!0}});b.fn.addBack||(b.fn.addBack=function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))});b.effects.animateClass=function(e,c,d,g){var k=b.speed(c,d,g);return this.queue(function(){var c=b(this),d=c.attr("class")||"",g,p=k.children?c.find("*").addBack():c,p=p.map(function(){return{el:b(this),start:h(this)}});g=function(){b.each(m,function(a,b){if(e[b])c[b+"Class"](e[b])})};g();p=p.map(function(){this.end=
h(this.el[0]);var c=this.start,e=this.end,d={},f,g;for(f in e)g=e[f],c[f]===g||a[f]||!b.fx.step[f]&&isNaN(parseFloat(g))||(d[f]=g);this.diff=d;return this});c.attr("class",d);p=p.map(function(){var a=this,c=b.Deferred(),e=b.extend({},k,{queue:!1,complete:function(){c.resolve(a)}});this.el.animate(this.diff,e);return c.promise()});b.when.apply(b,p.get()).done(function(){g();b.each(arguments,function(){var a=this.el;b.each(this.diff,function(b){a.css(b,"")})});k.complete.call(c[0])})})};b.fn.extend({addClass:function(a){return function(c,
d,g,h){return d?b.effects.animateClass.call(this,{add:c},d,g,h):a.apply(this,arguments)}}(b.fn.addClass),removeClass:function(a){return function(c,d,g,h){return 1<arguments.length?b.effects.animateClass.call(this,{remove:c},d,g,h):a.apply(this,arguments)}}(b.fn.removeClass),toggleClass:function(a){return function(c,d,g,h,f){return"boolean"===typeof d||void 0===d?g?b.effects.animateClass.call(this,d?{add:c}:{remove:c},g,h,f):a.apply(this,arguments):b.effects.animateClass.call(this,{toggle:c},d,g,h)}}(b.fn.toggleClass),
switchClass:function(a,c,d,g,h){return b.effects.animateClass.call(this,{add:c,remove:a},d,g,h)}})})();(function(){function h(a,e,c,d){b.isPlainObject(a)&&(e=a,a=a.effect);a={effect:a};null==e&&(e={});b.isFunction(e)&&(d=e,c=null,e={});if("number"===typeof e||b.fx.speeds[e])d=c,c=e,e={};b.isFunction(c)&&(d=c,c=null);e&&b.extend(a,e);c=c||e.duration;a.duration=b.fx.off?0:"number"===typeof c?c:c in b.fx.speeds?b.fx.speeds[c]:b.fx.speeds._default;a.complete=d||e.complete;return a}function m(a){return!a||
"number"===typeof a||b.fx.speeds[a]||"string"===typeof a&&!b.effects.effect[a]||b.isFunction(a)||"object"===typeof a&&!a.effect?!0:!1}b.extend(b.effects,{version:"1.11.3",save:function(a,b){for(var c=0;c<b.length;c++)null!==b[c]&&a.data("ui-effects-"+b[c],a[0].style[b[c]])},restore:function(a,b){var c,d;for(d=0;d<b.length;d++)null!==b[d]&&(c=a.data("ui-effects-"+b[d]),void 0===c&&(c=""),a.css(b[d],c))},setMode:function(a,b){"toggle"===b&&(b=a.is(":hidden")?"show":"hide");return b},getBaseline:function(a,
b){var c,d;switch(a[0]){case "top":c=0;break;case "middle":c=.5;break;case "bottom":c=1;break;default:c=a[0]/b.height}switch(a[1]){case "left":d=0;break;case "center":d=.5;break;case "right":d=1;break;default:d=a[1]/b.width}return{x:d,y:c}},createWrapper:function(a){if(a.parent().is(".ui-effects-wrapper"))return a.parent();var e={width:a.outerWidth(!0),height:a.outerHeight(!0),"float":a.css("float")},c=b("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%",background:"transparent",border:"none",
margin:0,padding:0}),d={width:a.width(),height:a.height()},g=document.activeElement;try{g.id}catch(h){g=document.body}a.wrap(c);(a[0]===g||b.contains(a[0],g))&&b(g).focus();c=a.parent();"static"===a.css("position")?(c.css({position:"relative"}),a.css({position:"relative"})):(b.extend(e,{position:a.css("position"),zIndex:a.css("z-index")}),b.each(["top","left","bottom","right"],function(b,c){e[c]=a.css(c);isNaN(parseInt(e[c],10))&&(e[c]="auto")}),a.css({position:"relative",top:0,left:0,right:"auto",
bottom:"auto"}));a.css(d);return c.css(e).show()},removeWrapper:function(a){var e=document.activeElement;a.parent().is(".ui-effects-wrapper")&&(a.parent().replaceWith(a),(a[0]===e||b.contains(a[0],e))&&b(e).focus());return a},setTransition:function(a,e,c,d){d=d||{};b.each(e,function(b,e){var f=a.cssUnit(e);0<f[0]&&(d[e]=f[0]*c+f[1])});return d}});b.fn.extend({effect:function(){function a(a){function c(){b.isFunction(h)&&h.call(d[0]);b.isFunction(a)&&a()}var d=b(this),h=e.complete,m=e.mode;(d.is(":hidden")?
"hide"===m:"show"===m)?(d[m](),c()):g.call(d[0],e,c)}var e=h.apply(this,arguments),c=e.mode,d=e.queue,g=b.effects.effect[e.effect];return b.fx.off||!g?c?this[c](e.duration,e.complete):this.each(function(){e.complete&&e.complete.call(this)}):!1===d?this.each(a):this.queue(d||"fx",a)},show:function(a){return function(b){if(m(b))return a.apply(this,arguments);var c=h.apply(this,arguments);c.mode="show";return this.effect.call(this,c)}}(b.fn.show),hide:function(a){return function(b){if(m(b))return a.apply(this,
arguments);var c=h.apply(this,arguments);c.mode="hide";return this.effect.call(this,c)}}(b.fn.hide),toggle:function(a){return function(b){if(m(b)||"boolean"===typeof b)return a.apply(this,arguments);var c=h.apply(this,arguments);c.mode="toggle";return this.effect.call(this,c)}}(b.fn.toggle),cssUnit:function(a){var e=this.css(a),c=[];b.each(["em","px","%","pt"],function(a,b){0<e.indexOf(b)&&(c=[parseFloat(e),b])});return c}})})();(function(){var h={};b.each(["Quad","Cubic","Quart","Quint","Expo"],
function(b,a){h[a]=function(a){return Math.pow(a,b+2)}});b.extend(h,{Sine:function(b){return 1-Math.cos(b*Math.PI/2)},Circ:function(b){return 1-Math.sqrt(1-b*b)},Elastic:function(b){return 0===b||1===b?b:-Math.pow(2,8*(b-1))*Math.sin((80*(b-1)-7.5)*Math.PI/15)},Back:function(b){return b*b*(3*b-2)},Bounce:function(b){for(var a,e=4;b<((a=Math.pow(2,--e))-1)/11;);return 1/Math.pow(4,3-e)-7.5625*Math.pow((3*a-2)/22-b,2)}});b.each(h,function(h,a){b.easing["easeIn"+h]=a;b.easing["easeOut"+h]=function(b){return 1-
a(1-b)};b.easing["easeInOut"+h]=function(b){return.5>b?a(2*b)/2:1-a(-2*b+2)/2}})})();b.effects.effect.blind=function(h,m){var a=b(this),e="position top bottom left right height width".split(" "),c=b.effects.setMode(a,h.mode||"hide"),d=h.direction||"up",g=/up|down|vertical/.test(d),k=g?"height":"width",f=g?"top":"left",d=/up|left|vertical|horizontal/.test(d),l={},s="show"===c,p,n,q;a.parent().is(".ui-effects-wrapper")?b.effects.save(a.parent(),e):b.effects.save(a,e);a.show();p=b.effects.createWrapper(a).css({overflow:"hidden"});
n=p[k]();q=parseFloat(p.css(f))||0;l[k]=s?n:0;d||(a.css(g?"bottom":"right",0).css(g?"top":"left","auto").css({position:"absolute"}),l[f]=s?q:n+q);s&&(p.css(k,0),d||p.css(f,q+n));p.animate(l,{duration:h.duration,easing:h.easing,queue:!1,complete:function(){"hide"===c&&a.hide();b.effects.restore(a,e);b.effects.removeWrapper(a);m()}})};b.effects.effect.bounce=function(h,m){var a=b(this),e="position top bottom left right height width".split(" "),c=b.effects.setMode(a,h.mode||"effect"),d="hide"===c,g=
"show"===c,k=h.direction||"up",c=h.distance,f=h.times||5,l=2*f+(g||d?1:0),s=h.duration/l,p=h.easing,n="up"===k||"down"===k?"top":"left",k="up"===k||"left"===k,q,r,t=a.queue(),u=t.length;(g||d)&&e.push("opacity");b.effects.save(a,e);a.show();b.effects.createWrapper(a);c||(c=a["top"===n?"outerHeight":"outerWidth"]()/3);g&&(r={opacity:1},r[n]=0,a.css("opacity",0).css(n,k?2*-c:2*c).animate(r,s,p));d&&(c/=Math.pow(2,f-1));r={};for(g=r[n]=0;g<f;g++)q={},q[n]=(k?"-=":"+=")+c,a.animate(q,s,p).animate(r,s,
p),c=d?2*c:c/2;d&&(q={opacity:0},q[n]=(k?"-=":"+=")+c,a.animate(q,s,p));a.queue(function(){d&&a.hide();b.effects.restore(a,e);b.effects.removeWrapper(a);m()});1<u&&t.splice.apply(t,[1,0].concat(t.splice(u,l+1)));a.dequeue()};b.effects.effect.clip=function(h,m){var a=b(this),e="position top bottom left right height width".split(" "),c="show"===b.effects.setMode(a,h.mode||"hide"),d="vertical"===(h.direction||"vertical"),g=d?"height":"width",d=d?"top":"left",k={},f,l;b.effects.save(a,e);a.show();f=b.effects.createWrapper(a).css({overflow:"hidden"});
f="IMG"===a[0].tagName?f:a;l=f[g]();c&&(f.css(g,0),f.css(d,l/2));k[g]=c?l:0;k[d]=c?0:l/2;f.animate(k,{queue:!1,duration:h.duration,easing:h.easing,complete:function(){c||a.hide();b.effects.restore(a,e);b.effects.removeWrapper(a);m()}})};b.effects.effect.drop=function(h,m){var a=b(this),e="position top bottom left right opacity height width".split(" "),c=b.effects.setMode(a,h.mode||"hide"),d="show"===c,g=h.direction||"left",k="up"===g||"down"===g?"top":"left",g="up"===g||"left"===g?"pos":"neg",f={opacity:d?
1:0},l;b.effects.save(a,e);a.show();b.effects.createWrapper(a);l=h.distance||a["top"===k?"outerHeight":"outerWidth"](!0)/2;d&&a.css("opacity",0).css(k,"pos"===g?-l:l);f[k]=(d?"pos"===g?"+=":"-=":"pos"===g?"-=":"+=")+l;a.animate(f,{queue:!1,duration:h.duration,easing:h.easing,complete:function(){"hide"===c&&a.hide();b.effects.restore(a,e);b.effects.removeWrapper(a);m()}})};b.effects.effect.explode=function(h,m){function a(){s.push(this);s.length===e*c&&(d.css({visibility:"visible"}),b(s).remove(),
g||d.hide(),m())}var e=h.pieces?Math.round(Math.sqrt(h.pieces)):3,c=e,d=b(this),g="show"===b.effects.setMode(d,h.mode||"hide"),k=d.show().css("visibility","hidden").offset(),f=Math.ceil(d.outerWidth()/c),l=Math.ceil(d.outerHeight()/e),s=[],p,n,q,r,t,u;for(p=0;p<e;p++)for(r=k.top+p*l,u=p-(e-1)/2,n=0;n<c;n++)q=k.left+n*f,t=n-(c-1)/2,d.clone().appendTo("body").wrap("<div></div>").css({position:"absolute",visibility:"visible",left:-n*f,top:-p*l}).parent().addClass("ui-effects-explode").css({position:"absolute",
overflow:"hidden",width:f,height:l,left:q+(g?t*f:0),top:r+(g?u*l:0),opacity:g?0:1}).animate({left:q+(g?0:t*f),top:r+(g?0:u*l),opacity:g?1:0},h.duration||500,h.easing,a)};b.effects.effect.fade=function(h,m){var a=b(this),e=b.effects.setMode(a,h.mode||"toggle");a.animate({opacity:e},{queue:!1,duration:h.duration,easing:h.easing,complete:m})};b.effects.effect.fold=function(h,m){var a=b(this),e="position top bottom left right height width".split(" "),c=b.effects.setMode(a,h.mode||"hide"),d="show"===c,
g="hide"===c,c=h.size||15,k=/([0-9]+)%/.exec(c),f=!!h.horizFirst,l=d!==f,s=l?["width","height"]:["height","width"],p=h.duration/2,n,q={},r={};b.effects.save(a,e);a.show();n=b.effects.createWrapper(a).css({overflow:"hidden"});l=l?[n.width(),n.height()]:[n.height(),n.width()];k&&(c=parseInt(k[1],10)/100*l[g?0:1]);d&&n.css(f?{height:0,width:c}:{height:c,width:0});q[s[0]]=d?l[0]:c;r[s[1]]=d?l[1]:0;n.animate(q,p,h.easing).animate(r,p,h.easing,function(){g&&a.hide();b.effects.restore(a,e);b.effects.removeWrapper(a);
m()})};b.effects.effect.highlight=function(h,m){var a=b(this),e=["backgroundImage","backgroundColor","opacity"],c=b.effects.setMode(a,h.mode||"show"),d={backgroundColor:a.css("backgroundColor")};"hide"===c&&(d.opacity=0);b.effects.save(a,e);a.show().css({backgroundImage:"none",backgroundColor:h.color||"#ffff99"}).animate(d,{queue:!1,duration:h.duration,easing:h.easing,complete:function(){"hide"===c&&a.hide();b.effects.restore(a,e);m()}})};b.effects.effect.size=function(h,m){var a,e,c,d,g,k,f=b(this),
l="position top bottom left right width height overflow opacity".split(" ");g="position top bottom left right overflow opacity".split(" ");var s=["width","height","overflow"],p=["fontSize"],n=["borderTopWidth","borderBottomWidth","paddingTop","paddingBottom"],q=["borderLeftWidth","borderRightWidth","paddingLeft","paddingRight"],r=b.effects.setMode(f,h.mode||"effect"),t=h.restore||"effect"!==r,u=h.scale||"both";k=h.origin||["middle","center"];var w=f.css("position"),v=t?l:g,x={height:0,width:0,outerHeight:0,
outerWidth:0};"show"===r&&f.show();g={height:f.height(),width:f.width(),outerHeight:f.outerHeight(),outerWidth:f.outerWidth()};"toggle"===h.mode&&"show"===r?(f.from=h.to||x,f.to=h.from||g):(f.from=h.from||("show"===r?x:g),f.to=h.to||("hide"===r?x:g));c=f.from.height/g.height;d=f.from.width/g.width;a=f.to.height/g.height;e=f.to.width/g.width;if("box"===u||"both"===u)c!==a&&(v=v.concat(n),f.from=b.effects.setTransition(f,n,c,f.from),f.to=b.effects.setTransition(f,n,a,f.to)),d!==e&&(v=v.concat(q),f.from=
b.effects.setTransition(f,q,d,f.from),f.to=b.effects.setTransition(f,q,e,f.to));"content"!==u&&"both"!==u||c===a||(v=v.concat(p).concat(s),f.from=b.effects.setTransition(f,p,c,f.from),f.to=b.effects.setTransition(f,p,a,f.to));b.effects.save(f,v);f.show();b.effects.createWrapper(f);f.css("overflow","hidden").css(f.from);k&&(k=b.effects.getBaseline(k,g),f.from.top=(g.outerHeight-f.outerHeight())*k.y,f.from.left=(g.outerWidth-f.outerWidth())*k.x,f.to.top=(g.outerHeight-f.to.outerHeight)*k.y,f.to.left=
(g.outerWidth-f.to.outerWidth)*k.x);f.css(f.from);if("content"===u||"both"===u)n=n.concat(["marginTop","marginBottom"]).concat(p),q=q.concat(["marginLeft","marginRight"]),s=l.concat(n).concat(q),f.find("*[width]").each(function(){var f=b(this),g=f.height(),k=f.width(),l=f.outerHeight(),m=f.outerWidth();t&&b.effects.save(f,s);f.from={height:g*c,width:k*d,outerHeight:l*c,outerWidth:m*d};f.to={height:g*a,width:k*e,outerHeight:g*a,outerWidth:k*e};c!==a&&(f.from=b.effects.setTransition(f,n,c,f.from),f.to=
b.effects.setTransition(f,n,a,f.to));d!==e&&(f.from=b.effects.setTransition(f,q,d,f.from),f.to=b.effects.setTransition(f,q,e,f.to));f.css(f.from);f.animate(f.to,h.duration,h.easing,function(){t&&b.effects.restore(f,s)})});f.animate(f.to,{queue:!1,duration:h.duration,easing:h.easing,complete:function(){0===f.to.opacity&&f.css("opacity",f.from.opacity);"hide"===r&&f.hide();b.effects.restore(f,v);t||("static"===w?f.css({position:"relative",top:f.to.top,left:f.to.left}):b.each(["top","left"],function(a,
b){f.css(b,function(b,c){var d=parseInt(c,10),e=a?f.to.left:f.to.top;return"auto"===c?e+"px":d+e+"px"})}));b.effects.removeWrapper(f);m()}})};b.effects.effect.scale=function(h,m){var a=b(this),e=b.extend(!0,{},h),c=b.effects.setMode(a,h.mode||"effect"),d=parseInt(h.percent,10)||(0===parseInt(h.percent,10)?0:"hide"===c?0:100),g=h.direction||"both",k=h.origin,f={height:a.height(),width:a.width(),outerHeight:a.outerHeight(),outerWidth:a.outerWidth()},l="horizontal"!==g?d/100:1,d="vertical"!==g?d/100:
1;e.effect="size";e.queue=!1;e.complete=m;"effect"!==c&&(e.origin=k||["middle","center"],e.restore=!0);e.from=h.from||("show"===c?{height:0,width:0,outerHeight:0,outerWidth:0}:f);e.to={height:f.height*l,width:f.width*d,outerHeight:f.outerHeight*l,outerWidth:f.outerWidth*d};e.fade&&("show"===c&&(e.from.opacity=0,e.to.opacity=1),"hide"===c&&(e.from.opacity=1,e.to.opacity=0));a.effect(e)};b.effects.effect.puff=function(h,m){var a=b(this),e=b.effects.setMode(a,h.mode||"hide"),c="hide"===e,d=parseInt(h.percent,
10)||150,g=d/100,k={height:a.height(),width:a.width(),outerHeight:a.outerHeight(),outerWidth:a.outerWidth()};b.extend(h,{effect:"scale",queue:!1,fade:!0,mode:e,complete:m,percent:c?d:100,from:c?k:{height:k.height*g,width:k.width*g,outerHeight:k.outerHeight*g,outerWidth:k.outerWidth*g}});a.effect(h)};b.effects.effect.pulsate=function(h,m){var a=b(this),e=b.effects.setMode(a,h.mode||"show"),c="show"===e,d="hide"===e,e=2*(h.times||5)+(c||"hide"===e?1:0),g=h.duration/e,k=0,f=a.queue(),l=f.length;if(c||
!a.is(":visible"))a.css("opacity",0).show(),k=1;for(c=1;c<e;c++)a.animate({opacity:k},g,h.easing),k=1-k;a.animate({opacity:k},g,h.easing);a.queue(function(){d&&a.hide();m()});1<l&&f.splice.apply(f,[1,0].concat(f.splice(l,e+1)));a.dequeue()};b.effects.effect.shake=function(h,m){var a=b(this),e="position top bottom left right height width".split(" "),c=b.effects.setMode(a,h.mode||"effect"),d=h.direction||"left",g=h.distance||20,k=h.times||3,f=2*k+1,l=Math.round(h.duration/f),s="up"===d||"down"===d?
"top":"left",p="up"===d||"left"===d,d={},n={},q={},r=a.queue(),t=r.length;b.effects.save(a,e);a.show();b.effects.createWrapper(a);d[s]=(p?"-=":"+=")+g;n[s]=(p?"+=":"-=")+2*g;q[s]=(p?"-=":"+=")+2*g;a.animate(d,l,h.easing);for(g=1;g<k;g++)a.animate(n,l,h.easing).animate(q,l,h.easing);a.animate(n,l,h.easing).animate(d,l/2,h.easing).queue(function(){"hide"===c&&a.hide();b.effects.restore(a,e);b.effects.removeWrapper(a);m()});1<t&&r.splice.apply(r,[1,0].concat(r.splice(t,f+1)));a.dequeue()};b.effects.effect.slide=
function(h,m){var a=b(this),e="position top bottom left right width height".split(" "),c=b.effects.setMode(a,h.mode||"show"),d="show"===c,g=h.direction||"left",k="up"===g||"down"===g?"top":"left",g="up"===g||"left"===g,f,l={};b.effects.save(a,e);a.show();f=h.distance||a["top"===k?"outerHeight":"outerWidth"](!0);b.effects.createWrapper(a).css({overflow:"hidden"});d&&a.css(k,g?isNaN(f)?"-"+f:-f:f);l[k]=(d?g?"+=":"-=":g?"-=":"+=")+f;a.animate(l,{queue:!1,duration:h.duration,easing:h.easing,complete:function(){"hide"===
c&&a.hide();b.effects.restore(a,e);b.effects.removeWrapper(a);m()}})};b.effects.effect.transfer=function(h,m){var a=b(this),e=b(h.to),c="fixed"===e.css("position"),d=b("body"),g=c?d.scrollTop():0,d=c?d.scrollLeft():0,k=e.offset(),e={top:k.top-g,left:k.left-d,height:e.innerHeight(),width:e.innerWidth()},k=a.offset(),f=b("<div class='ui-effects-transfer'></div>").appendTo(document.body).addClass(h.className).css({top:k.top-g,left:k.left-d,height:a.innerHeight(),width:a.innerWidth(),position:c?"fixed":
"absolute"}).animate(e,h.duration,h.easing,function(){f.remove();m()})}});