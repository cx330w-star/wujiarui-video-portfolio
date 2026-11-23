'use strict';
const works = [
 {id:1,image:9,group:'commercial',type:'热点追踪 · 视觉前贴',title:'重庆「落地签」',description:'结合机车话题与产品画面，用 AI 构建开场视觉，快速引出护肤产品。'},
 {id:2,image:10,group:'commercial',type:'季节主题 · 场景生成',title:'夏日花园护肤',description:'以高饱和花园、阳光与植物场景，表现夏日护肤的清爽氛围。'},
 {id:3,image:11,group:'commercial',type:'热点追踪 · 超现实创意',title:'自由女神像',description:'将超大产品置入地标场景，通过尺度反差制造视觉记忆点。'},
 {id:4,image:12,group:'commercial',type:'节奏模板 · AI 数字人',title:'数字人举牌卡点',description:'结合数字人、产品陈列与节奏卡点，组织可复用的信息展示模板。'},
 {id:9,image:17,group:'product',type:'产品手持',title:'户外光影',description:''},
 {id:8,image:16,group:'product',type:'产品展示',title:'浴室水汽',description:''},
 {id:5,image:13,group:'product',type:'产品展示',title:'冷藏陈列',description:''},
 {id:7,image:15,group:'product',type:'产品手持',title:'清透水感',description:''},
 {id:6,image:14,group:'product',type:'产品手持',title:'花园日常',description:''},
 {id:10,image:18,group:'drama',type:'家庭群像 · 观念冲突',title:'婆媳快递风波',description:'用家庭日常的冲突切入，衔接直播间产品信息。'},
 {id:13,image:21,group:'drama',type:'温情日常 · 生活种草',title:'餐桌风波',description:'围绕家庭餐桌场景，在人物互动中带入产品。'},
 {id:11,image:19,group:'drama',type:'痛点反转 · 对比叙事',title:'上一世我信了那句护肤品都一样',description:'以反转叙事串联护肤困扰和产品卖点。'},
 {id:12,image:20,group:'drama',type:'夫妻互动 · 情绪反转',title:'拒绝护肤智商税',description:'通过夫妻互动与情绪对比，传递产品信息。'},
 {id:14,image:24,group:'science',type:'完整成片 · 科普长视频',title:'科普内容视觉化制作',description:'整合 AI 人物、产品与微观场景，完成镜头衔接、配音、字幕与音乐包装。'}
];
const durations = {"1": 18.1, "2": 12.7, "3": 18.9, "4": 13.6, "5": 5.1, "6": 4.0, "7": 4.0, "8": 6.0, "9": 4.0, "10": 10.1, "11": 15.1, "12": 11.2, "13": 15.1, "14": 110.6};
const pad = n => String(n).padStart(2,'0');
const playIcon = '<span class="play-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m8 5 11 7-11 7z"/></svg></span>';
function makeFilm(work) {
 const article = document.createElement('article'); article.className='film';
 const button = document.createElement('button');button.className='film-button';button.dataset.video=work.id;button.setAttribute('aria-label','播放：'+work.title);
 const poster=document.createElement('img');poster.src=`image-${pad(work.image)}.webp`;poster.alt=work.title+'视频封面';poster.width=450;poster.height=800;poster.loading='lazy';poster.decoding='async';button.append(poster);
 const play=document.createElement('span');play.className='play-label';play.innerHTML=playIcon+'<span>播放作品</span><span class="duration" data-duration="'+work.id+'"></span>';button.append(play);article.append(button);
 const copy=document.createElement('div');copy.className='film-copy';
 const type=document.createElement('p');type.className='film-type';type.textContent=work.type;
 const title=document.createElement('h3');title.textContent=work.title;copy.append(type,title);
 if(work.description){const desc=document.createElement('p');desc.className='film-description';desc.textContent=work.description;copy.append(desc);}
 article.append(copy);return article;
}
for(const work of works)document.querySelector('#'+work.group+'-grid').append(makeFilm(work));
for(const el of document.querySelectorAll('[data-duration]')){const sec=Math.round(durations[el.dataset.duration]||0);el.textContent=Math.floor(sec/60)+':'+pad(sec%60);}
const dialog=document.querySelector('#media-dialog');const content=document.querySelector('#dialog-content');const dialogTitle=document.querySelector('#dialog-title');let lastFocus=null;
function openDialog(title) {
 lastFocus=document.activeElement;content.replaceChildren();dialogTitle.textContent=title;
 if(!dialog.open)dialog.showModal();document.body.style.overflow='hidden';
}
function openVideo(id) {
 const work=works.find(w=>w.id===Number(id));if(!work)return;
 openDialog(work.title);
 const video=document.createElement('video');video.controls=true;video.playsInline=true;video.preload='metadata';video.poster=`image-${pad(work.image)}.webp`;video.src=`video-${pad(work.id)}.mp4`;video.setAttribute('aria-label',work.title);
 const fallback=document.createElement('p');fallback.className='media-fallback';
 const link=document.createElement('a');link.href=video.src;link.target='_blank';link.rel='noopener';link.textContent='单独打开视频';fallback.append('若播放异常，可 ',link);
 content.append(video,fallback);
 video.addEventListener('error',()=>{if(content.querySelector('.media-status'))return;const p=document.createElement('p');p.className='media-status';p.textContent='视频暂时未能加载，请检查网络或单独打开视频。';content.append(p);});
 video.play().catch(()=>{});
}
function closeDialog(){if(dialog.open)dialog.close();}
dialog.querySelector('.close-button').addEventListener('click',closeDialog);
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog();}});
dialog.addEventListener('close',()=>{const video=content.querySelector('video');if(video){video.pause();video.removeAttribute('src');video.load();}content.replaceChildren();document.body.style.overflow='';lastFocus?.focus({preventScroll:true});});
let toastTimer;
function toast(message){const el=document.querySelector('.toast');el.textContent=message;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,2600);}
async function copyText(value,label){try{await navigator.clipboard.writeText(value);toast(label+'已复制');}catch{const area=document.createElement('textarea');area.value=value;area.style.cssText='position:fixed;left:-9999px;';document.body.append(area);area.select();let ok=false;try{ok=document.execCommand('copy');}catch{}area.remove();if(ok){toast(label+'已复制');return;}openDialog('复制'+label);const wrap=document.createElement('div');wrap.className='copy-fallback';const p=document.createElement('p');p.textContent='请长按或选中下面的内容进行复制。';const field=document.createElement('input');field.value=value;field.readOnly=true;field.setAttribute('aria-label',label);wrap.append(p,field);content.append(wrap);field.focus();field.select();}}
document.addEventListener('click',e=>{const trigger=e.target.closest('[data-video],[data-image],[data-copy]');if(!trigger)return;if(trigger.dataset.video){openVideo(trigger.dataset.video);}else if(trigger.dataset.image){openDialog(trigger.dataset.title||'查看图片');const img=document.createElement('img');img.src=trigger.dataset.image;img.alt=trigger.dataset.title||'作品过程图';content.append(img);}else if(trigger.dataset.copy){copyText(trigger.dataset.copy,'微信号');}});
document.querySelector('#share-button').addEventListener('click',()=>copyText(location.protocol==='file:'?'https://cx330w-star.github.io/wujiarui-video-portfolio/':location.origin+location.pathname,'作品集链接'));
const categoryLinks=[...document.querySelectorAll('.category-nav a')];const sectionIds=categoryLinks.map(a=>a.hash.slice(1));
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){for(const a of categoryLinks){if(a.hash==='#'+entry.target.id)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');}}},{rootMargin:'-15% 0px -65% 0px',threshold:0});for(const id of sectionIds)observer.observe(document.getElementById(id));}
