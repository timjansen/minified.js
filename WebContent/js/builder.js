if(/^u/.test(typeof define)){var def={};this.define=function(h,j){def[h]=j()};this.require=function(h){return def[h]}}
define("minifiedUtil",function(){function h(d){return d.substr(0,3)}function j(d){return null!=d?""+d:""}function k(d){return"string"==typeof d}function n(d){return"function"==typeof d}function l(d){return!!d&&"object"==typeof d}function s(d){return"number"==typeof d}function q(d){return l(d)&&!!d.getDay}function e(d){return!0===d||!1===d}function g(d){var a=typeof d;return"object"==a?!(!d||!d.getDay):"string"==a||"number"==a||e(d)}function t(d){return!!d&&null!=d.length&&!k(d)&&!(d&&d.nodeType)&&
!n(d)}function p(d){return d}function v(d){return d+1}function u(d,a,b){return j(d).replace(a,null!=b?b:"")}function Q(d){return u(d,/[\\\[\]\/{}()*+?.$|^-]/g,"\\$&")}function G(d){return u(d,/^\s+|\s+$/g)}function z(d,a){for(var b in d)d.hasOwnProperty(b)&&a(b,d[b]);return d}function B(d,a){if(d)for(var b=0;b<d.length;b++)a(d[b],b);return d}function H(d,a){var b=[],c=n(a)?a:function(d){return a!=d};B(d,function(d,a){c(d,a)&&b.push(d)});return b}function R(d,a,b){var c=[];d(a,function(d,a){t(d=b(d,
a))?B(d,function(d){c.push(d)}):null!=d&&c.push(d)});return c}function y(d,a){return R(B,d,a)}function E(d){var a=[];z(d,function(d){a.push(d)});return a}function w(d,a){var b=[];B(d,function(d,c){b.push(a(d,c))});return b}function x(d,a){if(t(d)){var b=O(a);return f(O(d).sub(0,b.length),b)}return null!=a&&d.substr(0,a.length)==a}function C(d,a){if(t(d)){var b=O(a);return O(d).sub(-b.length).equals(b)||!b.length}return null!=a&&d.substr(d.length-a.length)==a}function U(d){var a=d.length;return w(d,
function(){return d[--a]})}function I(d,a,b){if(!d)return[];var c=d.length,f=0>a?c+a:a,m=null==b?c:0<=b?b:c+b;return H(d,function(d,a){return a>=f&&a<m})}function J(d,a){var b={};B(d,function(d){b[d]=a});return b}function K(d,a,b){z(d,function(d,c){if(null==a[d]||!b)a[d]=c});return a}function L(d,a){for(var b=n(a)?a:function(d,b){if(a===d)return b},c,f=0;f<d.length;f++)if(null!=(c=b(d[f],f)))return c}function D(d){return w(d,p)}function V(){var d=this;return function(){return new P(r(d,arguments))}}
function a(d){var a={};return H(d,function(d){if(a[d])return!1;a[d]=1;return!0})}function b(d,a){var b=J(a,1);return H(d,function(d){var a=b[d];b[d]=0;return a})}function c(d,a){for(var b=0;b<d.length;b++)if(d[b]==a)return!0;return!1}function f(d,a){var b=n(d)?d():d,c=n(a)?a():a;if(b==c)return!0;if(null==b||null==c)return!1;if(g(b)||g(c))return q(b)&&q(c)&&b.getTime()==c.getTime();if(t(b))return b.length!=c.length?!1:!L(b,function(d,a){if(!f(d,c[a]))return!0});if(t(c))return!1;var m=E(b),r=m.length,
e=0;z(c,function(){e++});return r!=e?!1:!L(m,function(d){if(!f(b[d],c[d]))return!0})}function m(d,a,b){return d.apply(b&&a,w(b||a,p))}function r(d,a,b){return w(d,function(d){return n(d)?m(d,a,b):W})}function S(d,a,b,c){return function(){return m(d,a,y([b,arguments,c],p))}}function A(d,a){return Z(a,0,0,0,d)}function Z(d,a,b,c,f,m,r){function e(d){var a=d.length;return a>r?e(d.substr(0,a-r))+(m||",")+d.substr(a-r):d}var g=0>d,j=/(\d+)(\.(.*))?/.exec((g?-d:d).toFixed(a));d=j[1];for(c=(c||".")+j[3];d.length<
(f||1);)d="0"+d;r&&(d=e(d));return(g?"-":"")+d+(a?b?u(c,/[.,]?0+$/):c:"")}function aa(d,a,b){return null==a||!d?0:60*parseInt(d[a])+parseInt(d[a+1])+b.getTimezoneOffset()}function ea(d,a){if(1==arguments.length)return ea(null,d);if(/^\?/.test(d)){if(""==G(a))return null;d=d.substr(1)}var b,c=(b=/[0#]([.,])[_9]/.exec(d))?b[1]:(b=/^[.,]$/.exec(d))?b[0]:".";b=parseFloat(u(u(u(a,","==c?/\./g:/,/g),c,"."),/^[^\d-]*(-?\d)/,"$1"));return isNaN(b)?W:b}function X(a){return new Date(a.getTime())}function T(a,
b,c){a["set"+b].call(a,a["get"+b].call(a)+c);return a}function Y(a,b,c){return 3>arguments.length?Y(new Date,a,b):T(X(a),b.charAt(0).toUpperCase()+b.substr(1),c)}function fa(a,b,c){var f=b.getTime(),m=c.getTime(),r=m-f;if(0>r)return-fa(a,c,b);if(b={milliseconds:1,seconds:1E3,minutes:6E4,hours:36E5}[a])return r/b;b=a.charAt(0).toUpperCase()+a.substr(1);a=Math.floor(r/{fullYear:31536E6,month:2628E6,date:864E5}[a]-2);f=T(new Date(f),b,a);for(r=a;r<1.2*a+4;r++)if(T(f,b,1).getTime()>m)return r}function ga(a){return u(a,
/['"\t\n\r]/g,function(a){return la[a]})}function ba(a,b){if(ca[a])return ca[a];var c="with(_.isObject(obj)?obj:{}){"+w(a.split(/{{|}}}?/),function(a,b){var d,c=G(a),f=u(c,/^{/),c=c==f?"esc(":"";if(b%2)return(d=/^each\b(\s+([\w_]+(\s*,\s*[\w_]+)?)\s*:)?(.*)/.exec(f))?"each("+(""==G(d[4])?"this":d[4])+", function("+d[2]+"){":(d=/^if\b(.*)/.exec(f))?"if("+d[1]+"){":(d=/^else\b\s*(if\b(.*))?/.exec(f))?"}else "+(d[1]?"if("+d[2]+")":"")+"{":(d=/^\/(if)?/.exec(f))?d[1]?"}\n":"});\n":(d=/^#(.*)/.exec(f))?
d[1]:(d=/(.*)::\s*(.*)/.exec(f))?"print("+c+'_.formatValue("'+ga(d[2])+'",'+(""==G(d[1])?"this":d[1])+(c&&")")+"));\n":"print("+c+(""==G(f)?"this":f)+(c&&")")+");\n";if(""!=a)return'print("'+ga(a)+'");\n'}).join("")+"}",f=new Function("obj","each","esc","print","_",c);return ca[a]=function(a,d){var c=[];f.call(d||a,a,function(a,d){t(a)?B(a,function(a,b){d.call(a,a,b)}):z(a,function(a,b){d.call(b,a,b)})},b||p,function(){m(c.push,c,arguments)},O);return c.join("")}}function ha(a){return u(a,/[<>'"&]/g,
function(a){return"&#"+a.charCodeAt(0)+";"})}function P(a,b){for(var c=0,f=0;f<a.length;f++){var m=a[f];if(b&&t(m))for(var r=0;r<m.length;r++)this[c++]=m[r];else this[c++]=m}this.length=c;this._=!0}function O(){return new P(arguments,!0)}function N(a){return function(b,c){return new P(a(this,b,c))}}function M(a){return function(b,c){return a(this,b,c)}}function F(a){return function(b,c,f){return new P(a(b,c,f))}}var W,da="January,February,March,April,May,June,July,August,September,October,November,December".split(/,/),
ia=w(da,h),ja="Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(/,/),ma=w(ja,h),ka=["am","pm"],la={'"':'\\"',"'":"\\'","\n":"\\n","\t":"\\t","\r":"\\r"},ca={};K({each:M(B),filter:N(H),collect:N(y),map:N(w),toObject:M(J),equals:M(f),sub:N(I),reverse:N(U),find:M(L),startsWith:M(x),endsWith:M(C),contains:M(c),call:N(r),array:M(D),unite:M(V),uniq:N(a),intersection:N(b),join:function(a){return w(this,p).join(a)},sort:function(a){return new P(w(this,p).sort(a))},tap:function(a){a(this);return this}},
P.prototype);K({filter:F(H),collect:F(y),collectObj:F(function(a,b){return R(z,a,b)}),map:F(w),sub:F(I),reverse:F(U),each:B,toObject:J,find:L,contains:c,startsWith:x,endsWith:C,equals:f,keys:F(E),values:F(function(a,b){var c=[];b?B(b,function(b){c.push(a[b])}):z(a,function(a,b){c.push(b)});return c}),call:F(r),array:D,unite:V,uniq:F(a),intersection:F(b),bind:S,partial:function(a,b,c){return S(a,null,b,c)},once:function(a){var b=0;return function(){if(!b++)return m(a,this,arguments)}},nonOp:p,eachObj:z,
mapObj:function(a,b){var c={};z(a,function(a,d){c[a]=b(a,d)});return c},filterObj:function(a,b){var c={},f=n(b)?b:function(a){return b!=a};z(a,function(a,b){f(a,b)&&(c[a]=b)});return c},isList:t,isFunction:n,isObject:l,isNumber:s,isBool:e,isDate:q,isValue:g,isString:k,toString:j,toList:function(a){return t(a)?a:null!=a?[a]:[]},dateClone:X,dateAdd:Y,dateDiff:fa,dateMidnight:function(a){a=a||new Date;return new Date(a.getFullYear(),a.getMonth(),a.getDate())},formatNumber:Z,pad:A,formatValue:function(a,
b){a=u(a,/^\?/);if(q(b)){var c,f,m=a,r=b,e={y:["FullYear",p],M:["Month",v],n:["Month",ia],N:["Month",da],d:["Date",p],m:["Minutes",p],H:["Hours",p],h:["Hours",function(a){return a%12||12}],K:["Hours",v],k:["Hours",function(a){return a%12+1}],s:["Seconds",p],S:["Milliseconds",p],a:["Hours",function(a,b){return(b||ka)[12>a?0:1]}],w:["Day",ma],W:["Day",ja],z:["TimezoneOffset",function(a){if(c)return c;var b=0<a?a:-a;return(0>a?"+":"-")+A(2,Math.floor(b/60))+A(2,b%60)}]};if(f=/^\[(([+-]\d\d)(\d\d))\]\s*(.*)/.exec(a))c=
f[1],r=Y(b,"minutes",aa(f,2,b)),m=f[4];return u(m,/(\w)(\1*)(?:\[([^\]]+)\])?/g,function(a,b,c,d){if(b=e[b])a=r["get"+(t(b)?b[0]:b)].call(r),d=d&&d.split(","),a=t(b[1])?(d||b[1])[a]:b[1](a,d),null!=a&&!k(a)&&(a=A(c.length+1,a));return a})}return L(a.split(/\s*\|\s*/),function(a){var c,d;if(c=/^([<>]?)(=?)([^:]*?)\s*:\s*(.*)$/.exec(a)){a=b;var f=parseFloat(c[3]);if(isNaN(f)||!s(a))a=null==a?"null":j(a),f=c[3];if(c[1]){if(!c[2]&&a==f||"<"==c[1]&&a>f||">"==c[1]&&a<f)return null}else if(a!=f)return null;
a=c[4]}if(s(b)&&(c=/(?:(0[0.,]*)|(#[#.,]*))(_*)(9*)/.exec(a))){d=j(c[1])+j(c[2]);var f=j(c[1]).length?u(d,/[.,]/g).length:1,m=u(u(d,/^.*[0#]/),/[^,.]/g),r=j(c[3]).length+j(c[4]).length,e,g;if(d=/([.,])[^.,]+[.,]/.exec(c[0]))e=d[1],g=d[0].length-2;e=Z(b,r,j(c[3]).length,m,f,e,g);g=a;a=c.index;c=j(c[0]).length;return g.substr(0,a)+e+g.substr(a+c)}return a})},parseDate:function(a,b){var c={y:0,M:[1,1],n:[1,ia],N:[1,da],d:2,m:4,H:3,h:3,K:[3,1],k:[3,1],s:5,S:6,a:[3,ka]},f={},m=1,r,e,g;if(/^\?/.test(a)){if(""==
G(b))return null;a=a.substr(1)}if(g=/^\[([+-]\d\d)(\d\d)\]\s*(.*)/.exec(a))r=g,a=g[3];if(!(g=RegExp(a.replace(/(.)(\1*)(?:\[([^\]]*)\])?/g,function(a,b,c,d){return/[dmhkyhs]/i.test(b)?(f[m++]=b,a=c.length+1,"(\\d"+(2>a?"+":"{1,"+a+"}")+")"):"z"==b?(e=m,m+=2,"([+-]\\d\\d)(\\d\\d)"):/[Nna]/.test(b)?(f[m++]=[b,d&&d.split(",")],"([a-zA-Z\u0080\ufffd\u1fff]+)"):/w/i.test(b)?"[a-zA-Z\u0080\ufffd\u1fff]+":/\s/.test(b)?"\\s+":Q(a)})).exec(b)))return W;for(var j=[0,0,0,0,0,0,0],l=1;l<m;l++){var n=g[l],A=f[l];
if(t(A)){var h=A[0],p=c[h],k=p[0],A=L(A[1]||p[1],function(a,b){return x(n.toLowerCase(),a.toLowerCase())?b:null});if(null==A)return W;j[k]="a"==h?j[k]+12*A:A}else A&&(h=parseInt(n),p=c[A],t(p)?j[p[0]]+=h-p[1]:j[p]+=h)}c=new Date(j[0],j[1],j[2],j[3],j[4],j[5],j[6]);return Y(c,"minutes",-aa(r,1,c)-aa(g,e,c))},parseNumber:ea,copyObj:K,coal:function(){return L(arguments,p)},trim:G,escapeRegExp:Q,escapeHtml:ha,format:function(a,b){return ba(a)(b)},template:ba,htmlTemlplate:function(a){return ba(a,ha)}},
O);return{_:O}});/^u/.test(typeof define)&&(def={},this.define=function(h,j){def[h]=j()},this.require=function(h){return def[h]});
define("minified",function(){function h(a){return null!=a?""+a:""}function j(a){return"string"==typeof a}function k(a){return"function"==typeof a&&!a.item}function n(a){return a&&a.nodeType}function l(a){return a&&null!=a.length&&!j(a)&&!n(a)&&!k(a)}function s(a,b){for(var c in a)a.hasOwnProperty(c)&&b(c,a[c]);return a}function q(a,b){for(var c=0;a&&c<a.length;c++)b(a[c],c);return a}function e(a,b){var c=[],f=k(b)?b:function(a){return b!=a};q(a,function(a,b){f(a,b)&&c.push(a)});return c}function g(a,
b){var c=[];q(a,function(a,m){l(a=b(a,m))?q(a,function(a){c.push(a)}):null!=a&&c.push(a)});return c}function t(a,b){var c=[];s(a,function(a,m){l(a=b(a,m))?q(a,function(a){c.push(a)}):null!=a&&c.push(a)});return c}function p(a,b,c){return h(a).replace(b,c||"")}function v(a){return parseFloat(p(a,/^[^\d-]+/))}function u(a){var b={$position:"absolute",$visibility:"hidden",$display:"block",$height:null},c=a.get(b);a.set(b);b=a.get("$height",!0);a.set(c);return b}function Q(a){a()}function G(){q(J,Q);
J=null}function z(a){J?J.push(a):x.setTimeout(a,0)}function B(a,b,c,f){return function(){var m=y(C.createElement(a));l(b)||"object"!=typeof b?m.add(b):m.set(b).add(c);f&&f(m);return m}}function H(){var a,b=[],c=[],f=function(f,m){null==a&&(a=f,b=m,x.setTimeout(function(){q(c,Q)},0))},m=f.then=function(f,m){var g=H(),e=function(){try{var c=a?f:m;if(k(c)){var e=c.apply(null,b);e&&k(e.then)?e.then(function(a){g(!0,[a])},function(a){g(!1,[a])}):g(!0,[e])}else g(a,b)}catch(j){g(!1,[j])}};null!=a?x.setTimeout(e,
0):c.push(e);return g};f.always=function(a){return m(a,a)};f.error=function(a){return m(0,a)};return f}function R(a){return V[a]||"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}function y(a,b,c){return k(a)?z(a):new w(E(a,b,c))}function E(a,b,c){function f(a){a=function X(a){return l(a)?g(a,X):a}(a);return m?e(a,function(a){for(;a=a.parentNode;){if(a===m)return!0;if(c)return!1}}):a}var m,r,h,n,k;if(b&&1!=(b=E(b)).length)return g(b,function(b){return E(a,b,c)});m=b&&b[0];if(!j(a))return f(l(a)?
a:[a]);if(1<(b=a.split(/\s*,\s*/)).length)return g(b,function(a){return E(a,m,c)});if(b=/(\S+)\s+(.+)$/.exec(a))return E(b[2],E(b[1],m),c);if(a!=(b=p(a,/^#/)))return f([C.getElementById(b)]);m=m||C;r=(b=/([^.]*)\.?([^.]*)/.exec(a))[1];n=b[2];b=(h=m.getElementsByClassName&&n)?m.getElementsByClassName(n):m.getElementsByTagName(r||"*");if(r=h?r:n)k=RegExp("\\b"+r+"\\b","i"),b=e(b,function(a){return k.test(a[h?"nodeName":"className"])});return m?f(b):b}function w(a){for(var b=this.length=a.length,c=0;c<
b;c++)this[c]=a[c]}var x=this,C=document,U=1,I={},J=[],K=[],L=x.requestAnimationFrame||function(a){x.setTimeout(a,33)},D=!!C.all&&!J.map,V={"\t":"\\t","\r":"\\r","\n":"\\n",'"':'\\"',"\\":"\\\\"};s({each:function(a){return q(this,a)},filter:function(a){return new w(e(this,a))},collect:function(a){return new w(g(this,a))},sub:function(a,b){var c=0>a?this.length+a:a,f=0<=b?b:this.length+(b||0);return new w(e(this,function(a,b){return b>=c&&b<f}))},find:function(a){console.log("finding ",a," in ",this);
for(var b,c=k(a)?a:function(b,c){if(a===b)return c},f=0;f<this.length;f++)if(null!=(b=c(this[f],f)))return b;console.log("failed..")},hasClass:function(a){var b=RegExp("\\b"+a+"\\b");return this.find(function(a){return b.test(a.className)?a:null})},remove:function(){q(this,function(a){if(D){var b=function(a){q(I[a.minifieD],function(b){a.detachEvent("on"+b.n,b.h)});delete I[a.minifieD]};q(E("*",a),b);b(a)}a.parentNode.removeChild(a)})},text:function(){function a(b){var c=n(b);return 1==c?g(b.childNodes,
a):5>c?b.data:null}return g(this,a).join("")},get:function(a,b){var c=this,f=c[0];if(f){if(j(a)){var m=p(a,/^[$@]/),e;e="$"==a?f.className:"$$"==a?D?f.style.cssText:f.getAttribute("style"):/\$\$/.test(a)&&("hidden"==f.style.visibility||"none"==f.style.display)?0:"$$fade"==a?isNaN(e=D?v(f.style.filter)/100:v(f.style.opacity))?1:e:"$$slide"==a?c.get("$height"):/^\$/.test(a)?x.getComputedStyle?x.getComputedStyle(f,null).getPropertyValue(p(m,/[A-Z]/g,function(a){return"-"+a.toLowerCase()})):(f.currentStyle||
f.style)[m]:/^@/.test(a)?f.getAttribute(m):f[m];return b?v(e):e}var g={};(l(a)?q:s)(a,function(a){g[a]=c.get(a,b)});return g}},set:function(a,b){var c=this,f;void 0!==b?"$$fade"==a||"$$slide"==a?c.set({$visibility:0<(f=v(b))?"visible":"hidden",$display:"block"}).set("$$fade"==a?D?{$filter:"alpha(opacity = "+100*f+")",$zoom:1}:{$opacity:f}:{$height:/px$/.test(b)?b:function(a,b,c){return f*(f&&u(y(c)))+"px"},$overflow:"hidden"}):q(c,function(c,f){var e=p(a,/^[@$]/),g=c.className||"",j=/^\$/.test(a)?
c.style:c,h=k(b)?b(y(c).get(a),f,c):b;"$"==a?null!=h&&(q(h.split(/\s+/),function(a){var b=p(a,/^[+-]/),c=g;g=p(g,RegExp("\\b"+b+"\\b"));if(/^\+/.test(a)||b==a&&c==g)g+=" "+b}),c.className=p(g,/^\s+|\s+(?=\s|$)/g)):"$$"==a?D?j.cssText=h:null!=h?c.setAttribute("style",h):c.removeAttribute("style"):/^@/.test(a)?null!=h?j.setAttribute(e,h):j.removeAttribute(e):j[e]=h}):j(a)||k(a)?c.set("$",a):s(a,function(a,b){c.set(a,b)});return c},add:function(a,b){return q(this,function(c,f){var g;(function S(a){l(a)?
q(a,S):k(a)?S(a(c,f)):null!=a&&(a=n(a)?a:C.createTextNode(a),g?g.parentNode.insertBefore(a,g.nextSibling):b?b(a,c,c.parentNode):c.appendChild(a),g=a)})(n(a)&&f?null:a)})},fill:function(a){return q(this,function(a){y(a.childNodes).remove()}).add(a)},addBefore:function(a){return this.add(a,function(a,c,f){f.insertBefore(a,c)})},addAfter:function(a){return this.add(a,function(a,c,f){f.insertBefore(a,c.nextSibling)})},addFront:function(a){return this.add(a,function(a,c){c.insertBefore(a,c.firstChild)})},
replace:function(a){return this.add(a,function(a,c,f){f.replaceChild(a,c)})},clone:function(a){return new w(g(this,function(b){var c=n(b);if(1==c){var f={$:b.className||null,$$:D?b.style.cssText:b.getAttribute("style")};q(b.attributes,function(a){var c=a.name;"id"!=c&&("style"!=c&&"class"!=c&&b.getAttribute(c))&&(f["@"+c]=a.value)});return B(b.tagName,f,y(b.childNodes).clone(),a)}return 5>c?b.data:null}))},animate:function(a,b,c,f){var g=this,e=[],j=/-?[\d.]+/,n,l=H(),t=k(c)?c:function(a,b,f){return a+
f*(b-a)*(c+(1-c)*f*(3-2*f))};f=f||{};f.time=0;f.stop=function(){n();l(!1)};b=b||500;c=c||0;q(g,function(b){var c={o:y(b),e:{}};s(c.s=c.o.get(a),function(b,f){var g=a[b];"$$slide"==b&&(g=g*u(c.o)+"px");c.e[b]=/^[+-]=/.test(g)?p(g.substr(2),j,v(f)+v(p(g,/\+?=/))):g});e.push(c)});n=y.loop(function(a){function c(a,b){return/^#/.test(a)?parseInt(6<a.length?a.substr(1+2*b,2):(a=a.charAt(1+b))+a,16):parseInt(p(a,/[^\d,]+/g).split(",")[b])}f.time=a;a>=b||0>a?(q(e,function(a){a.o.set(a.e)}),n(),f.time=null,
l(!0,[g])):q(e,function(f){s(f.s,function(g,e){var m="rgb(",n=f.e[g],l=a/b;if(/^#|rgb\(/.test(n))for(var r=0;3>r;r++)m+=Math.round(t(c(e,r),c(n,r),l))+(2>r?",":")");else m=p(n,j,h(t(v(e),v(n),l)));f.o.set(g,m)})})});return l},toggle:function(a,b,c,f){var g=this,e={},j=!1,h=/\b(?=\w)/g;return!b?g.toggle(p(a,h,"-"),p(a,h,"+")):g.set(a)&&function(h){h!==j&&(j=!0===h||!1===h?h:!j,c?g.animate(j?b:a,e.stop?e.stop()||e.time:c,f,e):g.set(j?b:a))}},values:function(a){var b=a||{};this.each(function(a){var f=
a.name,g=h(a.value),e=b[f];if(/form/i.test(a.tagName))y(a.elements).values(b);else if(f&&(!/kbox|dio/i.test(a.type)||a.checked))l(e)?e.push(g):b[f]=null==e?g:[e,g]});return b},on:function(a,b,c,f,g){var e,j,h,n;k(b)?(e=f||c,j=f&&c,h=b):(e=g||f,j=g&&f,n=b,h=c);return q(this,function(b,c){q(a.split(/\s/),function(a){var f=p(a,/\|/),g=h,m=n,l=n&&b,k=j,t=e,q=f==a;a=function(a,b,f){a=a||x.event;var e;b=(f="minifieD"==f)&&b;if(!(m&&null==(e=y(m,l).find(b||a.target)))){if((e=(!g.apply(k||b||a.target,t||
[a,c,e])||t)&&q)&&!f)a.stopPropagation&&(a.preventDefault(),a.stopPropagation()),a.returnValue=!1,a.cancelBubble=!0;if(f)return e}};var s={e:b,h:a,n:f};(h.M=h.M||[]).push(s);D?(b.attachEvent("on"+f,a),(I[b.minifieD]=I[b.minifieD=b.minifieD||++U]||[]).push(s)):(b.addEventListener(f,a,!0),(b.minifieD=b.minifieD||[]).push(s))})})},trigger:function(a,b){var c=b||{};return q(this,function m(b,g,e){var j=!1;q(D?I[b.minifieD]:b.minifieD,function(g){g.n==a&&(j=j||g.h(c,e||b,"minifieD"))});b.parentNode&&!j&&
m(b.parentNode,g,e||b)})}},function(a,b){w.prototype[a]=b});s({request:function(a,b,c,f,e,p){var k,q=c,v=0,u=H();try{k=x.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Msxml2.XMLHTTP.3.0"),null!=c&&(f=f||{},!j(c)&&!n(c)&&(q=t(c,function T(a,b){return l(b)?g(b,function(b){return T(a,b)}):encodeURIComponent(a)+(null!=b?"="+encodeURIComponent(b):"")}).join("&")),/post/i.test(a)?!n(c)&&(!j(c)&&!f["Content-Type"])&&(f["Content-Type"]="application/x-www-form-urlencoded"):(b+="?"+q,q=null)),k.open(a,
b,!0,e,p),s(f,function(a,b){k.setRequestHeader(a,b)}),k.onreadystatechange=function(){4==k.readyState&&!v++&&(200==k.status?u(!0,[k.responseText,k.responseXML]):u(!1,[k.status,k.statusText,k.responseText]))},k.send(q)}catch(z){v||u(!1,[0,null,h(z)])}return u},toJSON:function b(c){return null==c?""+c:j(c=c.valueOf())?'"'+p(c,/[\\\"\x00-\x1f\x22\x5c]/g,R)+'"':l(c)?"["+g(c,b).join()+"]":"object"==typeof c?"{"+t(c,function(c,g){return b(c)+":"+b(g)}).join()+"}":h(c)},parseJSON:x.JSON?x.JSON.parse:function(b){b=
p(b,/[\x00\xad\u0600-\uffff]/g,R);if(/^[[\],:{}\s]*$/.test(p(p(b,/\\["\\\/bfnrtu]/g),/"[^"\\\n\r]*"|true|false|null|[\d.eE+-]+/g)))return eval("("+b+")")},ready:z,setCookie:function(b,c,f,g,e,j){C.cookie=b+"="+(j?c:escape(c))+(f?"; expires="+("object"==typeof f?f:new Date((new Date).getTime()+864E5*f)).toUTCString():"")+"; path="+(g?escapeURI(g):"/")+(e?"; domain="+escape(e):"")},getCookie:function(b,c){var f,g=(f=RegExp("(^|;)\\s*"+b+"=([^;]*)").exec(C.cookie))&&f[2];return c?g:g&&unescape(g)},loop:function(b){var c=
{c:b,t:(new Date).getTime(),s:function(){for(var b=0;b<K.length;b++)K[b]===c&&K.splice(b--,1)}};2>K.push(c)&&function m(){q(K,function(b){b.c(Math.max(0,(new Date).getTime()-b.t),b.s)}).length&&L(m)}();return c.s},wait:function(b,c){var f=H();x.setTimeout(function(){f(!0,c)},b||0);return f},off:function(b){q(b.M,function(b){D?(b.e.detachEvent("on"+b.n,b.h),I[b.e.minifieD]=e(I[b.e.minifieD],b)):(b.e.removeEventListener(b.n,b.h,!0),b.e.minifieD=e(b.e.minifieD,b))});b.M=null}},function(b,c){y[b]=c});
x.onload=G;C.addEventListener&&C.addEventListener("DOMContentLoaded",G,!1);return{$:y,$$:function(b){return E(b)[0]},EE:B,M:w}});var _=require("minifiedUtil")._;
function parseSourceSections(h){function j(){return{id:"anon"+k++,src:[],desc:"",requires:{},requiredBy:{},syntax:[],example:[],params:[]}}h=h.split("\n");var k=100,n=[],l=j(),s=!1;_.each(h,function(h){if(s&&/^.*\*\/\s*$/.test(h))s=!1;else if(s){var e=h.replace(/^\s*(\*\s?)?/,"").replace(/\s*$/,""),g=e.match(/^\s*@([a-z]+)/);g?(g=g[1],e=_.trim(e.replace(/^\s*@[a-z]+\s*/,"")),"syntax"==g||"example"==g?l[g].push(e):"requires"==g?e.length&&_.each(e.split(/\s+/),function(g){l.requires[g]=1}):"param"==
g?l.params.push({name:e.replace(/\s.*$/,""),desc:e.replace(/^\S+\s+/,"")}):"return"==g?l.params.push({name:"@return",desc:e}):"function"==g?l.params[l.params.length-1].funcs.push(e):l[g]=""!=e?e:1):l.params.length?l.params[l.params.length-1].desc+="\n"+_.trim(e):l.example.length?l.example[l.example.length-1]+="\n"+e:l.desc+=e+"\n"}else/^\s*\/\*\$/.test(h)&&!/\*\/\s*$/.test(h)&&(s=!0,n.push(l),l=j());l.src.push(h)});n.push(l);return n}
function createSectionMap(h){var j={};_.each(h,function(h){j[h.id]=h});return j}function completeRequirements(h,j){var k=0;_.each(h,function(h){_.eachObj(h.requires,function(l){var s=j[l];if(!s)throw Error('Unknown id in requirement: "'+l+'"');_.eachObj(s.requires,function(j){h.requires[j]||(k++,h.requires[j]=1)})})});0<k?completeRequirements(h,j):_.each(h,function(h){_.eachObj(h.requires,function(l){j[l].requiredBy[h.id]=1})})}
function calculateDependencies(h,j){var k={};_.eachObj(j,function(n){j[n]&&(k[n]=1,_.eachObj(h[n].requires,function(h){k[h]=1}))});return k}function createDefaultConfigurationMap(h,j){var k={};_.each(h,function(h){if(h.configurable&&("default"==h.configurable||j))k[h.id]=1});return k}
function compile(h,j,k){var n="",l=calculateDependencies(j,k),s=[],q=!0;_.filter(h,function(e){return l[e.id]||!(e.configurable||e.dependency)}).each(function(e){_.each(e.src,function(g){if(/^\s*$/.test(g))q||(n+="\n"),q=!0;else{var e=g.match(/^(\s*)\/\/\s*@(cond|condblock)\s+(\!?)(\w*)\s*(.*)$/);if(e&&"cond"==e[2]&&!!l[e[4]]!=("!"==e[3]))n+=e[1]+e[5]+"\n";else{var h=!1,j=!0;e&&"condblock"==e[2]?s.push(!!l[e[4]]!=("!"==e[3])):/^\s*\/\/\s*@condend\b/.test(g)&&(h=!0);for(e=0;e<s.length;e++)if(!s[e]){j=
!1;break}j&&(n+=g+"\n");h&&s.pop()}q=!1}})});return n}function prepareSections(h){h=parseSourceSections(h);var j=createSectionMap(h);completeRequirements(h,j);var k=createDefaultConfigurationMap(h);return{sections:h,sectionMap:j,enabledSections:k}}var CONFIG_START="minified.js config start --",CONFIG_COMMENT="// - ",CONFIG_ALL="All sections.",CONFIG_ALL_EXCEPT="All sections except ",CONFIG_ONLY="Only sections ";
function serializeEnabledSections(h,j){var k=_.filter(h,function(e){return e.configurable}),n=_.filter(_.keys(j),function(e){return j[e]}),l,s=[];n.length==k.length?(l=CONFIG_COMMENT+CONFIG_ALL,s=[]):n.length/3>k.length/2?(l=CONFIG_COMMENT+CONFIG_ALL_EXCEPT,s=_.filter(k,function(e){return!j[e.id]}).collect(function(e){return e.id})):(l=CONFIG_COMMENT+CONFIG_ONLY,s=n);var q="// "+CONFIG_START+" use this comment to re-create configuration in the Builder\n"+l,e=50;_(s).sort().each(function(g){e<g.length?
(e=70,q+="\n// - "+g+", "):(q+=g+", ",e-=g.length+2)});return q=q.replace(/,\s*$/,".\n")}function fixConfig(h,j){_.eachObj(j,function(k){h[k]?_.copyObj(h[k].requires,j):delete j[k]});return j}
function deserializeEnabledSections(h,j,k){function n(e){return RegExp("^"+e.replace(/ /g,"\\s+"))}var l=n(CONFIG_START+".*"),s=n(CONFIG_ALL.replace(/\./,"\\.")),q=n(CONFIG_ALL_EXCEPT+"\\s*"),e=n(CONFIG_ONLY+"\\s*"),g=n(CONFIG_COMMENT);k=k.split("\n");for(var t=0;t<k.length;t++){var p=k[t];if(/^\s*\/\/s*/.test(p)&&(p=p.replace(/^\s*\/\/\s*/,""),l.test(p)&&t+1<k.length)){for(var p="",v=t+1;v<k.length;v++)if(g.test(k[v])){if(p+=k[v].replace(g,""),/\s*\.\s*$/.test(k[v]))break}else break;if(s.test(p))return createDefaultConfigurationMap(h,
!0);p=p.replace(/\s*\.\s*$/,"");if(q.test(p)){var u=createDefaultConfigurationMap(h,!0);_.each(p.replace(q,"").split(/\s*,\s*/),function(e){delete u[e]});return fixConfig(j,u)}if(e.test(p))return u={},_.each(p.replace(e,"").split(/\s*,\s*/),function(e){j[e]&&(u[e]=1)}),fixConfig(j,u)}}return null};var MINI=require("minified"),$=MINI.$,$$=MINI.$$,EE=MINI.EE,_=require("minifiedUtil")._,MAX_SIZE=4095,SRC="/download/minified-web-src.js",GROUPS="INTERNAL SELECTORS ELEMENT REQUEST JSON EVENTS COOKIE ANIMATION OPTIONS".split(" ");
function closureCompile(h,j,k){$.request("post","http://closure-compiler.appspot.com/compile",{js_code:h,output_format:"json",output_info:["compiled_code","statistics"],output_file_name:"minified-custom.js",compilation_level:j?"ADVANCED_OPTIMIZATIONS":"SIMPLE_OPTIMIZATIONS"}).then(function(h){k&&k($.parseJSON(h))},function(h,j,s){window.console&&console.log("error",h,j,s);k&&k(null)}).error(function(h){window.console&&console.log(h)})}
function setUpConfigurationUI(h){function j(){$(".modCheck").each(function(e){var g=0;$(".secCheck",e.parentNode.parentNode).each(function(e){e.checked&&g++});e.checked=0<g})}function k(e){var g=h.sectionMap[e.id.substr(4)];e.checked?_.eachObj(g.requires,function(e){$("#sec-"+e).set("checked",!0)}):_.eachObj(g.requiredBy,function(e){$("#sec-"+e).set("checked",!1)})}$("#compile").on("click",function(){var e={};$(".secCheck").each(function(g){g.checked&&(e[g.id.substr(4)]=1)});var g=compile(h.sections,
h.sectionMap,e),j=serializeEnabledSections(h.sections,e);if($$("#compressionAdvanced").checked)$$("#compile").disabled=!0,closureCompile(g,!0,function(e){$$("#compile").disabled=!1;$("#resultDiv").animate({$$slide:1});e?($("#gzipRow, #downloadRow").set({$display:"table-row"}),$$("#resultSrc").value=j+"\n"+e.compiledCode,$("#resultPlain").fill((e.statistics.compressedSize/1024).toFixed(2)+"kb ("+e.statistics.compressedSize+" bytes)"),$("#resultGzippedSize").fill((e.statistics.compressedGzipSize/1024).toFixed(2)+
"kb ("+e.statistics.compressedGzipSize+" bytes)"),$$("#resultLink").setAttribute("href","http://closure-compiler.appspot.com"+e.outputFilePath),$("#resultGzippedComment").set({$$fade:e.statistics.compressedGzipSize>MAX_SIZE?1:0})):alert("Google Closure Service not availble. Try again later.")});else try{$("#resultDiv").animate({$$slide:1}),$$("#resultSrc").value=j+g,$("#resultPlain").fill((g.length/1024).toFixed(2)+"kb"),$("#gzipRow, #downloadRow").set({$display:"none"})}catch(k){console.log(k)}return!1});
var n=$("#configSrcDiv").toggle({$$slide:0},{$$slide:1});$("#fromScratch").on("|click",n,[!1]);$("#loadConfig").on("|click",n,[!0]);$("#recreate").on("click",function(){try{var e=$$("#configSrc").value,g=deserializeEnabledSections(h.sections,h.sectionMap,e);g?(_.eachObj(h.sectionMap,function(e){var h=$$("#sec-"+e);h&&(h.checked=!!g[e])}),j()):alert("Can not find configuration in source.")}catch(k){console.log(k)}});$("#sectionCheckboxes").fill();for(var l=1;l<GROUPS.length;l++){var s;$("#sectionCheckboxes").add(s=
EE("div",{"@id":"divMod-"+l},EE("div",{className:"groupDescriptor"},[n=EE("input",{"@id":"mod-"+l,className:"modCheck","@type":"checkbox",checked:"checked"})(),EE("label",{"@for":"mod-"+l},GROUPS[l])]))());$(n).on("change",function(){var e=this.checked;$(".secCheck",this.parentNode.parentNode).each(function(g){g.checked=e;k(g)});j();return!0});var q;_.filter(h.sections,function(e){return e.group==GROUPS[l]&&e.configurable}).sort(function(e,g){var h=e.name||e.id,j=g.name||g.id;return h==j?0:h>j?1:
-1}).each(function(e){function g(e,g){var j=_.filter(_.keys(g),function(e){return!!g[e].name});if(!j.length)return null;var k=0,l=e;_.each(j,function(e){k++<Math.min(j.length,8)&&(1<k&&(l=k==Math.min(j.length,8)?l+" and ":l+", "),l=8==k&&8<j.length?l+"more":l+(h.sectionMap[e].name||h.sectionMap[e].id))});return l+="."}var l=g("Required by ",e.requiredBy),n=g("Requires ",e.requires);s.add(EE("div",{className:"sectionDescriptor"},[q=EE("input",{className:"secCheck","@type":"checkbox","@id":"sec-"+e.id,
checked:"default"==e.configurable?"checked":null})(),EE("label",{"@for":"sec-"+e.id},e.name||e.id),EE("div",{className:"requirements"},[l?[l,EE("br")]:null,n])]));$(q).on("change",function(){k(this);j();return!0})})}}
$(function(){var h=/MSIE\s([\d.]+)/i.exec(navigator.userAgent);h&&10>parseInt(h[1])?$("#builderDiv").fill("Sorry, the Builder tool requires at least Internet Explorer 10 (or, alternatively, Chrome or Firefox). Earlier versions lack CORS support required to use Google Closure's web service."):$.request("get",SRC,null).then(function(h){setUpConfigurationUI(prepareSections(h))}).error(function(h){window.console&&console.log(h)})});
