import "server-only"

const ASSET_EXTENSIONS =
  "png|jpe?g|gif|svg|webp|avif|ico|bmp|woff2?|ttf|otf|eot|css|js|mjs|map|json|txt|xml|webmanifest|mp4|webm|mp3|pdf"

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

interface RewriteOptions {
  origin: URL
  id: string
  isHtml: boolean
}

/**
 * Rewrites every reference to the real site so it points at /s/{id} on this domain,
 * and removes the real host from the output entirely.
 */
export function rewriteText(text: string, { origin, id, isHtml }: RewriteOptions): string {
  const prefix = `/s/${id}`
  const host = escapeRegExp(origin.host)
  // Root-relative path that is not protocol-relative and not already prefixed.
  const rootRel = `/(?!/|s/${escapeRegExp(id)}(?:/|["'\`?#\\s]|$))`

  let out = text

  // Absolute URLs to the real host (plain and JSON-escaped slashes).
  out = out.replace(new RegExp(`(?:https?:)?(?:\\\\/|/){2}${host}(?=[/"'\`?#\\s\\\\)<]|$)`, "gi"), prefix)

  if (isHtml) {
    out = out.replace(/<base\b[^>]*>/gi, "")
    out = out.replace(/<meta\b[^>]*name=["']?referrer["']?[^>]*>/gi, "")
  }

  // src / href / action / poster attributes.
  out = out.replace(new RegExp(`(\\b(?:src|href|action|poster)\\s*=\\s*\\\\?["']?)${rootRel}`, "gi"), `$1${prefix}/`)

  // srcset / imagesrcset: every comma-separated candidate.
  out = out.replace(/(\b(?:srcset|imagesrcset)\s*=\s*\\?["'])([^"'\\]*)/gi, (_m, start: string, value: string) => {
    const rewritten = value.replace(new RegExp(`(^|,\\s*)${rootRel}`, "g"), `$1${prefix}/`)
    return start + rewritten
  })

  // CSS url(...)
  out = out.replace(new RegExp(`(url\\(\\s*\\\\?["']?)${rootRel}`, "gi"), `$1${prefix}/`)

  // Next.js asset base path (webpack / turbopack public path, RSC payload references).
  out = out.replace(/(^|[^\w/.-])\/_next\//g, `$1${prefix}/_next/`)

  // Quoted root-relative asset paths, e.g. "/logo.png" inside JS or RSC payloads.
  out = out.replace(
    new RegExp(`(["'\`])${rootRel}([^"'\`\\s?#<>]*\\.(?:${ASSET_EXTENSIONS}))(?=[?#"'\`\\\\])`, "gi"),
    `$1${prefix}/$2`,
  )

  return out
}

/**
 * Runs first in <head> of every proxied page. Keeps client-side navigation, fetches,
 * and runtime-set asset URLs inside the /s/{id} prefix.
 */
export function buildClientShim(prefix: string): string {
  return `(function(){
var P=${JSON.stringify(prefix)};
function prefixed(p){return p===P||p.indexOf(P+"/")===0||p.indexOf(P+"?")===0}
function fix(u){
  if(typeof u!=="string"||!u)return u;
  if(u.charAt(0)==="/"&&u.charAt(1)!=="/"){return prefixed(u)?u:P+u}
  var o=location.origin;
  if(u.indexOf(o+"/")===0){var r=u.slice(o.length);return prefixed(r)?u:o+P+r}
  return u;
}
function fixSet(v){
  if(typeof v!=="string")return v;
  return v.split(",").map(function(c){var t=c.replace(/^\\s+/,"");return c.slice(0,c.length-t.length)+fix(t.split(/\\s+/)[0])+t.slice(t.split(/\\s+/)[0].length)}).join(",");
}
var H=history;
["pushState","replaceState"].forEach(function(m){
  var orig=H[m];
  H[m]=function(s,t,u){return orig.call(this,s,t,u==null?u:fix(String(u)))};
});
var of=window.fetch;
if(of){window.fetch=function(i,init){
  try{
    if(typeof i==="string")i=fix(i);
    else if(i instanceof URL)i=fix(i.href);
    else if(i&&i.url){var n=fix(i.url);if(n!==i.url)i=new Request(n,i)}
  }catch(e){}
  return of.call(this,i,init);
}}
var xo=XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open=function(m,u){
  var a=Array.prototype.slice.call(arguments);
  a[1]=fix(String(u));
  return xo.apply(this,a);
};
var ATTRS={src:1,href:1,poster:1,action:1,"xlink:href":0};
var sa=Element.prototype.setAttribute;
Element.prototype.setAttribute=function(n,v){
  var k=String(n).toLowerCase();
  if(ATTRS[k])v=fix(String(v));
  else if(k==="srcset"||k==="imagesrcset")v=fixSet(String(v));
  return sa.call(this,n,v);
};
function patch(C,prop,fn){
  if(!C)return;
  var d=Object.getOwnPropertyDescriptor(C.prototype,prop);
  if(!d||!d.set)return;
  Object.defineProperty(C.prototype,prop,{configurable:true,enumerable:d.enumerable,get:d.get,set:function(v){d.set.call(this,fn(String(v)))}});
}
patch(window.HTMLImageElement,"src",fix);
patch(window.HTMLImageElement,"srcset",fixSet);
patch(window.HTMLSourceElement,"src",fix);
patch(window.HTMLSourceElement,"srcset",fixSet);
patch(window.HTMLScriptElement,"src",fix);
patch(window.HTMLLinkElement,"href",fix);
patch(window.HTMLMediaElement,"src",fix);
patch(window.HTMLIFrameElement,"src",fix);
patch(window.HTMLFormElement,"action",fix);
})();`
}
