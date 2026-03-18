// src/components/CustomerAccountSec/SupportSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');

:root{
  --g:#C9A84C;--gl:#E2C07A;
  --gd:rgba(201,168,76,.09);--gb:rgba(201,168,76,.24);
  --bg:#080808;--s1:#0d0d0b;--s2:#121210;--s3:#181815;
  --b:rgba(255,255,255,.055);--bm:rgba(255,255,255,.09);
  --t:#ede9e0;--tm:#69665f;--ts:#9a9286;
  --gn:#52c97a;--nd:rgba(82,201,122,.08);--nb:rgba(82,201,122,.2);
  --bl:#5ba3f5;--ld:rgba(91,163,245,.08);--lb:rgba(91,163,245,.2);
}

/* ── SUPPORT CARD ── */
.ss-card{
  background:var(--s1);
  border:1px solid var(--b);
  border-radius:14px;
  overflow:hidden;
  font-family:'Outfit',sans-serif;
  font-weight:300;
}
@media(min-width:640px){.ss-card{border-radius:18px;}}

/* header */
.ss-head{
  padding:13px 16px 11px;
  border-bottom:1px solid var(--b);
  display:flex;align-items:center;gap:9px;
}
@media(min-width:640px){.ss-head{padding:16px 20px 13px;}}

.ss-head-ic{
  width:28px;height:28px;border-radius:7px;
  background:var(--gd);border:1px solid var(--gb);
  display:flex;align-items:center;justify-content:center;flex-shrink:0;
}
@media(min-width:640px){.ss-head-ic{width:32px;height:32px;border-radius:8px;}}

.ss-ey{
  font-size:8.5px;letter-spacing:.22em;text-transform:uppercase;
  color:var(--g);font-weight:500;display:block;margin-bottom:1px;
}
.ss-tt{
  font-family:'Cormorant Garamond',serif;
  font-size:15px;font-weight:400;color:var(--t);margin:0;line-height:1.1;
}
@media(min-width:640px){.ss-tt{font-size:17px;}}
.ss-tt em{font-style:italic;color:var(--gl);}

/* body */
.ss-body{padding:12px 14px 14px;display:flex;flex-direction:column;gap:8px;}
@media(min-width:640px){.ss-body{padding:14px 18px 16px;gap:9px;}}

/* contact rows */
.ss-row{
  display:flex;align-items:center;gap:12px;
  padding:10px 12px;
  background:var(--s2);
  border:1px solid var(--b);
  border-radius:10px;
  transition:border-color .18s,background .18s;
  text-decoration:none;
  -webkit-tap-highlight-color:transparent;
}
.ss-row:hover{border-color:var(--gb);background:var(--s3);}

.ss-row-ic{
  width:30px;height:30px;border-radius:8px;
  background:var(--gd);border:1px solid var(--gb);
  display:flex;align-items:center;justify-content:center;flex-shrink:0;
  transition:background .18s;
}
.ss-row:hover .ss-row-ic{background:rgba(201,168,76,.15);}

.ss-row-lbl{font-size:9.5px;color:var(--tm);letter-spacing:.04em;text-transform:uppercase;margin-bottom:2px;}
.ss-row-val{font-size:12.5px;font-weight:500;color:var(--g);transition:color .18s;letter-spacing:.01em;}
@media(min-width:640px){.ss-row-val{font-size:13px;}}
.ss-row:hover .ss-row-val{color:var(--gl);}

/* divider */
.ss-div{
  height:1px;background:var(--b);margin:2px 0;
}

/* CTA button */
.ss-cta{
  display:flex;align-items:center;justify-content:center;gap:7px;
  width:100%;
  background:var(--g);color:#000;
  border:none;border-radius:10px;
  padding:11px 18px;
  font-family:'Outfit',sans-serif;
  font-size:11.5px;font-weight:700;
  letter-spacing:.07em;text-transform:uppercase;
  cursor:pointer;
  transition:background .18s,box-shadow .18s;
  text-decoration:none;
  box-shadow:0 2px 12px rgba(201,168,76,.2);
  -webkit-tap-highlight-color:transparent;
}
@media(min-width:640px){.ss-cta{padding:12px 20px;font-size:12px;}}
.ss-cta:hover{background:var(--gl);box-shadow:0 4px 18px rgba(201,168,76,.3);}
.ss-cta:active{transform:scale(.99);}

/* hours note */
.ss-note{
  display:flex;align-items:center;justify-content:center;gap:5px;
  font-size:10px;color:var(--tm);letter-spacing:.03em;
  padding-top:2px;
}
.ss-note-dot{
  width:6px;height:6px;border-radius:50%;
  background:var(--gn);
  box-shadow:0 0 5px rgba(82,201,122,.5);
  flex-shrink:0;
}
`;

/* ── ICONS ── */
const IcHeadset = () => (
  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
  </svg>
);
const IcMail = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IcPhone = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="var(--g)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6.29 6.29l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.03z"/>
  </svg>
);
const IcArrow = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IcMsg = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const SupportSection = () => {
  return (
    <>
      <style>{CSS}</style>
      <div className="ss-card">

        {/* Header */}
        <div className="ss-head">
          <div className="ss-head-ic">
            <IcHeadset />
          </div>
          <div>
            <span className="ss-ey">Support</span>
            <h2 className="ss-tt">Need <em>Help?</em></h2>
          </div>
        </div>

        {/* Body */}
        <div className="ss-body">

          {/* Email */}
          <a href="mailto:happytime143b@gmail.com" className="ss-row">
            <div className="ss-row-ic"><IcMail /></div>
            <div style={{flex:1,minWidth:0}}>
              <div className="ss-row-lbl">Email us</div>
              <div className="ss-row-val" style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                happytime143b@gmail.com
              </div>
            </div>
          </a>

          {/* Phone */}
          <a href="tel:+94763009123" className="ss-row">
            <div className="ss-row-ic"><IcPhone /></div>
            <div style={{flex:1,minWidth:0}}>
              <div className="ss-row-lbl">Call us</div>
              <div className="ss-row-val">+94 76 300 9123</div>
            </div>
          </a>

          <div className="ss-div" />

          {/* CTA */}
          <Link to="/contact" className="ss-cta">
            <IcMsg /> Contact Support <IcArrow />
          </Link>

          {/* Online indicator */}
          <div className="ss-note">
            <div className="ss-note-dot" />
            Support available Mon – Sat, 9 AM – 6 PM
          </div>

        </div>
      </div>
    </>
  );
};

export default SupportSection;