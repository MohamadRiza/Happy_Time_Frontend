// src/pages/CustomerAccount.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCustomerToken, customerLogout } from '../utils/auth';
import Loading from '../components/Loading';
import CustomerDashboard from '../components/CustomerAccountSec/CustomerDashboard';
import ProfileSection from '../components/CustomerAccountSec/ProfileSection';
import SupportSection from '../components/CustomerAccountSec/SupportSection';
import { Helmet } from 'react-helmet';

/* ── SVG ICONS ── */
const I = {
  Box:     ({s=16,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  Shop:    ({s=16,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  Cart:    ({s=16,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  User:    ({s=16,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Out:     ({s=16,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Grid:    ({s=16,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Msg:     ({s=16,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Warn:    ({s=16,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Right:   ({s=14,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Arrow:   ({s=14,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Trend:   ({s=16,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Zap:     ({s=16,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Clock:   ({s=16,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Check2:  ({s=16,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
};

/* ── STYLES ── */
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
  --pu:#9b87f5;--pd:rgba(155,135,245,.08);--pb:rgba(155,135,245,.2);
}

/* ── ROOT ── */
*,*::before,*::after{box-sizing:border-box;}
.ap{min-height:100vh;width:100%;max-width:100vw;overflow-x:hidden;background:var(--bg);color:var(--t);font-family:'Outfit',sans-serif;font-weight:300;}

/* ── HERO ── */
.ap-hero{background:linear-gradient(150deg,#0e0e0b 0%,#0a0a08 50%,#080806 100%);border-bottom:1px solid var(--b);position:relative;overflow:hidden;}
.ap-hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 55% 80% at 4% 50%,rgba(201,168,76,.04),transparent),radial-gradient(ellipse 35% 55% at 96% 25%,rgba(201,168,76,.028),transparent);pointer-events:none;}
.ap-hi{max-width:1280px;margin:0 auto;padding:18px 16px 16px;position:relative;z-index:1;}
@media(min-width:640px){.ap-hi{padding:26px 24px 22px;}}
@media(min-width:1024px){.ap-hi{padding:36px 40px 32px;}}

/* Hero row */
.ap-hr{display:flex;align-items:center;gap:13px;margin-bottom:14px;}
@media(min-width:640px){.ap-hr{margin-bottom:18px;gap:16px;}}

/* Avatar */
.ap-av{
  width:46px;height:46px;border-radius:50%;
  background:linear-gradient(135deg,var(--g) 0%,#8a6118 100%);
  display:flex;align-items:center;justify-content:center;
  font-size:17px;font-weight:700;color:#000;flex-shrink:0;
  font-family:'Outfit',sans-serif;position:relative;
  box-shadow:0 0 0 2px rgba(201,168,76,.16),0 3px 14px rgba(201,168,76,.1);
}
@media(min-width:640px){.ap-av{width:58px;height:58px;font-size:21px;}}
@media(min-width:1024px){.ap-av{width:64px;height:64px;font-size:24px;}}
.ap-av-rg{position:absolute;inset:-3px;border-radius:50%;border:1px solid var(--gb);}

.ap-tx{flex:1;min-width:0;}
.ap-ey{font-size:8.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--g);font-weight:500;display:block;margin-bottom:3px;}
@media(min-width:640px){.ap-ey{font-size:9px;}}
.ap-nm{font-family:'Cormorant Garamond',serif;font-size:clamp(19px,4vw,30px);font-weight:400;color:var(--t);line-height:1.1;margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.ap-nm em{font-style:italic;color:var(--gl);}
.ap-sb{font-size:11px;color:var(--tm);letter-spacing:.01em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.ap-sb span{color:var(--ts);font-weight:500;}

/* Chips */
.ap-chips{display:flex;gap:6px;flex-wrap:wrap;margin-top:7px;}
.ap-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:9.5px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;border:1px solid;}
.ch-g{background:var(--gd);border-color:var(--gb);color:var(--g);}
.ch-b{background:var(--ld);border-color:var(--lb);color:var(--bl);}

/* Actions */
.ap-acts{display:flex;gap:7px;flex-wrap:wrap;}
.ap-btn{display:inline-flex;align-items:center;gap:5px;border-radius:9px;padding:8px 14px;font-family:'Outfit',sans-serif;font-size:11px;font-weight:500;letter-spacing:.03em;cursor:pointer;transition:all .18s;white-space:nowrap;-webkit-tap-highlight-color:transparent;text-decoration:none;}
@media(min-width:640px){.ap-btn{padding:9px 16px;font-size:11.5px;}}
.ap-gh{background:var(--s2);border:1px solid var(--b);color:var(--ts);}
.ap-gh:hover{border-color:var(--gb);color:var(--g);background:var(--gd);}
.ap-dg{background:var(--rd);border:1px solid var(--rb);color:var(--re);}
.ap-dg:hover{background:rgba(248,113,113,.13);border-color:var(--re);}

/* ── MOBILE TABS ── */
.ap-tabs{border-bottom:1px solid var(--b);background:var(--s1);display:flex;overflow-x:auto;scrollbar-width:none;}
.ap-tabs::-webkit-scrollbar{display:none;}
@media(min-width:1024px){.ap-tabs{display:none;}}
.ap-tab{
  flex-shrink:0;display:inline-flex;align-items:center;gap:6px;
  padding:11px 16px;font-family:'Outfit',sans-serif;font-size:11.5px;font-weight:500;
  letter-spacing:.03em;color:var(--tm);cursor:pointer;
  border-bottom:2px solid transparent;transition:all .18s;
  background:none;border-left:none;border-right:none;border-top:none;
  white-space:nowrap;-webkit-tap-highlight-color:transparent;
}
.ap-tab.on{color:var(--g);border-bottom-color:var(--g);}
.ap-tab:hover:not(.on){color:var(--ts);}

/* ── MAIN LAYOUT ── */
.ap-main{max-width:1280px;margin:0 auto;padding:14px 12px 40px;width:100%;}
@media(min-width:480px){.ap-main{padding:16px 14px 44px;}}
@media(min-width:640px){.ap-main{padding:20px 20px 48px;}}
@media(min-width:1024px){.ap-main{padding:28px 40px 56px;}}

.ap-layout{display:grid;grid-template-columns:minmax(0,1fr);gap:14px;width:100%;}
@media(min-width:640px){.ap-layout{gap:18px;}}
@media(min-width:1024px){.ap-layout{grid-template-columns:minmax(0,1fr) 316px;gap:24px;}}

/* ── SIDEBAR ── */
.ap-side{display:flex;flex-direction:column;gap:12px;}
@media(min-width:640px){.ap-side{gap:14px;}}

/* Quick actions */
.ap-qa{background:var(--s1);border:1px solid var(--b);border-radius:14px;overflow:hidden;}
@media(min-width:640px){.ap-qa{border-radius:16px;}}
.ap-qa-hd{padding:13px 16px 11px;border-bottom:1px solid var(--b);display:flex;align-items:center;gap:9px;}
@media(min-width:640px){.ap-qa-hd{padding:14px 18px 12px;}}
.ap-qa-ic{width:28px;height:28px;border-radius:7px;background:var(--gd);border:1px solid var(--gb);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.ap-qa-tt{font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:400;color:var(--t);}
@media(min-width:640px){.ap-qa-tt{font-size:16px;}}

.ap-qa-lst{padding:7px 10px;display:flex;flex-direction:column;gap:2px;}
@media(min-width:640px){.ap-qa-lst{padding:8px 10px;}}

.ap-qi{display:flex;align-items:center;gap:11px;padding:9px 10px;border-radius:9px;cursor:pointer;transition:background .18s;text-decoration:none;-webkit-tap-highlight-color:transparent;background:none;border:none;width:100%;text-align:left;}
.ap-qi:hover{background:var(--s2);}
.ap-qi:active{transform:scale(.99);}
.ap-qi-ic{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid;}
.ap-qi-lb{font-size:12.5px;color:var(--t);font-weight:400;flex:1;}
.ap-qi-sb{font-size:10px;color:var(--tm);margin-top:1px;}

/* Glance card */
.ap-gl{background:var(--s1);border:1px solid var(--b);border-radius:14px;overflow:hidden;}
@media(min-width:640px){.ap-gl{border-radius:16px;}}
.ap-gl-hd{padding:13px 16px 11px;border-bottom:1px solid var(--b);display:flex;align-items:center;gap:9px;}
@media(min-width:640px){.ap-gl-hd{padding:14px 18px 12px;}}
.ap-gl-bd{padding:12px 16px;display:flex;flex-direction:column;gap:9px;}
@media(min-width:640px){.ap-gl-bd{padding:13px 18px;}}
.ap-gl-row{display:flex;justify-content:space-between;align-items:center;font-size:12.5px;}
.ap-gl-lbl{color:var(--tm);}
.ap-gl-val{font-weight:600;}

/* Mobile panel show/hide */
.ap-panel{display:block;}
@media(max-width:1023px){.ap-panel{display:none;}.ap-panel.vis{display:block;}}

/* Error */
.ap-er{min-height:100vh;background:var(--bg);display:flex;align-items:center;justify-content:center;padding:20px;font-family:'Outfit',sans-serif;}
.ap-er-card{background:var(--s1);border:1px solid var(--rb);border-radius:16px;padding:36px 28px;text-align:center;max-width:380px;width:100%;}
.ap-er-ic{width:56px;height:56px;border-radius:50%;background:var(--rd);border:1.5px solid var(--rb);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;}
.ap-er-tt{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:400;color:var(--t);margin-bottom:7px;}
.ap-er-sb{font-size:12.5px;color:var(--tm);margin-bottom:20px;line-height:1.65;}
.ap-er-bt{display:inline-flex;align-items:center;justify-content:center;gap:7px;background:var(--g);color:#000;border:none;border-radius:9px;padding:11px 22px;font-family:'Outfit',sans-serif;font-size:11.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;transition:background .18s;width:100%;}
.ap-er-bt:hover{background:var(--gl);}
`;

const TABS = [
  {id:'dashboard', label:'Dashboard', Ic:I.Grid},
  {id:'profile',   label:'Profile',   Ic:I.User},
  {id:'support',   label:'Support',   Ic:I.Msg},
];

const CustomerAccount = () => {
  const [customer,   setCustomer]  = useState(null);
  const [orders,     setOrders]    = useState([]);
  const [loading,    setLoading]   = useState(true);
  const [error,      setError]     = useState('');
  const [mobileTab,  setMobileTab] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(()=>{
    (async()=>{
      const token   = getCustomerToken();
      const API_URL = import.meta.env.VITE_API_URL||'http://localhost:5000';
      if(!token){navigate('/login');return;}
      try{
        const pr = await fetch(`${API_URL}/api/customers/profile`,{headers:{Authorization:`Bearer ${token}`}});
        const pd = await pr.json();
        if(!pd.success) throw new Error(pd.message||'Failed to load profile');
        setCustomer(pd.data);

        const or = await fetch(`${API_URL}/api/orders`,{headers:{Authorization:`Bearer ${token}`}});
        const od = await or.json();
        if(od.success) setOrders(od.data||[]);
      }catch(err){
        console.error(err);
        setError('Unable to load account. Please login again.');
        customerLogout();
        navigate('/login');
      }finally{setLoading(false);}
    })();
  },[navigate]);

  const handleProfileUpdate = (u) => setCustomer(u);
  const handleLogout = () => { customerLogout(); navigate('/login'); };

  if(loading) return <Loading message="Loading your account..." size="large"/>;

  if(error) return (
    <>
      <style>{CSS}</style>
      <div className="ap-er">
        <div className="ap-er-card">
          <div className="ap-er-ic"><I.Warn s={24} c="var(--re)"/></div>
          <div className="ap-er-tt">Session Expired</div>
          <div className="ap-er-sb">{error}</div>
          <button className="ap-er-bt" onClick={()=>navigate('/login')}>
            Login Again <I.Arrow s={13} c="#000"/>
          </button>
        </div>
      </div>
    </>
  );

  const initials   = customer?.fullName?.split(' ').map(n=>n[0]).join('').substring(0,2)||'U';
  const firstName  = customer?.fullName?.split(' ')[0]||'there';
  const activeOrds = orders.filter(o=>!['delivered','cancelled'].includes(o.status));
  const delivered  = orders.filter(o=>o.status==='delivered').length;
  const memberSince= customer?.createdAt
    ? new Date(customer.createdAt).toLocaleDateString('en-GB',{month:'long',year:'numeric'})
    : null;

  const total = orders.length;
  const memberTier = total >= 20 ? 'Gold' : total >= 10 ? 'Silver' : 'Bronze';

  const quickActions = [
    {Ic:I.Box,  label:'My Orders',        sub:`${orders.length} total orders`,  bg:'var(--gd)', bdr:'var(--gb)', ic:'var(--g)',  href:'/orders'},
    {Ic:I.Cart, label:'View Cart',         sub:'Your saved items',               bg:'var(--ld)', bdr:'var(--lb)', ic:'var(--bl)', href:'/cart'},
    {Ic:I.Shop, label:'Continue Shopping', sub:'Browse collection',              bg:'var(--nd)', bdr:'var(--nb)', ic:'var(--gn)', href:'/shop'},
  ];

  const glanceRows = [
    {label:'Total Orders', value:orders.length,    color:'var(--gl)'},
    {label:'Delivered',    value:delivered,         color:'var(--gn)'},
    {label:'In Progress',  value:activeOrds.length, color:'var(--bl)'},
    {label:'Member Status',value:memberTier,        color: total>=20?'#C9A84C': total>=10?'#a8b8c8':'#c47c3a'},
  ];

  return (
    <>
      <style>{CSS}</style>
      <Helmet>
        <title>My Account – Happy Time</title>
        <meta name="description" content="Manage your Happy Time account: view orders, update profile, and get support."/>
        <meta name="robots" content="noindex, nofollow"/>
        <link rel="canonical" href="https://happytimeonline.com/account"/>
        <meta property="og:title" content="My Account – Happy Time"/>
        <meta property="og:description" content="Manage your Happy Time account."/>
        <meta property="og:url" content="https://happytimeonline.com/account"/>
        <meta property="og:type" content="website"/>
        <meta property="og:image" content="https://happytimeonline.com/ogimage.png"/>
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content="My Account – Happy Time"/>
        <meta name="twitter:description" content="Manage your Happy Time account."/>
        <meta name="twitter:image" content="https://happytimeonline.com/ogimage.png"/>
      </Helmet>

      <ToastContainer
        position="top-right" autoClose={3000} hideProgressBar={false}
        newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss
        draggable pauseOnHover theme="dark"
        toastClassName="bg-gray-900 text-white border border-gray-700"
      />

      <div className="ap">

        {/* ── HERO ── */}
        <div className="ap-hero">
          <div className="ap-hi">
            <div className="ap-hr">
              <div className="ap-av">
                {initials}
                <div className="ap-av-rg"/>
              </div>
              <div className="ap-tx">
                <span className="ap-ey">My Account</span>
                <h1 className="ap-nm">Welcome, <em>{firstName}</em></h1>
                <div className="ap-sb">
                  {customer?.email && <span>{customer.email}</span>}
                  {customer?.mobileNumber && <span style={{marginLeft:10}}>{customer.mobileNumber}</span>}
                </div>
                <div className="ap-chips">
                  {memberSince && (
                    <div className="ap-chip ch-g">
                      <I.Check2 s={10} c="var(--g)"/> Member since {memberSince}
                    </div>
                  )}
                  {activeOrds.length>0 && (
                    <div className="ap-chip ch-b">
                      <I.Clock s={10} c="var(--bl)"/>
                      {activeOrds.length} active {activeOrds.length===1?'order':'orders'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="ap-acts">
              <a href="/orders" className="ap-btn ap-gh">
                <I.Box s={12} c="currentColor"/> My Orders
              </a>
              <a href="/shop" className="ap-btn ap-gh">
                <I.Shop s={12} c="currentColor"/> Shop
              </a>
              <button className="ap-btn ap-dg" onClick={handleLogout}>
                <I.Out s={12} c="currentColor"/> Logout
              </button>
            </div>
          </div>
        </div>

        {/* ── MOBILE TABS ── */}
        <div className="ap-tabs">
          {TABS.map(({id,label,Ic})=>(
            <button
              key={id}
              className={`ap-tab${mobileTab===id?' on':''}`}
              onClick={()=>setMobileTab(id)}
            >
              <Ic s={12} c="currentColor"/> {label}
            </button>
          ))}
        </div>

        {/* ── MAIN ── */}
        <div className="ap-main">
          <div className="ap-layout">

            {/* Left column */}
            <div style={{display:'flex',flexDirection:'column',gap:14,minWidth:0,width:'100%'}}>
              <div className={`ap-panel${mobileTab==='dashboard'?' vis':''}`}>
                <CustomerDashboard orders={orders} customer={customer}/>
              </div>
              <div className={`ap-panel${mobileTab==='profile'?' vis':''}`}>
                <ProfileSection customer={customer} onProfileUpdate={handleProfileUpdate}/>
              </div>
            </div>

            {/* Sidebar */}
            <div className="ap-side">
              <div className={`ap-panel${mobileTab==='support'?' vis':''}`}>
                <SupportSection/>
              </div>

              {/* Quick Actions */}
              <div className="ap-qa">
                <div className="ap-qa-hd">
                  <div className="ap-qa-ic"><I.Zap s={14} c="var(--g)"/></div>
                  <div className="ap-qa-tt">Quick Actions</div>
                </div>
                <div className="ap-qa-lst">
                  {quickActions.map((qa,i)=>(
                    <a key={i} href={qa.href} className="ap-qi">
                      <div className="ap-qi-ic" style={{background:qa.bg,borderColor:qa.bdr}}>
                        <qa.Ic s={13} c={qa.ic}/>
                      </div>
                      <div style={{flex:1}}>
                        <div className="ap-qi-lb">{qa.label}</div>
                        <div className="ap-qi-sb">{qa.sub}</div>
                      </div>
                      <I.Right s={11} c="var(--tm)"/>
                    </a>
                  ))}
                </div>
              </div>

              {/* At a Glance */}
              {orders.length>0 && (
                <div className="ap-gl">
                  <div className="ap-gl-hd">
                    <div style={{width:28,height:28,borderRadius:7,background:'var(--gd)',border:'1px solid var(--gb)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                      <I.Trend s={13} c="var(--g)"/>
                    </div>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontWeight:400,color:'var(--t)'}}>At a Glance</div>
                  </div>
                  <div className="ap-gl-bd">
                    {glanceRows.map((row,i)=>(
                      <div key={i} className="ap-gl-row">
                        <span className="ap-gl-lbl">{row.label}</span>
                        <span className="ap-gl-val" style={{color:row.color}}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerAccount;