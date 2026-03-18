// src/components/CustomerAccountSec/CustomerDashboard.jsx
import React, { useState } from 'react';

/* ─────────────────────────────────────────────
   SVG ICONS  (no emojis anywhere)
───────────────────────────────────────────── */
const I = {
  Layers:      ({s=16,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  Check2:      ({s=16,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Clock:       ({s=16,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Trend:       ({s=16,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Box:         ({s=16,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  Truck:       ({s=16,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  Card:        ({s=16,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  Alert:       ({s=16,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Bar:         ({s=16,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  File:        ({s=16,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Spin:        ({s=16,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  Right:       ({s=14,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Arrow:       ({s=14,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Tick:        ({s=12,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  X:           ({s=12,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Shop:        ({s=16,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  Award:       ({s=16,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
};

/* ─────────────────────────────────────────────
   STYLES  —  mobile-first, compact, professional
───────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');

:root{
  --g:#C9A84C;--gl:#E2C07A;
  --gd:rgba(201,168,76,.09);--gb:rgba(201,168,76,.24);
  --bg:#080808;--s1:#0d0d0b;--s2:#121210;--s3:#181815;
  --b:rgba(255,255,255,.055);--bm:rgba(255,255,255,.09);
  --t:#ede9e0;--tm:#69665f;--ts:#9a9286;
  --re:#f87171;--rd:rgba(248,113,113,.08);--rb:rgba(248,113,113,.2);
  --gn:#52c97a;--nd:rgba(82,201,122,.08);--nb:rgba(82,201,122,.2);
  --bl:#5ba3f5;--ld:rgba(91,163,245,.08);--lb:rgba(91,163,245,.2);
  --am:#f59e0b;--ad:rgba(245,158,11,.08);--ab:rgba(245,158,11,.2);
  --pu:#9b87f5;--pd:rgba(155,135,245,.08);--pb:rgba(155,135,245,.2);
  --te:#2dd4bf;--td:rgba(45,212,191,.08);--tb:rgba(45,212,191,.2);
}

/* ── ROOT ── */
*,*::before,*::after{box-sizing:border-box;}
.dr{font-family:'Outfit',sans-serif;font-weight:300;color:var(--t);display:flex;flex-direction:column;gap:12px;width:100%;min-width:0;}
@media(min-width:640px){.dr{gap:16px;}}

/* ── CARD ── */
.dc{background:var(--s1);border:1px solid var(--b);border-radius:14px;overflow:hidden;width:100%;min-width:0;}
@media(min-width:640px){.dc{border-radius:18px;}}

.dc-hd{padding:13px 16px 11px;border-bottom:1px solid var(--b);display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;}
@media(min-width:640px){.dc-hd{padding:16px 20px 13px;}}

.dc-hl{display:flex;align-items:center;gap:9px;}
.dc-ic{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid;}
@media(min-width:640px){.dc-ic{width:32px;height:32px;border-radius:8px;}}

.dc-ey{font-size:8.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--g);font-weight:500;display:block;margin-bottom:1px;}
.dc-tt{font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:400;color:var(--t);margin:0;line-height:1.1;}
@media(min-width:640px){.dc-tt{font-size:17px;}}
.dc-tt em{font-style:italic;color:var(--gl);}

.dc-lk{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:500;color:var(--g);letter-spacing:.05em;text-transform:uppercase;text-decoration:none;background:none;border:none;cursor:pointer;padding:0;transition:color .2s;white-space:nowrap;-webkit-tap-highlight-color:transparent;}
.dc-lk:hover{color:var(--gl);}

/* ══════════════════════════════════
   STATS
══════════════════════════════════ */
.ds-wrap{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:8px;
  width:100%;
}
@media(min-width:480px){.ds-wrap{grid-template-columns:repeat(4,minmax(0,1fr));}}

.ds{
  background:var(--s1);
  border:1px solid var(--b);
  border-radius:12px;
  padding:12px 10px 10px;
  transition:border-color .25s,box-shadow .2s;
  position:relative;
  overflow:hidden;
  min-width:0;
  width:100%;
}
@media(min-width:640px){.ds{padding:14px 15px 12px;border-radius:14px;}}
.ds:hover{box-shadow:0 6px 22px rgba(0,0,0,.35);}

/* top-border accent per variant */
.ds-g {border-top:2px solid rgba(201,168,76,.28);}
.ds-n {border-top:2px solid rgba(82,201,122,.22);}
.ds-b {border-top:2px solid rgba(91,163,245,.22);}
.ds-p {border-top:2px solid rgba(155,135,245,.22);}
.ds-g:hover{border-color:rgba(201,168,76,.42);}
.ds-n:hover{border-color:rgba(82,201,122,.38);}
.ds-b:hover{border-color:rgba(91,163,245,.38);}
.ds-p:hover{border-color:rgba(155,135,245,.38);}

/* inner layout: icon row */
.ds-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:9px;}
.ds-ico{width:26px;height:26px;border-radius:6px;display:flex;align-items:center;justify-content:center;border:1px solid;flex-shrink:0;}
@media(min-width:640px){.ds-ico{width:28px;height:28px;border-radius:7px;}}
.ic-g{background:var(--gd);border-color:var(--gb);}
.ic-n{background:var(--nd);border-color:var(--nb);}
.ic-b{background:var(--ld);border-color:var(--lb);}
.ic-p{background:var(--pd);border-color:var(--pb);}

.ds-val{font-size:20px;font-weight:700;letter-spacing:-.03em;line-height:1;margin-bottom:3px;font-family:'Outfit',sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
@media(min-width:480px){.ds-val{font-size:24px;}}
@media(min-width:640px){.ds-val{font-size:26px;}}
.vc-g{color:var(--gl);}.vc-n{color:var(--gn);}.vc-b{color:var(--bl);}.vc-p{color:var(--pu);}

.ds-lb{font-size:10px;color:var(--tm);letter-spacing:.02em;margin-bottom:7px;}
@media(min-width:640px){.ds-lb{font-size:11px;}}

.ds-pill{
  display:inline-flex;align-items:center;
  font-size:9px;font-weight:500;
  padding:2px 7px;border-radius:20px;border:1px solid;
  letter-spacing:.02em;white-space:nowrap;
}
@media(min-width:640px){.ds-pill{font-size:10px;}}
.pl-n{background:var(--nd);border-color:var(--nb);color:var(--gn);}
.pl-a{background:var(--ad);border-color:var(--ab);color:var(--am);}
.pl-m{background:var(--s2);border-color:var(--b);color:var(--tm);}

/* ══════════════════════════════════
   PIPELINE  — scrollable on mobile
══════════════════════════════════ */
.dp-scroll{
  overflow-x:auto;
  overflow-y:visible;
  scrollbar-width:none;
  -webkit-overflow-scrolling:touch;
  width:100%;
}
.dp-scroll::-webkit-scrollbar{display:none;}

.dp-row{
  display:flex;
  min-width:max-content;
  border-top:1px solid var(--b);
}
/* On ≥480 we don't need horizontal scroll, show as grid */
@media(min-width:480px){
  .dp-scroll{overflow-x:visible;}
  .dp-row{min-width:unset;display:grid;grid-template-columns:repeat(6,1fr);}
}

.dp-cell{
  flex:0 0 72px;
  padding:13px 6px 11px;
  display:flex;flex-direction:column;align-items:center;gap:6px;
  cursor:pointer;transition:background .18s;text-decoration:none;
  -webkit-tap-highlight-color:transparent;
  border-right:1px solid var(--b);
  position:relative;
}
.dp-cell:last-child{border-right:none;}
@media(min-width:480px){.dp-cell{flex:unset;padding:14px 8px 12px;}}
.dp-cell:hover{background:var(--s2);}
.dp-cell:hover .dp-n{color:var(--gl);}

/* active underline on hover */
.dp-cell::after{
  content:'';position:absolute;bottom:0;left:0;right:0;
  height:2px;background:var(--g);
  transform:scaleX(0);transition:transform .2s;border-radius:2px 2px 0 0;
}
.dp-cell:hover::after{transform:scaleX(1);}

.dp-ring{
  width:34px;height:34px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  border:1px solid;position:relative;
  transition:transform .18s;
}
@media(min-width:640px){.dp-ring{width:38px;height:38px;}}
.dp-cell:hover .dp-ring{transform:translateY(-2px);}

.ri-a{background:var(--ad);border-color:var(--ab);}
.ri-b{background:var(--ld);border-color:var(--lb);}
.ri-n{background:var(--nd);border-color:var(--nb);}
.ri-p{background:var(--pd);border-color:var(--pb);}
.ri-t{background:var(--td);border-color:var(--tb);}
.ri-r{background:var(--rd);border-color:var(--rb);}

.dp-badge{
  position:absolute;top:-4px;right:-4px;
  min-width:15px;height:15px;padding:0 3px;border-radius:8px;
  background:var(--g);color:#000;font-size:8.5px;font-weight:700;
  display:flex;align-items:center;justify-content:center;
  border:1.5px solid var(--bg);
}
.dp-n{font-size:16px;font-weight:700;color:var(--t);line-height:1;transition:color .18s;}
@media(min-width:640px){.dp-n{font-size:18px;}}
.dp-l{font-size:9px;color:var(--tm);letter-spacing:.03em;text-align:center;}

/* ══════════════════════════════════
   SPOTLIGHT (active order)
══════════════════════════════════ */
.sp{background:var(--s1);border:1px solid var(--b);border-radius:14px;overflow:hidden;position:relative;}
@media(min-width:640px){.sp{border-radius:18px;}}
.sp-line{position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--g),transparent);}

.sp-bd{padding:15px 16px 17px;}
@media(min-width:640px){.sp-bd{padding:18px 20px 20px;}}

/* ref + date row */
.sp-ref{margin-bottom:13px;}
.sp-ref-ey{font-size:8.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--tm);margin-bottom:2px;}
.sp-ref-id{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:400;color:var(--t);letter-spacing:.04em;line-height:1;margin-bottom:2px;}
@media(min-width:640px){.sp-ref-id{font-size:23px;}}
.sp-ref-dt{font-size:10px;color:var(--tm);}

/* badge row */
.sp-badges{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:13px;}
.dbg{display:inline-flex;align-items:center;padding:3px 8px;border-radius:5px;font-size:9px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;border:1px solid;white-space:nowrap;}
.bpd{background:var(--ad);color:var(--am);border-color:var(--ab);}
.bpr{background:var(--ld);color:var(--bl);border-color:var(--lb);}
.bcf{background:var(--nd);color:var(--gn);border-color:var(--nb);}
.bsh{background:var(--pd);color:var(--pu);border-color:var(--pb);}
.bdl{background:var(--nd);color:var(--gn);border-color:var(--nb);}
.bcn{background:var(--rd);color:var(--re);border-color:var(--rb);}

/* Admin note */
.sp-note{display:flex;gap:9px;align-items:flex-start;background:var(--rd);border:1px solid var(--rb);border-radius:9px;padding:10px 12px;margin-bottom:12px;}
.sp-note-tt{font-size:9.5px;font-weight:600;color:var(--re);letter-spacing:.07em;text-transform:uppercase;margin-bottom:2px;}
.sp-note-tx{font-size:11.5px;color:#fca5a5;line-height:1.55;}

/* Progress bar */
.sp-trk{height:3px;background:var(--s3);border-radius:3px;overflow:hidden;margin-bottom:15px;}
.sp-fil{height:100%;background:linear-gradient(90deg,var(--g),var(--gl));border-radius:3px;transition:width 1s cubic-bezier(.4,0,.2,1);box-shadow:0 0 7px rgba(201,168,76,.4);}

/* Timeline dots */
.sp-tl{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-bottom:15px;}
.sp-ts{text-align:center;}
.sp-td{width:24px;height:24px;border-radius:50%;border:1.5px solid;display:flex;align-items:center;justify-content:center;margin:0 auto 4px;}
@media(min-width:640px){.sp-td{width:26px;height:26px;}}
.td-dn{background:var(--nd);border-color:var(--gn);}
.td-ac{background:var(--gd);border-color:var(--g);animation:tlpls 2.4s ease-in-out infinite;}
.td-pd{background:var(--s2);border-color:var(--b);opacity:.45;}
@keyframes tlpls{0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,.32);}50%{box-shadow:0 0 0 5px rgba(201,168,76,0);}}
.sp-tn{font-size:9px;font-weight:500;color:var(--ts);letter-spacing:.01em;}

/* Item thumbnails */
.sp-items{display:flex;gap:7px;align-items:center;padding-top:13px;border-top:1px solid var(--b);margin-bottom:13px;flex-wrap:wrap;}
.sp-th{width:44px;height:44px;border-radius:7px;object-fit:cover;border:1px solid var(--b);background:var(--s2);display:block;flex-shrink:0;}
@media(min-width:640px){.sp-th{width:48px;height:48px;}}
.sp-th-ph{width:44px;height:44px;border-radius:7px;background:var(--s2);border:1px solid var(--b);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
@media(min-width:640px){.sp-th-ph{width:48px;height:48px;}}
.sp-th-more{width:44px;height:44px;border-radius:7px;background:var(--s3);border:1px solid var(--b);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;color:var(--g);flex-shrink:0;}
@media(min-width:640px){.sp-th-more{width:48px;height:48px;}}
.sp-th-cnt{margin-left:auto;font-size:10px;color:var(--tm);}

/* Footer */
.sp-ft{display:flex;align-items:center;justify-content:space-between;gap:10px;}
.sp-tot-l{font-size:8.5px;letter-spacing:.15em;text-transform:uppercase;color:var(--tm);margin-bottom:2px;}
.sp-tot-v{font-size:18px;font-weight:700;color:var(--gl);letter-spacing:-.02em;font-family:'Outfit',sans-serif;}
@media(min-width:640px){.sp-tot-v{font-size:20px;}}

.sp-btn{display:inline-flex;align-items:center;gap:6px;background:var(--g);color:#000;border:none;border-radius:9px;padding:9px 16px;font-family:'Outfit',sans-serif;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;transition:background .18s,box-shadow .18s;text-decoration:none;white-space:nowrap;box-shadow:0 2px 10px rgba(201,168,76,.2);-webkit-tap-highlight-color:transparent;}
.sp-btn:hover{background:var(--gl);box-shadow:0 4px 16px rgba(201,168,76,.3);}
@media(min-width:640px){.sp-btn{padding:10px 18px;}}

/* No active */
.dna{padding:30px 16px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:9px;}
@media(min-width:640px){.dna{padding:36px 20px;}}
.dna-ic{width:46px;height:46px;border-radius:50%;background:var(--s2);border:1px solid var(--b);display:flex;align-items:center;justify-content:center;margin-bottom:3px;}
.dna-tt{font-family:'Cormorant Garamond',serif;font-size:19px;font-weight:400;color:var(--t);}
.dna-tt em{font-style:italic;color:var(--gl);}
.dna-sb{font-size:12px;color:var(--tm);line-height:1.65;max-width:240px;}
.dna-bt{display:inline-flex;align-items:center;gap:6px;background:var(--g);color:#000;border:none;border-radius:9px;padding:9px 18px;font-family:'Outfit',sans-serif;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;transition:background .18s;text-decoration:none;box-shadow:0 2px 10px rgba(201,168,76,.18);margin-top:4px;-webkit-tap-highlight-color:transparent;}
.dna-bt:hover{background:var(--gl);}

/* ══════════════════════════════════
   ORDER HISTORY
══════════════════════════════════ */
.oh-tb{display:flex;background:var(--s2);border:1px solid var(--b);border-radius:7px;padding:3px;gap:2px;}
.oh-t{padding:4px 12px;border-radius:5px;border:none;background:none;font-family:'Outfit',sans-serif;font-size:10.5px;font-weight:500;color:var(--tm);cursor:pointer;transition:all .18s;white-space:nowrap;letter-spacing:.02em;-webkit-tap-highlight-color:transparent;}
@media(min-width:640px){.oh-t{padding:5px 13px;font-size:11px;}}
.oh-t.on{background:var(--g);color:#000;font-weight:600;}
.oh-t:hover:not(.on){color:var(--ts);}

.oh-lst{display:flex;flex-direction:column;}

.oh-row{
  display:flex;align-items:center;gap:11px;
  padding:11px 16px;border-bottom:1px solid var(--b);
  text-decoration:none;cursor:pointer;
  transition:background .18s;-webkit-tap-highlight-color:transparent;
}
@media(min-width:640px){.oh-row{padding:12px 20px;gap:14px;}}
.oh-row:last-child{border-bottom:none;}
.oh-row:hover{background:var(--s2);}

.oh-imgs{display:flex;flex-shrink:0;}
.oh-img{width:38px;height:38px;border-radius:7px;object-fit:cover;border:2px solid var(--s1);background:var(--s2);flex-shrink:0;display:block;}
@media(min-width:640px){.oh-img{width:40px;height:40px;}}
.oh-img+.oh-img{margin-left:-10px;}
.oh-img-ph{width:38px;height:38px;border-radius:7px;background:var(--s2);border:2px solid var(--s1);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.oh-img-more{width:38px;height:38px;border-radius:7px;background:var(--s3);border:2px solid var(--s1);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;color:var(--g);flex-shrink:0;margin-left:-10px;}

.oh-inf{flex:1;min-width:0;}
.oh-id{font-size:12px;font-weight:600;color:var(--t);letter-spacing:.03em;margin-bottom:2px;}
.oh-mt{font-size:10px;color:var(--tm);}
.oh-bar{height:2px;background:var(--s3);border-radius:2px;overflow:hidden;margin-top:5px;width:60px;}
.oh-bf{height:100%;background:linear-gradient(90deg,var(--g),var(--gl));border-radius:2px;}

.oh-rt{display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;}
.oh-am{font-size:12px;font-weight:700;color:var(--gl);letter-spacing:-.01em;white-space:nowrap;}
@media(min-width:640px){.oh-am{font-size:13px;}}

.oh-em{padding:28px 16px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:8px;color:var(--tm);font-size:12px;line-height:1.65;}
.oh-em-ic{width:36px;height:36px;border-radius:50%;background:var(--s2);border:1px solid var(--b);display:flex;align-items:center;justify-content:center;}

/* ══════════════════════════════════
   SPENDING CHART
══════════════════════════════════ */
.ch-bd{padding:14px 16px 16px;}
@media(min-width:640px){.ch-bd{padding:16px 20px 18px;}}
.ch-bars{display:flex;align-items:flex-end;gap:5px;height:64px;margin-bottom:7px;}
@media(min-width:640px){.ch-bars{height:72px;}}
.ch-col{display:flex;flex-direction:column;align-items:center;flex:1;height:100%;justify-content:flex-end;}
.ch-bar{width:100%;border-radius:3px 3px 0 0;min-height:2px;transition:height .9s cubic-bezier(.4,0,.2,1);cursor:pointer;}
.ch-bar:hover{opacity:.72;}
.ch-lbl{font-size:8.5px;color:var(--tm);margin-top:4px;letter-spacing:.02em;}
@media(min-width:640px){.ch-lbl{font-size:9px;}}
.ch-ax{display:flex;justify-content:space-between;padding:0 1px;margin-top:1px;}
.ch-ax span{font-size:8.5px;color:var(--tm);}

/* ── TIER PROGRESS ── */
.ds-tier-wrap{display:flex;flex-direction:column;gap:4px;}
.ds-tier-bar{height:3px;background:var(--s3);border-radius:3px;overflow:hidden;}
.ds-tier-fill{height:100%;border-radius:3px;transition:width .8s cubic-bezier(.4,0,.2,1);}
.ds-tier-hint{font-size:9px;color:var(--tm);letter-spacing:.02em;}

/* ── ANIMATIONS ── */
@keyframes dfu{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
.da{animation:dfu .34s ease both;}
.da1{animation-delay:.04s;}.da2{animation-delay:.08s;}.da3{animation-delay:.12s;}.da4{animation-delay:.16s;}.da5{animation-delay:.2s;}
`;

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
const CustomerDashboard = ({ orders = [], customer }) => {
  const [tab, setTab] = useState('recent');

  /* helpers */
  const fp  = (p) => (p == null ? '—' : `LKR ${p.toLocaleString()}`);
  const fd  = (d) => new Date(d).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
  const sid = (id) => id?.slice(-6).toUpperCase() || '—';

  const bcls = (s) => ({
    pending_payment:'bpd', processing:'bpr', confirmed:'bcf',
    shipped:'bsh', delivered:'bdl', cancelled:'bcn',
  }[s] || 'bpd');

  const slbl = (s) => (s||'').replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase());

  const pct = (s) => {
    if (s==='cancelled') return 0;
    return Math.round((['pending_payment','processing','confirmed','shipped','delivered'].indexOf(s)+1)/5*100);
  };

  /* stats */
  const total  = orders.length;
  const dlvd   = orders.filter(o=>o.status==='delivered').length;
  const active = orders.filter(o=>!['delivered','cancelled'].includes(o.status)).length;
  const rate   = total>0 ? Math.round(dlvd/total*100) : 0;

  /* member tier based on total orders */
  const memberTier = total >= 20 ? {lbl:'Gold',    next:null,        prog:100, c:'#C9A84C', cd:'rgba(201,168,76,.09)', cb:'rgba(201,168,76,.24)'}
                   : total >= 10 ? {lbl:'Silver',  next:20,         prog:Math.round(total/20*100), c:'#a8b8c8', cd:'rgba(168,184,200,.09)', cb:'rgba(168,184,200,.22)'}
                   :               {lbl:'Bronze',  next:10,         prog:Math.round(total/10*100), c:'#c47c3a', cd:'rgba(196,124,58,.09)',  cb:'rgba(196,124,58,.22)'};

  /* pipeline */
  const PIPE = [
    {key:'pending_payment',lbl:'Pending',   cls:'ri-a',ic:<I.Clock  s={14} c="var(--am)"/>},
    {key:'processing',     lbl:'Processing',cls:'ri-b',ic:<I.Spin   s={14} c="var(--bl)"/>},
    {key:'confirmed',      lbl:'Confirmed', cls:'ri-n',ic:<I.Tick   s={12} c="var(--gn)"/>},
    {key:'shipped',        lbl:'Shipped',   cls:'ri-p',ic:<I.Truck  s={14} c="var(--pu)"/>},
    {key:'delivered',      lbl:'Delivered', cls:'ri-t',ic:<I.Box    s={14} c="var(--te)"/>},
    {key:'cancelled',      lbl:'Cancelled', cls:'ri-r',ic:<I.X      s={12} c="var(--re)"/>},
  ].map(p=>({...p,count:orders.filter(o=>o.status===p.key).length}));

  /* order lists */
  const sorted  = [...orders].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
  const recent  = sorted.slice(0,3);
  const actives = sorted.filter(o=>!['delivered','cancelled'].includes(o.status));
  const rows    = tab==='recent' ? recent : actives;
  const spot    = actives[0]||null;

  /* chart */
  const now = new Date();
  const chart = Array.from({length:6},(_,i)=>{
    const d = new Date(now.getFullYear(), now.getMonth()-(5-i), 1);
    const lbl = d.toLocaleString('default',{month:'short'});
    const tot = orders.filter(o=>{
      const od=new Date(o.createdAt);
      return od.getMonth()===d.getMonth()&&od.getFullYear()===d.getFullYear()&&o.status!=='cancelled';
    }).reduce((s,o)=>s+(o.totalAmount||0),0);
    return {lbl,tot};
  });
  const maxC = Math.max(...chart.map(m=>m.tot),1);

  /* timeline */
  const tl = (order) => {
    const ord=['pending_payment','processing','confirmed','shipped','delivered'];
    const ci=ord.indexOf(order.status);
    return [
      {lbl:'Payment',  idxs:[0,1], ic:<I.Card s={10} c="currentColor"/>},
      {lbl:'Confirmed',idxs:[2],   ic:<I.Tick s={10} c="currentColor"/>},
      {lbl:'Shipped',  idxs:[3],   ic:<I.Truck s={10} c="currentColor"/>},
      {lbl:'Delivered',idxs:[4],   ic:<I.Box s={10} c="currentColor"/>},
    ].map(step=>{
      if(order.status==='cancelled') return {...step,state:'pd'};
      const mx=Math.max(...step.idxs);
      if(ci>mx) return {...step,state:'dn'};
      if(step.idxs.includes(ci)) return {...step,state:'ac'};
      return {...step,state:'pd'};
    });
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="dr">

        {/* ── STATS ── */}
        <div className="da da1">
          <div className="ds-wrap">

            <div className="ds ds-g">
              <div className="ds-top">
                <div className="ds-ico ic-g"><I.Layers s={13} c="var(--g)"/></div>
              </div>
              <div className="ds-val vc-g">{total}</div>
              <div className="ds-lb">Total Orders</div>
              <span className={`ds-pill ${active>0?'pl-a':'pl-m'}`}>{active} active</span>
            </div>

            <div className="ds ds-n">
              <div className="ds-top">
                <div className="ds-ico ic-n"><I.Check2 s={13} c="var(--gn)"/></div>
              </div>
              <div className="ds-val vc-n">{dlvd}</div>
              <div className="ds-lb">Delivered</div>
              <span className="ds-pill pl-n">{rate}% success</span>
            </div>

            <div className="ds ds-b">
              <div className="ds-top">
                <div className="ds-ico ic-b"><I.Clock s={13} c="var(--bl)"/></div>
              </div>
              <div className="ds-val vc-b">{active}</div>
              <div className="ds-lb">In Progress</div>
              <span className={`ds-pill ${active>0?'pl-a':'pl-m'}`}>{active>0?'In transit':'All clear'}</span>
            </div>

            <div className="ds ds-p" style={{borderTopColor:memberTier.cb}}>
              <div className="ds-top">
                <div className="ds-ico" style={{background:memberTier.cd,borderColor:memberTier.cb}}>
                  <I.Award s={13} c={memberTier.c}/>
                </div>
              </div>
              <div className="ds-val" style={{color:memberTier.c}}>{memberTier.lbl}</div>
              <div className="ds-lb">Member Status</div>
              {memberTier.next ? (
                <div className="ds-tier-wrap">
                  <div className="ds-tier-bar">
                    <div className="ds-tier-fill" style={{width:`${memberTier.prog}%`,background:memberTier.c}}/>
                  </div>
                  <span className="ds-tier-hint">{total}/{memberTier.next} to next tier</span>
                </div>
              ) : (
                <span className="ds-pill" style={{background:memberTier.cd,borderColor:memberTier.cb,color:memberTier.c}}>Top tier</span>
              )}
            </div>

          </div>
        </div>

        {/* ── PIPELINE ── */}
        <div className="da da2 dc">
          <div className="dc-hd">
            <div className="dc-hl">
              <div className="dc-ic" style={{background:'var(--gd)',borderColor:'var(--gb)'}}>
                <I.Layers s={14} c="var(--g)"/>
              </div>
              <div>
                <span className="dc-ey">Overview</span>
                <h2 className="dc-tt">Order <em>Pipeline</em></h2>
              </div>
            </div>
            <a href="/orders" className="dc-lk">All orders <I.Right s={11}/></a>
          </div>
          {/* horizontally scrollable on mobile */}
          <div className="dp-scroll">
            <div className="dp-row">
              {PIPE.map(p=>(
                <a key={p.key} href={`/orders?status=${p.key}`} className="dp-cell">
                  <div className={`dp-ring ${p.cls}`}>
                    {p.ic}
                    {p.count>0 && <span className="dp-badge">{p.count}</span>}
                  </div>
                  <div className="dp-n">{p.count}</div>
                  <div className="dp-l">{p.lbl}</div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── ACTIVE ORDER SPOTLIGHT ── */}
        <div className="da da3">
          <div style={{marginBottom:9,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:6}}>
            <div>
              <span className="dc-ey" style={{display:'block',marginBottom:2}}>Currently Tracking</span>
              <h2 className="dc-tt">Active <em>Order</em></h2>
            </div>
            {actives.length>1 && (
              <a href="/orders" className="dc-lk">+{actives.length-1} more <I.Right s={11}/></a>
            )}
          </div>

          <div className="sp">
            <div className="sp-line"/>

            {spot ? (
              <>
                {/* status badges header */}
                <div className="dc-hd" style={{padding:'12px 16px 10px'}}>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap',alignItems:'center'}}>
                    <span className={`dbg ${bcls(spot.status)}`}>{slbl(spot.status)}</span>
                    {spot.receiptStatus==='rejected' && <span className="dbg bcn">Receipt Rejected</span>}
                    {spot.receiptStatus==='pending'&&spot.status==='pending_payment' && (
                      <span className="dbg bpd">Awaiting Verification</span>
                    )}
                  </div>
                  <span style={{fontSize:10,color:'var(--tm)'}}>
                    {spot.items.length} {spot.items.length===1?'item':'items'}
                  </span>
                </div>

                <div className="sp-bd">
                  {/* ref */}
                  <div className="sp-ref">
                    <div className="sp-ref-ey">Order Reference</div>
                    <div className="sp-ref-id">#{spot._id.slice(-8).toUpperCase()}</div>
                    <div className="sp-ref-dt">Placed {fd(spot.createdAt)}</div>
                  </div>

                  {/* admin note */}
                  {spot.adminNotes && (
                    <div className="sp-note">
                      <div style={{flexShrink:0,marginTop:1}}><I.Alert s={13} c="var(--re)"/></div>
                      <div>
                        <div className="sp-note-tt">Notice from Admin</div>
                        <div className="sp-note-tx">{spot.adminNotes}</div>
                      </div>
                    </div>
                  )}

                  {/* progress bar */}
                  <div className="sp-trk">
                    <div className="sp-fil" style={{width:`${pct(spot.status)}%`}}/>
                  </div>

                  {/* timeline */}
                  <div className="sp-tl">
                    {tl(spot).map((step,i)=>(
                      <div key={i} className="sp-ts">
                        <div className={`sp-td td-${step.state}`}>
                          {step.state==='dn'
                            ? <I.Tick s={10} c="var(--gn)"/>
                            : step.state==='ac'
                            ? step.ic
                            : <span style={{width:7,height:7,borderRadius:'50%',background:'var(--s3)',display:'block'}}/>
                          }
                        </div>
                        <div className="sp-tn">{step.lbl}</div>
                      </div>
                    ))}
                  </div>

                  {/* thumbnails */}
                  <div className="sp-items">
                    {spot.items.slice(0,5).map((item,i)=>
                      item.productId?.images?.[0]
                        ? <img key={i} src={item.productId.images[0]} alt={item.productId.title||''} className="sp-th"/>
                        : <div key={i} className="sp-th-ph"><I.Box s={14} c="var(--tm)"/></div>
                    )}
                    {spot.items.length>5 && <div className="sp-th-more">+{spot.items.length-5}</div>}
                    <span className="sp-th-cnt">{spot.items.length} {spot.items.length===1?'item':'items'}</span>
                  </div>

                  {/* footer */}
                  <div className="sp-ft">
                    <div>
                      <div className="sp-tot-l">Order Total</div>
                      <div className="sp-tot-v">{fp(spot.totalAmount)}</div>
                    </div>
                    <a href="/orders" className="sp-btn">
                      Track Order <I.Arrow s={12} c="#000"/>
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <div className="dna">
                <div className="dna-ic"><I.Box s={20} c="var(--tm)"/></div>
                <div className="dna-tt">No <em>active</em> orders</div>
                <div className="dna-sb">You have no orders in progress right now. Browse our collection to place your next order.</div>
                <a href="/shop" className="dna-bt">Browse Collection <I.Arrow s={12} c="#000"/></a>
              </div>
            )}
          </div>
        </div>

        {/* ── ORDER HISTORY ── */}
        <div className="da da4 dc">
          <div className="dc-hd">
            <div className="dc-hl">
              <div className="dc-ic" style={{background:'var(--s2)',borderColor:'var(--b)'}}>
                <I.File s={14} c="var(--ts)"/>
              </div>
              <div>
                <span className="dc-ey">History</span>
                <h2 className="dc-tt">Order <em>Log</em></h2>
              </div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:9,flexWrap:'wrap'}}>
              <div className="oh-tb">
                <button className={`oh-t${tab==='recent'?' on':''}`} onClick={()=>setTab('recent')}>Recent</button>
                <button className={`oh-t${tab==='active'?' on':''}`} onClick={()=>setTab('active')}>
                  Active{actives.length>0?` (${actives.length})`:''}
                </button>
              </div>
              <a href="/orders" className="dc-lk">View all <I.Right s={11}/></a>
            </div>
          </div>

          <div className="oh-lst">
            {rows.length===0 ? (
              <div className="oh-em">
                <div className="oh-em-ic"><I.Box s={16} c="var(--tm)"/></div>
                {tab==='active'
                  ? 'All orders have been delivered or cancelled.'
                  : 'No orders yet. Start shopping to see your history here.'}
              </div>
            ) : (
              <>
                {rows.slice(0,3).map(order=>{
                  const imgs  = order.items.slice(0,2).map(it=>it.productId?.images?.[0]);
                  const extra = order.items.length-2;
                  return (
                    <a key={order._id} href="/orders" className="oh-row">
                      <div className="oh-imgs">
                        {imgs.map((img,i)=>
                          img
                            ? <img key={i} src={img} alt="" className="oh-img"/>
                            : <div key={i} className="oh-img-ph"><I.Box s={12} c="var(--tm)"/></div>
                        )}
                        {extra>0 && <div className="oh-img-more">+{extra}</div>}
                      </div>
                      <div className="oh-inf">
                        <div className="oh-id">#{sid(order._id)}</div>
                        <div className="oh-mt">{fd(order.createdAt)} &nbsp;·&nbsp; {order.items.length} {order.items.length===1?'item':'items'}</div>
                        {order.status!=='cancelled' && (
                          <div className="oh-bar"><div className="oh-bf" style={{width:`${pct(order.status)}%`}}/></div>
                        )}
                      </div>
                      <div className="oh-rt">
                        <div className="oh-am">{fp(order.totalAmount)}</div>
                        <span className={`dbg ${bcls(order.status)}`}>{slbl(order.status)}</span>
                      </div>
                    </a>
                  );
                })}
                {rows.length>3 && (
                  <a href="/orders" style={{
                    display:'flex',alignItems:'center',justifyContent:'center',gap:5,
                    padding:'11px 16px',borderTop:'1px solid var(--b)',
                    fontSize:11,fontWeight:500,color:'var(--g)',letterSpacing:'.05em',
                    textTransform:'uppercase',textDecoration:'none',
                    transition:'background .18s',
                  }}
                  onMouseEnter={e=>e.currentTarget.style.background='var(--s2)'}
                  onMouseLeave={e=>e.currentTarget.style.background=''}
                  >
                    View {rows.length-3} more order{rows.length-3!==1?'s':''} <I.Right s={11} c="var(--g)"/>
                  </a>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── SPENDING CHART ── */}
        {orders.length>0 && (
          <div className="da da5 dc">
            <div className="dc-hd">
              <div className="dc-hl">
                <div className="dc-ic" style={{background:'var(--gd)',borderColor:'var(--gb)'}}>
                  <I.Bar s={14} c="var(--g)"/>
                </div>
                <div>
                  <span className="dc-ey">Analytics</span>
                  <h2 className="dc-tt">Spending <em>Trend</em></h2>
                </div>
              </div>
              <span style={{fontSize:9,color:'var(--tm)',letterSpacing:'.05em',textTransform:'uppercase'}}>Last 6 months</span>
            </div>
            <div className="ch-bd">
              <div className="ch-bars">
                {chart.map((m,i)=>{
                  const h=maxC>0?(m.tot/maxC)*100:0;
                  const cur=i===chart.length-1;
                  return (
                    <div key={i} className="ch-col">
                      <div className="ch-bar" title={`${m.lbl}: LKR ${m.tot.toLocaleString()}`}
                        style={{
                          height:`${Math.max(h,m.tot>0?5:0)}%`,
                          background:cur
                            ?'linear-gradient(180deg,var(--gl),var(--g))'
                            :'linear-gradient(180deg,rgba(201,168,76,.3),rgba(201,168,76,.09))',
                        }}
                      />
                      <div className="ch-lbl">{m.lbl}</div>
                    </div>
                  );
                })}
              </div>
              <div className="ch-ax">
                <span>LKR 0</span>
                <span>LKR {(maxC/1000).toFixed(0)}K</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default CustomerDashboard;