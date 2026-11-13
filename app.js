/* BookMatch mock-up · app logic (Thai / English) */

/* ============ i18n + helpers ============ */
const $=s=>document.querySelector(s);
const EN=()=>D.lang==='en';
const t=(th,en)=>EN()?en:th;
const DAY={th:['อา.','จ.','อ.','พ.','พฤ.','ศ.','ส.'],en:['Sun','Mon','Tue','Wed','Thu','Fri','Sat']};
const DAYF={th:['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'],en:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']};
const MON={th:['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'],en:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']};
const lg=()=>EN()?'en':'th';
const dayS=d=>DAY[lg()][d],dayF=d=>DAYF[lg()][d],monS=m=>MON[lg()][m];
const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const parse=s=>{const[y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
const addDays=(s,n)=>{const d=parse(s);d.setDate(d.getDate()+n);return iso(d)};
const fmtDate=s=>{const d=parse(s);return `${dayS(d.getDay())} ${d.getDate()} ${monS(d.getMonth())}`};
const fmtLong=s=>{const d=parse(s);return EN()?`${dayF(d.getDay())} ${d.getDate()} ${monS(d.getMonth())}`:`วัน${dayF(d.getDay())}ที่ ${d.getDate()} ${monS(d.getMonth())}`};
const TODAY=iso(new Date());
const nowH=()=>new Date().getHours();
const days7=()=>Array.from({length:7},(_,i)=>addDays(TODAY,i));
const dayDiff=(a,b)=>Math.round((parse(b)-parse(a))/864e5);
function hash(str){let h=2166136261;for(const c of String(str)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
const baht=n=>'฿'+Math.round(n).toLocaleString('en-US');
const hh=h=>String(h).padStart(2,'0')+':00';
const range=hs=>`${hh(Math.min(...hs))}–${hh(Math.max(...hs)+1)}`;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const mmss=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
const KM=()=>t('กม.','km'),HR=n=>EN()?(n===1?'hr':'hrs'):'ชม.';
function km(a,b){const R=6371,r=x=>x*Math.PI/180,dl=r(b.lat-a.lat),dn=r(b.lng-a.lng);const h=Math.sin(dl/2)**2+Math.cos(r(a.lat))*Math.cos(r(b.lat))*Math.sin(dn/2)**2;return 2*R*Math.asin(Math.sqrt(h))}

const ICON={
back:'<path d="M15 18l-6-6 6-6"/>',
home:'<path d="M3.5 10.5L12 4l8.5 6.5V20a1 1 0 0 1-1 1H15v-6H9v6H4.5a1 1 0 0 1-1-1z"/>',
users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><circle cx="17" cy="9" r="2.6"/><path d="M16.5 14.6c2.6.2 4.4 1.9 5 5.4"/>',
cal:'<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
bell:'<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.2 4.3-6.5 8-6.5s7 2.3 8 6.5"/>',
check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
pin:'<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
map:'<path d="M9 4L3.5 6v14L9 18l6 2 5.5-2V4L15 6z"/><path d="M9 4v14M15 6v14"/>',
star:'<path d="M12 3.8l2.5 5.2 5.6.7-4.1 3.9 1 5.6-5-2.7-5 2.7 1-5.6-4.1-3.9 5.6-.7z"/>',
repeat:'<path d="M17 2.5l3 3-3 3"/><path d="M4 11V9.5a4 4 0 0 1 4-4h12"/><path d="M7 21.5l-3-3 3-3"/><path d="M20 13v1.5a4 4 0 0 1-4 4H4"/>',
x:'<path d="M6 6l12 12M18 6L6 18"/>',
search:'<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
queue:'<path d="M4 6h16M4 12h10M4 18h6"/><circle cx="18" cy="17" r="3"/>',
chart:'<path d="M4 20V11M10 20V5M16 20v-8M21 20H3"/>',
grid:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
gift:'<rect x="3.5" y="8" width="17" height="4" rx="1"/><path d="M5 12v8.5h14V12M12 8v12.5M12 8S10.5 3.5 8 4.5 9 8 12 8zm0 0s1.5-4.5 4-3.5S15 8 12 8z"/>',
swap:'<path d="M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/>',
info:'<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>',
reset:'<path d="M4 4v6h6"/><path d="M5 15a7.5 7.5 0 1 0 1.7-8.3L4 10"/>',
shield:'<path d="M12 3l7.5 3v5.5c0 4.5-3.2 8-7.5 9.5-4.3-1.5-7.5-5-7.5-9.5V6z"/><path d="M9 12l2 2 4-4"/>',
send:'<path d="M21 3L10 14M21 3l-6.5 18-4.5-7-7-4.5z"/>',
lock:'<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
plus:'<path d="M12 5v14M5 12h14"/>',
gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3"/>',
logout:'<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l-5-5 5-5M5 12h11"/>',
phone:'<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
globe:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.5 3.5 5.3 3.5 8.5s-1 6-3.5 8.5c-2.5-2.5-3.5-5.3-3.5-8.5s1-6 3.5-8.5z"/>',
};
const ic=(n,s=20)=>`<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n]}</svg>`;

/* ============ mock data ============ */
const SPORTS={football:{th:'ฟุตบอล',en:'Football',icon:'⚽'},futsal:{th:'ฟุตซอล',en:'Futsal',icon:'🥅'},badminton:{th:'แบดมินตัน',en:'Badminton',icon:'🏸'},basketball:{th:'บาสเกตบอล',en:'Basketball',icon:'🏀'}};
const sportL=s=>SPORTS[s][lg()];
const SPORTC={football:'#0B7A4B',futsal:'#2F6FD1',badminton:'#7A3FB0',basketball:'#C25A1C'};
const VENUES=[
 {id:'arena',sport:'football',price:1200,lat:13.8021,lng:100.3268,rating:4.7,reviews:312,size:'50 × 30 m',open:'10:00–23:00',
  th:{name:'ศาลายา ฟุตบอล อารีน่า',type:'ฟุตบอล 7 คน',courts:['สนาม A','สนาม B','สนาม C'],area:'ถ.พุทธมณฑลสาย 5, ศาลายา',surface:'หญ้าเทียม FIFA Quality',players:'7 ต่อ 7 (สูงสุด 18 คน)',
   fac:['ห้องน้ำ','ห้องอาบน้ำ','ล็อกเกอร์','ที่จอดรถ 40 คัน','ไฟส่องสว่าง LED','เช่าเสื้อเอี๊ยม','ที่นั่งข้างสนาม'],near:[['7-Eleven','200 ม.'],['ร้านข้าวมันไก่ป้าแดง','150 ม.'],['ร้านน้ำปั่นหน้าสนาม','50 ม.']]},
  en:{name:'Salaya Football Arena',type:'7-a-side football',courts:['Pitch A','Pitch B','Pitch C'],area:'Phutthamonthon Sai 5 Rd, Salaya',surface:'FIFA Quality artificial turf',players:'7 v 7 (up to 18 players)',
   fac:['Toilets','Showers','Lockers','Parking for 40 cars','LED floodlights','Bib rental','Pitchside seating'],near:[['7-Eleven','200 m'],["Auntie Daeng's chicken rice",'150 m'],['Smoothie stall','50 m']]}},
 {id:'kickoff',sport:'futsal',price:700,lat:13.7878,lng:100.3172,rating:4.5,reviews:188,size:'40 × 20 m',open:'10:00–23:00',
  th:{name:'Kick Off ฟุตซอล ศาลายา',type:'ฟุตซอล 5 คน',courts:['คอร์ท 1','คอร์ท 2','คอร์ท 3'],area:'ซอยศาลายา 12, ศาลายา',surface:'พื้นยางมาตรฐาน',players:'5 ต่อ 5 (สูงสุด 14 คน)',
   fac:['ห้องน้ำ','ที่จอดรถ 20 คัน','ไฟส่องสว่าง LED','ห้องแอร์พักนักกีฬา','ตู้น้ำดื่ม'],near:[['FamilyMart','100 ม.'],['ร้านส้มตำ','80 ม.']]},
  en:{name:'Kick Off Futsal Salaya',type:'5-a-side futsal',courts:['Court 1','Court 2','Court 3'],area:'Soi Salaya 12, Salaya',surface:'Standard rubber floor',players:'5 v 5 (up to 14 players)',
   fac:['Toilets','Parking for 20 cars','LED floodlights','Air-conditioned lounge','Water dispenser'],near:[['FamilyMart','100 m'],['Som tam shop','80 m']]}},
 {id:'shuttle',sport:'badminton',price:180,lat:13.8003,lng:100.3048,rating:4.6,reviews:241,size:'13.4 × 6.1 m',open:'10:00–23:00',
  th:{name:'Shuttle Hub ศาลายา',type:'แบดมินตัน',courts:['คอร์ท 1','คอร์ท 2','คอร์ท 3','คอร์ท 4'],area:'ใกล้ตลาดศาลายา',surface:'พื้นยาง PU',players:'เดี่ยว/คู่',
   fac:['เครื่องปรับอากาศ','ห้องน้ำ','เช่าไม้แบด','ขายลูกขนไก่','ที่จอดรถ 15 คัน'],near:[['ร้านกาแฟ','30 ม.'],['7-Eleven','300 ม.']]},
  en:{name:'Shuttle Hub Salaya',type:'Badminton',courts:['Court 1','Court 2','Court 3','Court 4'],area:'Near Salaya Market',surface:'PU rubber floor',players:'Singles/doubles',
   fac:['Air conditioning','Toilets','Racket rental','Shuttlecocks for sale','Parking for 15 cars'],near:[['Café','30 m'],['7-Eleven','300 m']]}},
 {id:'hoop',sport:'basketball',price:400,lat:13.7792,lng:100.3071,rating:4.4,reviews:96,size:'28 × 15 m',open:'10:00–23:00',
  th:{name:'Hoop Yard',type:'บาสเกตบอล',courts:['คอร์ทในร่ม','คอร์ทกลางแจ้ง'],area:'ถ.ศาลายา-นครชัยศรี',surface:'พื้นไม้ (ในร่ม) / พื้นยาง (กลางแจ้ง)',players:'5 ต่อ 5',
   fac:['ห้องน้ำ','ที่จอดรถ 25 คัน','ไฟส่องสว่าง','ตู้น้ำดื่ม'],near:[['ร้านก๋วยเตี๋ยวเรือ','120 ม.']]},
  en:{name:'Hoop Yard',type:'Basketball',courts:['Indoor court','Outdoor court'],area:'Salaya–Nakhon Chai Si Rd',surface:'Wood (indoor) / rubber (outdoor)',players:'5 v 5',
   fac:['Toilets','Parking for 25 cars','Floodlights','Water dispenser'],near:[['Boat noodle shop','120 m']]}},
 {id:'green',sport:'football',price:1000,lat:13.7712,lng:100.3335,rating:4.3,reviews:157,size:'48 × 28 m',open:'10:00–23:00',
  th:{name:'Green Field พุทธมณฑล',type:'ฟุตบอล 7 คน',courts:['สนาม 1','สนาม 2'],area:'พุทธมณฑลสาย 4',surface:'หญ้าเทียม',players:'7 ต่อ 7',
   fac:['ห้องน้ำ','ที่จอดรถ 50 คัน','ไฟส่องสว่าง','ร้านอาหารในสนาม'],near:[["Lotus's go fresh",'400 ม.']]},
  en:{name:'Green Field Phutthamonthon',type:'7-a-side football',courts:['Pitch 1','Pitch 2'],area:'Phutthamonthon Sai 4',surface:'Artificial turf',players:'7 v 7',
   fac:['Toilets','Parking for 50 cars','Floodlights','On-site restaurant'],near:[["Lotus's go fresh",'400 m']]}},
 {id:'pinklao',sport:'futsal',price:900,lat:13.7786,lng:100.4772,rating:4.6,reviews:205,size:'40 × 20 m',open:'10:00–23:00',
  th:{name:'Pinklao Futsal Club',type:'ฟุตซอล 5 คน',courts:['คอร์ท 1','คอร์ท 2'],area:'ถ.บรมราชชนนี, ปิ่นเกล้า',surface:'พื้นยางมาตรฐาน',players:'5 ต่อ 5',
   fac:['ห้องน้ำ','ห้องอาบน้ำ','ที่จอดรถ 30 คัน','ไฟส่องสว่าง LED'],near:[['ห้างสรรพสินค้า','600 ม.']]},
  en:{name:'Pinklao Futsal Club',type:'5-a-side futsal',courts:['Court 1','Court 2'],area:'Borommaratchachonnani Rd, Pinklao',surface:'Standard rubber floor',players:'5 v 5',
   fac:['Toilets','Showers','Parking for 30 cars','LED floodlights'],near:[['Shopping mall','600 m']]}},
 {id:'smash',sport:'badminton',price:200,lat:13.7128,lng:100.4058,rating:4.5,reviews:133,size:'13.4 × 6.1 m',open:'10:00–23:00',
  th:{name:'Smash Court บางแค',type:'แบดมินตัน',courts:['คอร์ท 1','คอร์ท 2','คอร์ท 3'],area:'ถ.เพชรเกษม, บางแค',surface:'พื้นยาง PU',players:'เดี่ยว/คู่',
   fac:['เครื่องปรับอากาศ','ห้องน้ำ','เช่าไม้แบด','ที่จอดรถ 20 คัน'],near:[['ตลาดบางแค','350 ม.']]},
  en:{name:'Smash Court Bang Khae',type:'Badminton',courts:['Court 1','Court 2','Court 3'],area:'Phet Kasem Rd, Bang Khae',surface:'PU rubber floor',players:'Singles/doubles',
   fac:['Air conditioning','Toilets','Racket rental','Parking for 20 cars'],near:[['Bang Khae Market','350 m']]}},
];
const V=id=>VENUES.find(v=>v.id===id);
const vx=(v,k)=>v[lg()][k];
const vName=v=>vx(v,'name'),court=(v,c)=>vx(v,'courts')[c];
const AREAS=[
 {th:'ม.มหิดล ศาลายา',en:'Mahidol University Salaya',lat:13.7942,lng:100.3229,kw:'มหิดล mahidol ศาลายา salaya มหาลัย university'},
 {th:'ตลาดศาลายา',en:'Salaya Market',lat:13.8024,lng:100.2995,kw:'ตลาด ศาลายา salaya market'},
 {th:'พุทธมณฑล',en:'Phutthamonthon',lat:13.7745,lng:100.3150,kw:'พุทธมณฑล phutthamonthon'},
 {th:'ปิ่นเกล้า',en:'Pinklao',lat:13.7790,lng:100.4800,kw:'ปิ่นเกล้า pinklao บรมราชชนนี'},
 {th:'บางแค',en:'Bang Khae',lat:13.7130,lng:100.4060,kw:'บางแค bang khae เพชรเกษม'},
 {th:'นครปฐม',en:'Nakhon Pathom',lat:13.8199,lng:100.0621,kw:'นครปฐม nakhon pathom'},
];
const HOURS=[10,11,12,13,14,15,16,17,18,19,20,21,22];
const FRIENDS=[{id:'bank',th:'แบงก์',en:'Bank',c:'#2F6FD1'},{id:'mild',th:'มายด์',en:'Mild',c:'#C2477A'},{id:'ton',th:'ต้น',en:'Ton',c:'#D9822B'},{id:'fern',th:'เฟิร์น',en:'Fern',c:'#7A3FB0'},{id:'por',th:'ปอ',en:'Por',c:'#1E8C8C'},{id:'earth',th:'เอิร์ธ',en:'Earth',c:'#5B6B2F'}];
const FN=id=>FRIENDS.find(f=>f.id===id)[lg()];
const fnList=ids=>ids.map(FN).join(', ');
const OWNER_V='arena';
const NAMES={th:['คุณบอส','คุณเจมส์','คุณฟิล์ม','คุณกัปตัน','คุณปอนด์','คุณนัท','คุณเบียร์','คุณโอ๊ต','คุณแม็ก','คุณบีม','ทีมวิศวะ ปี 3','ชมรมฟุตบอล ICT'],en:['Boss','James','Film','Captain','Pond','Nat','Beer','Oat','Max','Beam','Engineering Yr 3','ICT Football Club']};
const nameAt=i=>NAMES[lg()][i%NAMES.th.length];
const REVTXT={th:['จองในแอปง่ายมาก ไม่ต้องโทรถาม','พื้นสนามดี ไฟสว่างพอ','ที่จอดรถพอ ห้องน้ำสะอาด','ราคาคุ้ม แต่ช่วงเย็นเต็มเร็ว ต้องจองล่วงหน้า','เจ้าของสนามใจดี มีน้ำดื่มให้','ใกล้มหาลัย เดินทางสะดวก'],
 en:['Booking in the app is easy, no need to call','Good surface and bright lights','Plenty of parking, clean toilets','Good value, but evenings fill up fast so book ahead','Friendly owner, free drinking water','Close to campus, easy to get to']};
const RTAGS={th:['สนามสะอาด','พื้นดี','ไฟสว่าง','ที่จอดรถพอ','ห้องน้ำสะอาด','คุ้มราคา'],en:['Clean','Good surface','Bright lights','Enough parking','Clean toilets','Good value']};
const SRC={app:{th:'BookMatch',en:'BookMatch'},phone:{th:'โทร',en:'Phone'},walkin:{th:'หน้าสนาม',en:'Walk-in'}};
const srcL=k=>SRC[k][lg()];

/* ============ state ============ */
const KEY='bookmatch-mock-v3';
const fresh=()=>({lang:'th',auth:null,bookings:[],done:[],reviews:[],queue:[],notifs:[{id:1,k:'welcome',p:{},at:Date.now()-864e5,read:false}],
  blocks:{},walkins:{},released:{},firstUsed:false,friends:['bank','mild','ton'],pendingOffer:null,loc:{lat:AREAS[0].lat,lng:AREAS[0].lng,kind:'area',i:0},radius:5,
  owner:{price:1200,qmin:15,boost:false}});
function load(){try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&s.bookings){const f=fresh();return Object.assign(f,s,{owner:Object.assign(f.owner,s.owner||{})})}}catch(e){}return fresh()}
function save(){try{localStorage.setItem(KEY,JSON.stringify(D))}catch(e){}}
let D=load();
const applyOwner=()=>{V(OWNER_V).price=D.owner.price||1200};applyOwner();
let UI={mode:D.auth==='owner'?'owner':'player',view:'home',date:nowH()>=21?addDays(TODAY,1):TODAY,sport:'all',q:'',venue:null,vtab:'time',sel:null,timer:null,co:null,invite:[],bkTab:'up',oTab:'overview',oDate:TODAY,mtSport:'football',mt:null,last:null,focus:null,rate:null};
let hist=[];let tick=null;let MAP=null,VMAP=null,MK={};

/* location label (kept language-neutral in storage) */
function locName(l=D.loc){if(l.kind==='area')return AREAS[l.i][lg()];if(l.kind==='near')return t('ใกล้','Near ')+AREAS[l.i][lg()];if(l.kind==='venue')return vName(V(l.v));if(l.kind==='here')return t('ตำแหน่งปัจจุบัน','Current location');return t('หมุดที่ปักไว้','Dropped pin')}

/* ============ notifications (rendered in the current language) ============ */
const NT={
 welcome:()=>[t('ยินดีต้อนรับสู่ BookMatch','Welcome to BookMatch'),t('จองครั้งแรกลด 50 บาท ใช้ได้ทุกสนามในแอป','฿50 off your first booking at any venue in the app')],
 booked:p=>[t('จองสำเร็จ','Booking confirmed'),`${vName(V(p.v))} ${court(V(p.v),p.c)} · ${fmtDate(p.d)} ${range(p.h)} · ${t('รหัส','Code')} ${p.id}`],
 invite:p=>[t('ส่งคำชวนเพื่อนแล้ว','Invites sent'),t(`${fnList(p.f)} ได้รับลิงก์ยืนยันการเล่น`,`${fnList(p.f)} got a link to confirm`)],
 queued:p=>[t('เข้าคิว MatchQueue แล้ว','Joined MatchQueue'),`${vName(V(p.v))} · ${fmtDate(p.d)} ${hh(p.h)} · ${t('ถ้ามีคนยกเลิก เราจะแจ้งคุณทันที','we will tell you as soon as someone cancels')}`],
 offer:p=>[t(`สนามว่างแล้ว ยืนยันภายใน ${p.m} นาที`,`Slot free, confirm within ${p.m} min`),`${vName(V(p.v))} ${court(V(p.v),p.c)} · ${fmtDate(p.d)} ${hh(p.h)} · ${t('MatchQueue เสนอให้คุณก่อน','MatchQueue is offering it to you first')}`],
 cancelled:p=>[t('ยกเลิกการจองแล้ว','Booking cancelled'),t(`คืนเงิน ${baht(p.r)} ภายใน 3–5 วันทำการ · ส่งช่วงเวลาให้คิวถัดไปแล้ว`,`${baht(p.r)} refunded within 3–5 working days · slot passed to the queue`)],
 remind:p=>[t('อีก 2 ชม. ถึงเวลาเล่น','Game in 2 hours'),`${vName(V(p.v))} ${court(V(p.v),p.c)} · ${range(p.h)} · ${t('ออกเดินทางตอนนี้ทันเวลาพอดี','leave now to make it on time')}`],
 review:()=>[t('ขอบคุณสำหรับรีวิว','Thanks for your review'),t('รีวิวของคุณช่วยให้ผู้เล่นคนอื่นเลือกสนามได้ง่ายขึ้น','Your review helps other players choose a venue')],
};
const NI={welcome:['gift','g'],booked:['check','g'],remind:['clock','b'],queued:['queue','a'],offer:['bell','a'],cancelled:['x','r'],invite:['send','b'],review:['star','a']};

/* ============ slot logic ============ */
const dist=v=>km(D.loc,v);
const fmtKm=v=>{const d=dist(v);return d<10?d.toFixed(1):Math.round(d)};
const skey=(v,c,d,h)=>`${v}|${c}|${d}|${h}`;
function baseBooked(v,c,d,h){const wd=parse(d).getDay();let p=(h>=17&&h<=20)?60:(h>=12?24:16);if(wd===0||wd===6)p+=15;return hash(v+c+d+h)%100<p}
function covers(b,d){if(b.date===d)return true;if(!b.repeat)return false;const x=dayDiff(b.date,d);return x>0&&x%7===0&&x/7<b.repeat}
const hrsUntil=(on,h)=>(parse(on).getTime()+h*36e5-Date.now())/36e5;
const canCancel=(on,hours)=>hrsUntil(on,Math.min(...hours))>=24;
const isDone=(id,on)=>D.done.some(x=>x.id===id&&x.on===on);
const mineAt=(v,c,d,h)=>D.bookings.find(b=>b.venue===v&&b.court===c&&b.hours.includes(h)&&covers(b,d)&&!isDone(b.id,d));
const inQueue=(v,c,d,h)=>D.queue.find(q=>q.key===skey(v,c,d,h));
function slotState(v,c,d,h){
  const k=skey(v,c,d,h);
  if(mineAt(v,c,d,h))return 'mine';
  if(D.blocks[k])return 'blocked';
  if(D.walkins[k])return 'booked';
  if(d<TODAY||(d===TODAY&&h<=nowH()))return 'past';
  if(D.released[k])return 'free';
  return baseBooked(v,c,d,h)?'booked':'free';
}
function freeHours(v,d){const x=V(v);return HOURS.filter(h=>x.th.courts.some((_,c)=>slotState(v,c,d,h)==='free'))}
function freeCount(v,d){const x=V(v);let n=0;HOURS.forEach(h=>x.th.courts.forEach((_,c)=>{if(slotState(v,c,d,h)==='free')n++}));return n}
const firstFreeCourt=(v,d,h)=>V(v).th.courts.findIndex((_,c)=>slotState(v,c,d,h)==='free');
const upcoming=()=>{const out=[];D.bookings.forEach(b=>{for(let w=0;w<(b.repeat||1);w++){const d=addDays(b.date,w*7);if(isDone(b.id,d))continue;if(d>TODAY||(d===TODAY&&Math.max(...b.hours)>=nowH()))out.push({...b,on:d,week:w+1})}});return out.sort((a,b)=>(a.on+String(a.hours[0]).padStart(2,'0')).localeCompare(b.on+String(b.hours[0]).padStart(2,'0')))};
function avail(pid,d,h){const wd=parse(d).getDay();let p=pid==='me'?82:((h>=17&&h<=20)?62:44);if(wd===0||wd===6)p+=12;return hash(pid+d+h+'mt')%100<p}
const boosted=v=>D.owner.boost&&v.id===OWNER_V;
const sortVenues=list=>list.sort((a,b)=>(boosted(b)-boosted(a))||dist(a)-dist(b));
const nCourts=v=>v.th.courts.length;

/* ============ art ============ */
function art(v,cls=''){
  const c={football:['#0A6B42','#16A565'],futsal:['#1B4F96','#2F80D1'],badminton:['#5E2E92','#9C5BD6'],basketball:['#A9481A','#E2793A']}[v.sport];
  let stripes='';if(v.sport==='football')for(let i=0;i<10;i++)stripes+=`<rect x="${i*30}" width="15" height="160" fill="#fff" opacity=".06"/>`;
  const L={
   football:'<rect x="20" y="15" width="260" height="130" rx="2"/><line x1="150" y1="15" x2="150" y2="145"/><circle cx="150" cy="80" r="22"/><rect x="20" y="45" width="40" height="70"/><rect x="240" y="45" width="40" height="70"/><rect x="20" y="62" width="14" height="36"/><rect x="266" y="62" width="14" height="36"/>',
   futsal:'<rect x="20" y="15" width="260" height="130" rx="2"/><line x1="150" y1="15" x2="150" y2="145"/><circle cx="150" cy="80" r="18"/><path d="M20 45 A 38 38 0 0 1 20 115"/><path d="M280 45 A 38 38 0 0 0 280 115"/>',
   badminton:'<rect x="40" y="15" width="220" height="130"/><line x1="150" y1="8" x2="150" y2="152" stroke-width="3"/><line x1="40" y1="27" x2="260" y2="27"/><line x1="40" y1="133" x2="260" y2="133"/><line x1="115" y1="15" x2="115" y2="145"/><line x1="185" y1="15" x2="185" y2="145"/><line x1="40" y1="80" x2="115" y2="80"/><line x1="185" y1="80" x2="260" y2="80"/>',
   basketball:'<rect x="20" y="15" width="260" height="130"/><line x1="150" y1="15" x2="150" y2="145"/><circle cx="150" cy="80" r="18"/><rect x="20" y="58" width="50" height="44"/><rect x="230" y="58" width="50" height="44"/><path d="M20 24 Q 128 80 20 136"/><path d="M280 24 Q 172 80 280 136"/>'
  }[v.sport];
  return `<svg class="${cls}" viewBox="0 0 300 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="g-${v.sport}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[0]}"/></linearGradient></defs><rect width="300" height="160" fill="url(#g-${v.sport})"/>${stripes}<g fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2">${L}</g></svg>`;
}
function qrSvg(seed){
  const N=25;let r='';const fin=(x,y)=>`<rect x="${x}" y="${y}" width="7" height="7" fill="#111"/><rect x="${x+1}" y="${y+1}" width="5" height="5" fill="#fff"/><rect x="${x+2}" y="${y+2}" width="3" height="3" fill="#111"/>`;
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const inF=(x<8&&y<8)||(x>N-9&&y<8)||(x<8&&y>N-9);if(!inF&&hash(seed+x+','+y)%100<48)r+=`<rect x="${x}" y="${y}" width="1" height="1"/>`}
  return `<svg viewBox="-1 -1 27 27" shape-rendering="crispEdges"><rect x="-1" y="-1" width="27" height="27" fill="#fff"/><g fill="#111">${r}</g>${fin(0,0)}${fin(N-7,0)}${fin(0,N-7)}<rect x="10" y="10" width="5" height="5" rx="1" fill="#113566"/></svg>`;
}
const TILES='https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
const PINSVG='<svg width="36" height="46" viewBox="0 0 36 46"><path d="M18 45s15-14.2 15-26A15 15 0 0 0 3 19c0 11.8 15 26 15 26z" fill="#10201A"/><circle cx="18" cy="18" r="7" fill="#C8F25A"/></svg>';

/* ============ shared UI ============ */
const todayL=()=>t('วันนี้','Today');
function dateStrip(cur,act){return `<div class="dates">${days7().map(d=>{const x=parse(d);return `<button class="dchip ${d===cur?'on':''}" data-a="${act}" data-d="${d}" aria-pressed="${d===cur}"><small>${d===TODAY?todayL():dayS(x.getDay())}</small><b>${x.getDate()}</b></button>`}).join('')}</div>`}
const bar=(title,sub='')=>`<div class="bar wrap"><button class="iconbtn" data-a="back" aria-label="${t('ย้อนกลับ','Back')}">${ic('back')}</button><div style="min-width:0;flex:1"><h1>${title}</h1>${sub?`<div class="mut sm-t">${sub}</div>`:''}</div>${langBtn()}</div>`;
const unread=()=>D.notifs.filter(n=>!n.read).length;
const NAV=()=>[['home','home',t('หน้าแรก','Home')],['map','map',t('ค้นหาบนแผนที่','Map search')],['matchtime','users','MatchTime'],['bookings','cal',t('การจอง','Bookings')],['notifs','bell',t('แจ้งเตือน','Notifications')],['profile','user',t('โปรไฟล์','Profile')]];
const TABBAR=()=>[['home','home',t('หน้าแรก','Home')],['map','map',t('แผนที่','Map')],['matchtime','users','MatchTime'],['bookings','cal',t('การจอง','Bookings')],['profile','user',t('โปรไฟล์','Profile')]];
const navOn=v=>UI.view===v||(v==='home'&&['venue','checkout','pay','success'].includes(UI.view))||(v==='matchtime'&&UI.view==='mtvenues');
const langBtn=(cls='')=>`<button class="langbtn ${cls}" data-a="lang" aria-label="${t('Switch to English','เปลี่ยนเป็นภาษาไทย')}">${ic('globe',16)}<span>${EN()?'ไทย':'EN'}</span></button>`;
function sidenav(){const u=unread();
  return `<aside class="side"><div class="side-logo"><span class="logo-m">B</span><b>BookMatch</b></div><nav aria-label="${t('เมนูหลัก','Main menu')}">${NAV().map(([v,i,l])=>`<button class="${navOn(v)?'on':''}" data-a="tab" data-t="${v}">${ic(i,22)}<span>${l}</span>${v==='notifs'&&u?`<span class="dot">${u}</span>`:''}</button>`).join('')}</nav>
  <button class="side-owner" data-a="toOwner">${ic('swap',20)}<span>${t('มุมมองเจ้าของสนาม','Venue owner view')}</span></button></aside>`}
function tabbar(){return `<nav class="tabbar" aria-label="${t('เมนูหลัก','Main menu')}">${TABBAR().map(([v,i,l])=>`<button class="${navOn(v)?'on':''}" data-a="tab" data-t="${v}">${ic(i,22)}${l}</button>`).join('')}</nav>`}
const topAct=(extra='')=>{const u=unread();return `<div class="top-act">${langBtn()}<button class="iconbtn m-only" data-a="tab" data-t="notifs" aria-label="${t('แจ้งเตือน','Notifications')}">${ic('bell')}${u?`<span class="dot">${u}</span>`:''}</button>${extra}</div>`};
function toast(m){const el=document.createElement('div');el.className='toast';el.setAttribute('role','status');el.textContent=m;document.body.appendChild(el);setTimeout(()=>el.remove(),2600)}
function openSheet(html){$('#layer').innerHTML=`<div class="backdrop" data-a="closeSheet"></div><div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div>`}
function closeSheet(){$('#layer').innerHTML='';if(tick){clearInterval(tick);tick=null}}
function notify(k,p={},push=true){D.notifs.unshift({id:Date.now()+Math.random(),k,p,at:Date.now(),read:false});save();if(push&&UI.mode==='player'){const[ti,b]=NT[k](p);const el=document.createElement('div');el.className='push';el.dataset.a='tab';el.dataset.t='notifs';el.innerHTML=`<div class="pl">B</div><div><b>${esc(ti)}</b><p>${esc(b)}</p></div>`;document.body.appendChild(el);setTimeout(()=>el.remove(),3800)}}
const ago=x=>{const s=(Date.now()-x)/1000;if(s<60)return t('เมื่อสักครู่','Just now');if(s<3600)return Math.floor(s/60)+t(' นาทีที่แล้ว',' min ago');if(s<86400)return Math.floor(s/3600)+t(' ชม.ที่แล้ว',' hr ago');return Math.floor(s/86400)+t(' วันที่แล้ว',' days ago')};

/* ============ login ============ */
function login(){
  return `<div class="login"><div class="lbrand">${art({sport:'football'},'bg')}<div class="lb-in"><div class="side-logo" style="justify-content:flex-start"><span class="logo-m" style="background:#fff;color:var(--brand)">B</span><b style="display:block;font-size:22px">BookMatch</b></div>
   <h1>${t('จองสนามกีฬาใกล้คุณ<br>จบใน 2 นาที','Book a sports venue near you<br>in under 2 minutes')}</h1><ul>
   <li>${ic('check')}${t('เห็นเวลาว่างทันที ไม่ต้องโทรถามสนาม','See free times instantly, no phone calls')}</li><li>${ic('check')}${t('ค้นหาสนามตามพื้นที่ด้วยหมุดบนแผนที่','Search any area with a map pin')}</li>
   <li>${ic('check')}${t('MatchTime หาเวลาที่เพื่อนว่างตรงกัน','MatchTime finds when your friends are all free')}</li><li>${ic('check')}${t('MatchQueue เข้าคิวรอสนามที่มีคนยกเลิก','MatchQueue gets you a slot when someone cancels')}</li></ul></div></div>
   <div class="lform"><div class="lcard"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><h1 style="font-size:28px">${t('เข้าสู่ระบบ','Sign in')}</h1>${langBtn()}</div><p class="mut" style="margin:4px 0 8px">${t('เลือกวิธีที่สะดวก ไม่ต้องตั้งรหัสผ่าน','Pick whichever is easiest, no password needed')}</p>
    <button class="sso line" data-a="login" data-r="player"><b style="font-size:13px;background:#fff;color:#06C755;border-radius:6px;padding:1px 5px">LINE</b> ${t('เข้าสู่ระบบด้วย LINE','Continue with LINE')}</button>
    <button class="sso gg" data-a="login" data-r="player"><b style="color:#4285F4">G</b> ${t('เข้าสู่ระบบด้วย Google','Continue with Google')}</button>
    <button class="sso ph" data-a="login" data-r="player">${ic('phone',18)} ${t('ใช้เบอร์โทรศัพท์ (รับรหัส OTP)','Use phone number (OTP)')}</button>
    <div class="or">${t('หรือ','or')}</div>
    <button class="btn ghost block" data-a="login" data-r="owner">${ic('grid',18)} ${t('เข้าสู่ระบบสำหรับเจ้าของสนาม','Sign in as a venue owner')}</button>
    <p class="mut" style="font-size:13px;margin-top:16px;text-align:center">${t('ต้นแบบนี้ไม่เชื่อมบัญชีจริง กดปุ่มใดก็ได้เพื่อเข้าใช้งาน<br>การใช้งานถือว่ายอมรับข้อกำหนดและนโยบายความเป็นส่วนตัว (PDPA)','This prototype is not connected to real accounts. Any button signs you in.<br>Using it means you accept the terms and privacy policy (PDPA).')}</p></div></div></div>`;
}

/* ============ player views ============ */
function venueCard(v){
  const n=freeCount(v.id,UI.date);const nf=freeHours(v.id,UI.date).slice(0,4);
  return `<article class="vcard" role="button" tabindex="0" data-a="openVenue" data-v="${v.id}" aria-label="${esc(vName(v))}"><div class="vart">${art(v)}<span class="tag">${SPORTS[v.sport].icon} ${vx(v,'type')}</span>${boosted(v)?`<span class="tag boost">${t('แนะนำ','Featured')}</span>`:''}</div>
  <div class="vbody"><div class="vrow"><h3>${vName(v)}</h3><span class="rate">${ic('star',14)} ${v.rating}</span></div>
  <div class="meta">${ic('pin',14)} ${fmtKm(v)} ${KM()} · ${vx(v,'area')}</div>
  <div class="vrow"><div class="price">${baht(v.price)}<small> /${HR(1)}</small></div><div class="free ${n?'':'none'}">${n?t(`ว่าง ${n} ช่วง`,`${n} slots free`):t('เต็มทั้งวัน','Fully booked')}</div></div>
  ${nf.length?`<div class="times">${nf.map(h=>`<button class="tchip" data-a="quick" data-v="${v.id}" data-h="${h}">${hh(h)}</button>`).join('')}</div>`:''}</div></article>`;
}
function venuesInScope(){
  const q=(UI.q||'').trim().toLowerCase();
  const all=VENUES.filter(v=>(UI.sport==='all'||v.sport===UI.sport)&&(!q||(v.th.name+v.en.name+v.th.type+v.en.type+SPORTS[v.sport].th+SPORTS[v.sport].en+v.th.area+v.en.area).toLowerCase().includes(q)));
  return {inR:sortVenues(all.filter(v=>dist(v)<=D.radius)),out:all.filter(v=>dist(v)>D.radius).length};
}
function venueList(){
  const {inR,out}=venuesInScope();
  if(!inR.length)return `<div class="empty">${ic('map',40)}<p style="margin-top:8px">${UI.q?t(`ไม่พบ "${esc(UI.q)}" `,`No "${esc(UI.q)}" found `):t('ไม่มีสนาม','No venues ')}${t(`ในรัศมี ${D.radius} กม. จาก ${esc(locName())}`,`within ${D.radius} km of ${esc(locName())}`)}</p><button class="btn sm" style="margin-top:12px" data-a="tab" data-t="map">${ic('pin',16)} ${t('เปลี่ยนพื้นที่บนแผนที่','Change area on the map')}</button></div>`;
  return inR.map(venueCard).join('')+(out?`<div class="empty" style="padding:12px">${t(`อีก ${out} สนามอยู่นอกรัศมี`,`${out} more outside the radius`)} <button class="tchip" data-a="tab" data-t="map">${t('ดูบนแผนที่','See on map')}</button></div>`:'');
}
function home(){
  const up=upcoming()[0];
  const upc=up?`<button class="up" data-a="tab" data-t="bookings"><div class="datebox"><small>${dayS(parse(up.on).getDay())}</small><b>${parse(up.on).getDate()}</b></div><div style="min-width:0"><small class="mut">${t('การจองถัดไป','Next booking')}</small><h3>${vName(V(up.venue))}</h3><div class="mut sm-t">${court(V(up.venue),up.court)} · ${range(up.hours)}</div></div></button>`
   :(!D.firstUsed?`<div class="promo"><div class="big">-฿50</div><div><b>${t('จองครั้งแรกลดทันที 50 บาท','฿50 off your first booking')}</b><p>${t('ใช้ได้ทุกสนาม ไม่ต้องกรอกโค้ด','Any venue, no code needed')}</p></div></div>`
   :`<button class="up" data-a="tab" data-t="map"><div class="datebox">${ic('map',26)}</div><div><h3>${t('ลองหาสนามย่านอื่น','Try another area')}</h3><div class="mut sm-t">${t('ปักหมุดบนแผนที่ เห็นสนามรอบตัวทันที','Drop a pin to see venues around it')}</div></div></button>`);
  return `<div class="wrap"><header class="top"><div><div class="hello">${t('สวัสดี Nice','Hi Nice')}</div><h1>${t('วันนี้เล่นที่ไหนดี?','Where are you playing today?')}</h1></div>${topAct(`<button class="avatar m-only" data-a="tab" data-t="profile" aria-label="${t('โปรไฟล์','Profile')}">N</button>`)}</header>
   <label class="search">${ic('search',18)}<input id="q" placeholder="${t('ค้นหาสนามหรือชนิดกีฬา','Search venues or sports')}" value="${esc(UI.q)}" autocomplete="off" aria-label="${t('ค้นหาสนาม','Search venues')}"></label>
   <button class="locchip" data-a="tab" data-t="map">${ic('pin',18)}<span>${esc(locName())} · ${t('รัศมี','radius')} ${D.radius} ${KM()}</span><u>${t('เปลี่ยนพื้นที่','Change area')}</u></button>
   <div class="feat">${upc}<button class="mt-card" data-a="tab" data-t="matchtime"><div class="ico">${ic('users',24)}</div><div><b>${t('MatchTime: นัดเพื่อนไม่ลงตัว?','MatchTime: can’t agree on a time?')}</b><span>${t('เลือกเพื่อนในกลุ่ม ระบบหาเวลาที่ทุกคนว่างตรงกันให้','Pick your friends and it finds when everyone is free')}</span></div></button></div>
   <div class="chips">${['all',...Object.keys(SPORTS)].map(s=>`<button class="chip ${UI.sport===s?'on':''}" data-a="sport" data-s="${s}">${s==='all'?t('ทั้งหมด','All'):SPORTS[s].icon+' '+sportL(s)}</button>`).join('')}</div>
   ${dateStrip(UI.date,'date')}
   <div class="sec-h"><h2>${t('สนามใกล้','Venues near')} ${esc(locName())}</h2><span>${fmtDate(UI.date)}</span></div>
   <div id="vlist" class="vgrid">${venueList()}</div></div>`;
}
/* --- map --- */
function mapList(){
  const all=sortVenues(VENUES.filter(v=>UI.sport==='all'||v.sport===UI.sport));const inR=all.filter(v=>dist(v)<=D.radius),out=all.length-inR.length;
  return `<div class="sec-h" style="margin-top:12px"><h2>${t(`${inR.length} สนามในรัศมี ${D.radius} กม.`,`${inR.length} venues within ${D.radius} km`)}</h2><span>${fmtDate(UI.date)}</span></div>`+
   (inR.map(v=>{const n=freeCount(v.id,UI.date);return `<div class="mitem ${UI.focus===v.id?'on':''}" role="button" tabindex="0" data-a="focusV" data-v="${v.id}" data-mv="${v.id}"><div class="thumb">${art(v)}</div><div class="grow"><h3>${vName(v)}</h3><div class="mut sm-t">${fmtKm(v)} ${KM()} · ${baht(v.price)}/${HR(1)}</div><span class="free ${n?'':'none'}" style="display:inline-block;margin-top:3px">${n?t(`ว่าง ${n} ช่วง`,`${n} slots free`):t('เต็ม','Full')}</span></div><button class="btn sm" data-a="openVenue" data-v="${v.id}">${t('ดูตาราง','Timetable')}</button></div>`}).join('')
   ||`<div class="empty" style="padding:18px">${ic('pin',34)}<p style="margin-top:6px">${t('ยังไม่มีสนามในรัศมีนี้ ลองขยายรัศมี หรือย้ายหมุดไปใกล้ศาลายา ปิ่นเกล้า หรือบางแค','No venues in this radius yet. Widen it, or move the pin near Salaya, Pinklao or Bang Khae.')}</p></div>`)
   +(out?`<p class="mut sm-t" style="text-align:center;margin-top:6px">${t(`อีก ${out} สนามอยู่นอกรัศมี (หมุดสีเทา)`,`${out} more outside the radius (grey pins)`)}</p>`:'');
}
function mapView(){
  return `<div class="wrap"><div class="mapview"><div class="mappanel"><header class="top" style="padding-bottom:10px"><div><div class="hello">${t('ค้นหาตามพื้นที่','Search by area')}</div><h1>${t('สนามรอบหมุดของคุณ','Venues around your pin')}</h1></div>${topAct()}</header>
   <label class="search">${ic('search',18)}<input id="areaq" placeholder="${t('พิมพ์ชื่อย่าน เช่น ศาลายา ปิ่นเกล้า บางแค','Type an area, e.g. Salaya, Pinklao, Bang Khae')}" autocomplete="off" aria-label="${t('ค้นหาพื้นที่','Search area')}"></label>
   <div id="areasug" class="sug"></div>
   <div class="locchip" style="cursor:default">${ic('pin',18)}<span id="areaname">${esc(locName())}</span><button class="tchip" data-a="geo">${ic('target',14)} ${t('ตำแหน่งปัจจุบัน','Use my location')}</button></div>
   <div class="chips">${[1,3,5,10,20].map(r=>`<button class="chip ${D.radius===r?'on':''}" data-a="radius" data-r="${r}">${r} ${KM()}</button>`).join('')}<span style="width:1px;background:var(--line);flex:none"></span>${['all',...Object.keys(SPORTS)].map(s=>`<button class="chip ${UI.sport===s?'on':''}" data-a="msport" data-s="${s}">${s==='all'?t('ทุกกีฬา','All sports'):SPORTS[s].icon+' '+sportL(s)}</button>`).join('')}</div>
   <div class="mapbox" id="mapbox-m"></div>
   <div id="maplist">${mapList()}</div></div>
   <div class="mapbox" id="mapbox"><div id="map" role="application" aria-label="${t('แผนที่สนาม','Venue map')}"></div><div class="maphint">${t('แตะแผนที่หรือลากหมุดเพื่อเปลี่ยนพื้นที่','Tap the map or drag the pin to change area')}</div></div></div></div>`;
}
const SVGPIN=(v,sel,dim)=>L.divIcon({className:'',html:`<div class="vpin ${sel?'sel':''} ${dim?'dim':''}" style="--c:${SPORTC[v.sport]}">${SPORTS[v.sport].icon} ${baht(v.price)}</div>`,iconSize:[0,0]});
function initMap(){
  const el=$('#map');if(!el)return;
  if(matchMedia('(max-width:1099px)').matches){const slot=$('#mapbox-m'),box=$('#mapbox');if(slot&&box){slot.parentNode.insertBefore(box,slot);slot.remove()}}
  else{const slot=$('#mapbox-m');if(slot)slot.remove()}
  if(!window.L){el.innerHTML=`<div class="mapfail">${t('โหลดแผนที่ไม่ได้ ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต<br>ยังเลือกพื้นที่จากช่องค้นหาด้านบนได้','The map could not load. Check your internet connection.<br>You can still pick an area from the search box above.')}</div>`;return}
  MAP=L.map(el,{zoomControl:true,scrollWheelZoom:true}).setView([D.loc.lat,D.loc.lng],13);
  L.tileLayer(TILES,{attribution:'Tiles &copy; Esri, HERE, Garmin, &copy; OpenStreetMap contributors',maxZoom:19}).addTo(MAP);
  MK.circle=L.circle([D.loc.lat,D.loc.lng],{radius:D.radius*1000,color:'#0B7A4B',weight:1.5,fillColor:'#0B7A4B',fillOpacity:.08}).addTo(MAP);
  MK.pin=L.marker([D.loc.lat,D.loc.lng],{draggable:true,autoPan:true,zIndexOffset:1000,title:t('ลากเพื่อย้ายพื้นที่','Drag to move the area'),icon:L.divIcon({className:'apin',html:PINSVG,iconSize:[36,46],iconAnchor:[18,45]})}).addTo(MAP);
  MK.pin.on('drag',e=>MK.circle.setLatLng(e.target.getLatLng()));
  MK.pin.on('dragend',e=>{const p=e.target.getLatLng();setPin(p.lat,p.lng,nearestArea(p),false)});
  MAP.on('click',e=>setPin(e.latlng.lat,e.latlng.lng,nearestArea(e.latlng),false));
  MK.v={};VENUES.forEach(v=>{MK.v[v.id]=L.marker([v.lat,v.lng],{icon:SVGPIN(v,false,false),keyboard:true,title:vName(v)}).addTo(MAP).on('click',()=>focusVenue(v.id,true))});
  refreshMap(true);setTimeout(()=>MAP&&MAP.invalidateSize(),80);
}
function nearestArea(p){let bi=0,bd=1e9;AREAS.forEach((a,i)=>{const d=km(p,a);if(d<bd){bd=d;bi=i}});return bd<2.5?{kind:'near',i:bi}:{kind:'pin'}}
function setPin(lat,lng,meta,fit=true){D.loc={lat,lng,...meta};save();if(MAP){MK.pin.setLatLng([lat,lng]);MK.circle.setLatLng([lat,lng]);refreshMap(fit)}else{const l=$('#maplist');if(l)l.innerHTML=mapList()}const n=$('#areaname');if(n)n.textContent=locName()}
function refreshMap(fit){
  if(MAP){MK.circle.setRadius(D.radius*1000);VENUES.forEach(v=>{const show=UI.sport==='all'||v.sport===UI.sport;const m=MK.v[v.id];if(!show){m.setOpacity(0);return}m.setOpacity(1);m.setIcon(SVGPIN(v,UI.focus===v.id,dist(v)>D.radius))});
   if(fit)MAP.flyToBounds(MK.circle.getBounds(),{padding:[24,24],duration:.6})}
  const l=$('#maplist');if(l)l.innerHTML=mapList();
}
function focusVenue(id,fromMap){UI.focus=id;const v=V(id);refreshMap(false);if(MAP&&!fromMap)MAP.panTo([v.lat,v.lng]);const c=document.querySelector(`[data-mv="${id}"]`);if(c)c.scrollIntoView({behavior:'smooth',block:'nearest'});if(fromMap&&dist(v)>D.radius)toast(t(`${vName(v)} อยู่นอกรัศมี ${D.radius} กม.`,`${vName(v)} is outside the ${D.radius} km radius`))}
function areaSuggest(q){
  q=q.trim().toLowerCase();const box=$('#areasug');if(!box)return;if(!q){box.innerHTML='';return}
  const a=AREAS.map((x,i)=>({x,i})).filter(({x})=>(x.th+' '+x.en+' '+x.kw).toLowerCase().includes(q)).map(({x,i})=>`<button data-a="pickArea" data-i="${i}">${ic('pin',18)}<span>${x[lg()]}</span></button>`);
  const v=VENUES.filter(x=>(x.th.name+x.en.name+x.th.area+x.en.area).toLowerCase().includes(q)).map(x=>`<button data-a="pickArea" data-v="${x.id}">${ic('grid',18)}<span>${vName(x)}<br><small class="mut">${vx(x,'area')}</small></span></button>`);
  box.innerHTML=[...a,...v].join('')||`<button disabled>${ic('info',18)}<span class="mut">${t('ไม่พบพื้นที่นี้ ลองแตะบนแผนที่เพื่อปักหมุดเอง','Area not found. Tap the map to drop a pin instead.')}</span></button>`;
}
/* --- venue --- */
function timetable(v){
  const s=UI.sel;const LAB={free:t('ว่าง','Free'),booked:t('เต็ม','Full'),queued:t('ในคิว','Queued'),mine:t('ของคุณ','Yours'),blocked:t('ปิด','Closed'),past:''};
  const cells=HOURS.map(h=>`<div class="gt">${hh(h)}</div>`+vx(v,'courts').map((_,c)=>{
    let st=slotState(v.id,c,UI.date,h);const sel=s&&s.court===c&&s.hours.includes(h);
    if(st==='booked'&&inQueue(v.id,c,UI.date,h))st='queued';
    const lab=sel?ic('check',16):LAB[st];
    return `<button class="cell ${sel?'sel':st}" data-a="cell" data-c="${c}" data-h="${h}" aria-label="${court(v,c)} ${hh(h)} ${sel?t('ที่เลือก','selected'):(LAB[st]||t('ผ่านไปแล้ว','past'))}" ${st==='past'?'tabindex="-1"':''}>${lab}</button>`}).join('')).join('');
  return `${dateStrip(UI.date,'vdate')}
   <div class="legend"><span><i style="background:#fff;border:1px solid var(--line)"></i>${LAB.free}</span><span><i style="background:var(--brand)"></i>${t('ที่เลือก','Selected')}</span><span><i style="background:#E3E8E4"></i>${t('เต็ม (แตะเพื่อเข้าคิว)','Full (tap to queue)')}</span><span><i style="background:var(--lime)"></i>${LAB.mine}</span></div>
   <div class="grid" style="--n:${nCourts(v)}"><div></div>${vx(v,'courts').map(c=>`<div class="gh">${c}</div>`).join('')}${cells}</div>`;
}
function reviewsOf(v){
  const mine=D.reviews.filter(r=>r.venue===v.id).map(r=>({n:t('Nice (คุณ)','Nice (you)'),s:r.stars,x:r.tags.map(i=>RTAGS[lg()][i]).join(' · ')||t('ให้คะแนนแล้ว','Rated')}));
  const seed=[0,1,2].map(i=>({n:nameAt(hash(v.id+i)),s:hash(v.id+i+'s')%10<7?5:4,x:REVTXT[lg()][hash(v.id+i+'t')%6]}));
  return [...mine,...seed];
}
function pitchInfo(v){
  return `<div class="pitch-d">${art(v)}<div class="vrow" style="margin-top:10px;font-size:14px"><span class="mut">${t('ผังสนาม','Layout')}</span><b>${v.size}</b></div></div>
  <div class="facts"><div class="fact"><small>${t('พื้นสนาม','Surface')}</small><b>${vx(v,'surface')}</b></div><div class="fact"><small>${t('จำนวนผู้เล่น','Players')}</small><b>${vx(v,'players')}</b></div><div class="fact"><small>${t('เวลาเปิด','Opening hours')}</small><b>${v.open}</b></div><div class="fact"><small>${t('จำนวนสนาม','Courts')}</small><b>${nCourts(v)} ${v.sport==='football'?t('สนาม','pitches'):t('คอร์ท','courts')}</b></div></div>
  <div class="card"><h3>${t('สิ่งอำนวยความสะดวก','Facilities')}</h3><div class="fac">${vx(v,'fac').map(f=>`<span>${ic('check',14)}${f}</span>`).join('')}</div></div>
  <div class="info-cols"><div class="card"><h3>${t('ร้านค้าใกล้สนาม','Nearby shops')}</h3><ul class="list">${vx(v,'near').map(([n,d])=>`<li><span>${n}</span><span class="mut">${d}</span></li>`).join('')}</ul></div>
  <div class="card"><h3>${t('กติกาสนาม','Venue rules')}</h3><ul class="list"><li><span>${t('ยกเลิกได้ถึงก่อนเวลาเล่น','Cancel up to')}</span><span class="mut">${t('24 ชม. (หลังจากนั้นยกเลิกไม่ได้)','24 hrs before (not after)')}</span></li><li><span>${t('ควรมาถึงก่อนเวลา','Arrive early by')}</span><span class="mut">${t('10 นาที','10 min')}</span></li><li><span>${t('รองเท้า','Shoes')}</span><span class="mut">${t('ปุ่มยาง/พื้นเรียบ','Rubber studs / flat soles')}</span></li></ul></div></div>
  <div class="card"><h3>${vx(v,'area')} · ${t(`ห่าง ${fmtKm(v)} กม. จาก${esc(locName())}`,`${fmtKm(v)} km from ${esc(locName())}`)}</h3><div class="minimap" id="vmap" data-lat="${v.lat}" data-lng="${v.lng}"></div></div>
  <div class="card"><div class="vrow"><h3>${t('รีวิวจากผู้เล่น','Player reviews')}</h3><span class="rate">${ic('star',14)} ${v.rating} · ${v.reviews} ${t('รีวิว','reviews')}</span></div>${reviewsOf(v).map(r=>`<div class="rev"><div class="vrow"><b style="font-size:15px">${esc(r.n)}</b><span class="stars">${'★'.repeat(r.s)}${'☆'.repeat(5-r.s)}</span></div><p class="mut sm-t">${esc(r.x)}</p></div>`).join('')}</div>`;
}
function selSummary(v){const s=UI.sel,n=s?s.hours.length:0;return {n,txt:n?`${court(v,s.court)} · ${fmtDate(UI.date)} · ${range(s.hours)}`:'',total:v.price*n}}
function venueView(){
  const v=V(UI.venue);if(!v)return home();const s=selSummary(v);
  const hint=t('แตะช่อง "ว่าง" เพื่อเลือกเวลา เลือกต่อกันได้สูงสุด 3 ชม.','Tap a "Free" slot to pick a time. Up to 3 hours in a row.');
  const panel=`<div class="card bpanel"><h3>${t('สรุปการจอง','Booking summary')}</h3>${s.n?`<div class="row"><span class="mut">${t('ช่วงเวลา','Time')}</span><span>${s.txt}</span></div><div class="row"><span class="mut">${t('ค่าสนาม','Court fee')}</span><span>${baht(v.price)} × ${s.n} ${HR(s.n)}</span></div><div class="row total"><span>${t('รวม','Total')}</span><span>${baht(s.total)}</span></div><button class="btn block" style="margin-top:12px" data-a="toCheckout">${t('จองเลย','Book now')}</button>`
     :`<p class="mut sm-t">${hint}</p>`}
     <div class="note">${ic('shield',16)}<span>${t('ยกเลิกได้ถึง 24 ชม. ก่อนเวลาเล่น หลังจากนั้นยกเลิกไม่ได้','Cancel up to 24 hrs before play. No cancellations after that.')}</span></div></div>
    <div class="card"><h3>${ic('pin',16)}${t(`${fmtKm(v)} กม. จาก${esc(locName())}`,`${fmtKm(v)} km from ${esc(locName())}`)}</h3><p class="mut sm-t">${vx(v,'area')}</p><div class="fac">${vx(v,'fac').slice(0,4).map(f=>`<span>${f}</span>`).join('')}</div></div>`;
  return `<div class="vhero-wrap"><div class="hero">${art(v,'art')}<button class="iconbtn back" data-a="back" aria-label="${t('ย้อนกลับ','Back')}">${ic('back')}</button>${langBtn('onhero')}
   <div class="hero-t"><span class="tag">${SPORTS[v.sport].icon} ${vx(v,'type')}</span><h1>${vName(v)}</h1><div class="meta light">${ic('star',14)} ${v.rating} (${v.reviews} ${t('รีวิว','reviews')}) · ${ic('pin',14)} ${fmtKm(v)} ${KM()} · ${baht(v.price)}/${HR(1)}</div></div></div></div>
   <div class="wrap"><div class="vlayout"><div><div class="seg"><button class="${UI.vtab==='time'?'on':''}" data-a="vtab" data-t="time">${t('ตารางเวลาว่าง','Free times')}</button><button class="${UI.vtab==='info'?'on':''}" data-a="vtab" data-t="info">${t('MatchPitch ข้อมูลสนาม','MatchPitch venue info')}</button></div>
   ${UI.vtab==='info'?pitchInfo(v):timetable(v)}</div><aside class="vaside">${panel}</aside></div></div>
   <div class="cta hide-d">${s.n?`<div style="min-width:0"><div class="cta-t">${s.txt}</div><div class="cta-p">${baht(s.total)} <small>${s.n} ${HR(s.n)}</small></div></div><button class="btn" data-a="toCheckout">${t('จองเลย','Book now')}</button>`
     :(UI.vtab==='info'?`<button class="btn block" data-a="vtab" data-t="time">${t('ดูตารางเวลาว่าง','See free times')}</button>`:`<div class="cta-hint">${hint}</div>`)}</div>`;
}
/* --- checkout / pay / success --- */
const coAmounts=()=>{const c=UI.co,v=V(c.venue),per=v.price*c.hours.length,disc=D.firstUsed?0:50;return {v,per,disc,today:per-disc}};
function checkout(){
  const c=UI.co,{v,per,disc,today}=coAmounts(),n=c.hours.length;
  const pms=[['promptpay','PromptPay QR',t('สแกนจ่ายผ่านแอปธนาคาร','Scan with any banking app'),'#113566','QR'],['card',t('บัตรเครดิต/เดบิต','Credit/debit card'),'Visa · Mastercard · JCB','#1C2B4A','CARD'],['truemoney','TrueMoney Wallet',t('จ่ายผ่านวอลเล็ต','Pay with your wallet'),'#E8611A','TMN']];
  const priceCard=`<div class="card"><h3 style="margin-bottom:6px">${t('สรุปยอด','Price summary')}</h3><div class="row"><span>${t('ค่าสนาม','Court fee')} ${baht(v.price)} × ${n} ${HR(n)}</span><span>${baht(per)}</span></div>
    ${disc?`<div class="row"><span>${t('ส่วนลดจองครั้งแรก','First-booking discount')}</span><span class="disc">-${baht(disc)}</span></div>`:''}
    <div class="row total"><span>${t('ชำระวันนี้','Pay today')}</span><span>${baht(today)}</span></div>
    ${canCancel(c.date,c.hours)?`<div class="note">${ic('shield',16)}<span>${t('ยกเลิกได้ถึง 24 ชม. ก่อนเวลาเล่น คืนเงินเต็มจำนวน หลังจากนั้นยกเลิกไม่ได้','Cancel up to 24 hrs before play for a full refund. No cancellations after that.')}</span></div>`:`<div class="note amber">${ic('lock',16)}<span>${t('การจองนี้เริ่มภายใน 24 ชม. ชำระเงินแล้วจะยกเลิกไม่ได้','This booking starts within 24 hrs, so it cannot be cancelled once paid.')}</span></div>`}
    <button class="btn block d-only" style="margin-top:14px" data-a="toPay">${t('ชำระเงิน','Pay')} ${baht(today)}</button></div>`;
  return `${bar(t('ตรวจสอบการจอง','Review booking'))}<div class="wrap"><div class="colayout"><div>
   <div class="card"><div class="sum"><div class="thumb">${art(v)}</div><div style="min-width:0"><h3>${vName(v)}</h3><div class="mut sm-t">${court(v,c.court)} · ${vx(v,'type')}</div><div style="font-size:15px;margin-top:2px">${fmtLong(c.date)} · ${range(c.hours)}</div></div></div></div>
   ${UI.invite.length?`<div class="card"><h3>${ic('send',16)}${t('ชวนเพื่อนจาก MatchTime','Invite friends from MatchTime')}</h3><div class="mut sm-t" style="margin-top:2px">${t(`ส่งคำชวนให้ ${fnList(UI.invite)} หลังจองเสร็จ`,`${fnList(UI.invite)} will get an invite once you book`)}</div></div>`:''}
   <div class="card"><h3>${t('วิธีชำระเงิน','Payment method')}</h3>${pms.map(([id,ti,s,col,lgo])=>`<button class="pm ${c.method===id?'on':''}" data-a="method" data-m="${id}" aria-pressed="${c.method===id}"><span class="logo" style="background:${col}">${lgo}</span><span><b>${ti}</b><br><small class="mut">${s}</small></span><span class="radio"></span></button>`).join('')}</div>
  </div><aside class="coaside">${priceCard}</aside></div></div>
  <div class="cta hide-d"><div><div class="cta-t">${t('ยอดชำระ','Amount due')}</div><div class="cta-p">${baht(today)}</div></div><button class="btn" data-a="toPay">${t('ชำระเงิน','Pay')}</button></div>`;
}
function pay(){
  const c=UI.co,{v,today:amt}=coAmounts();let body='';const nomoney=t('ต้นแบบนี้ไม่มีการตัดเงินจริง','No real money is charged in this prototype.');
  if(c.method==='promptpay')body=`<div class="card qrwrap"><div class="pp-head">Thai QR Payment · PromptPay</div><div class="qr">${qrSvg(c.venue+c.date+c.hours)}<div class="amt">${baht(amt)}</div><div class="mut sm-t">${t('บริษัท บุ๊คแมตช์ จำกัด','BookMatch Co., Ltd.')}</div></div><div class="note amber" style="justify-content:center">${ic('clock',16)}<span>${t('QR หมดอายุใน','QR expires in')} <b id="cd">05:00</b></span></div></div>
    <button class="btn block" data-a="paid">${t('จำลอง: สแกนจ่ายสำเร็จ','Simulate: payment scanned')}</button><p class="mut" style="font-size:13px;text-align:center;margin-top:8px">${nomoney}</p>`;
  else if(c.method==='card')body=`<div class="card"><label class="field"><span>${t('หมายเลขบัตร','Card number')}</span><input inputmode="numeric" placeholder="0000 0000 0000 0000" autocomplete="off"></label><label class="field"><span>${t('ชื่อบนบัตร','Name on card')}</span><input placeholder="NICE SURNAME" autocomplete="off"></label><div class="two"><label class="field"><span>${t('วันหมดอายุ','Expiry')}</span><input placeholder="MM/YY" autocomplete="off"></label><label class="field"><span>CVV</span><input inputmode="numeric" placeholder="123" autocomplete="off"></label></div>
    <div class="note">${ic('lock',16)}<span>${t('ข้อมูลบัตรส่งตรงไปยังผู้ให้บริการชำระเงินที่ได้มาตรฐาน PCI DSS และยืนยันตัวตนด้วย 3-D Secure BookMatch ไม่เก็บเลขบัตร','Card details go straight to a PCI DSS-certified payment provider and are verified with 3-D Secure. BookMatch never stores card numbers.')}</span></div></div>
    <button class="btn block" data-a="paid">${t('ชำระ','Pay')} ${baht(amt)}</button><p class="mut" style="font-size:13px;text-align:center;margin-top:8px">${nomoney} ${t('ไม่ต้องกรอกข้อมูล','No need to fill anything in.')}</p>`;
  else body=`<div class="card"><label class="field"><span>${t('เบอร์ TrueMoney Wallet','TrueMoney Wallet number')}</span><input inputmode="tel" placeholder="08X-XXX-XXXX" autocomplete="off"></label><div class="note">${ic('info',16)}<span>${t('ระบบจะส่งคำขอชำระเงินไปที่แอป TrueMoney ให้กดยืนยันในแอป','A payment request goes to your TrueMoney app. Confirm it there.')}</span></div></div>
    <button class="btn block" data-a="paid">${t('จำลอง: ยืนยันในแอปแล้ว','Simulate: confirmed in app')}</button>`;
  return `${bar(t('ชำระเงิน','Payment'),`${vName(v)} · ${range(c.hours)}`)}<div class="wrap narrow" id="paybody">${body}</div>`;
}
function success(){
  const b=UI.last;if(!b)return home();const v=V(b.venue),sec=b.elapsed,fast=sec!=null&&sec<=120;
  return `<div class="wrap narrow"><div class="ok"><div class="tick">${ic('check',38)}</div><h1>${t('จองสำเร็จ!','Booked!')}</h1><p class="mut">${t('ส่งการยืนยันไปที่แจ้งเตือนแล้ว และจะเตือนอีกครั้ง 2 ชม. ก่อนเวลาเล่น','Confirmation sent to your notifications. We will remind you 2 hours before play.')}</p>
   ${sec!=null?`<span class="pill ${fast?'g':'a'}">${ic('clock',14)} ${t(`ใช้เวลาจอง ${mmss(sec)} นาที`,`Booked in ${mmss(sec)}`)} ${fast?t('(ผ่านเป้า 2 นาที)','(under the 2-min target)'):t('(เกินเป้า 2 นาที)','(over the 2-min target)')}</span>`:''}</div>
   <div class="ticket"><div class="tt"><span>${t('รหัสการจอง','Booking code')}</span><b>${b.id}</b></div><div class="tb">
    <div class="row"><span class="mut">${t('สนาม','Venue')}</span><span>${vName(v)}</span></div><div class="row"><span class="mut">${t('คอร์ท','Court')}</span><span>${court(v,b.court)}</span></div>
    <div class="row"><span class="mut">${t('วันที่','Date')}</span><span>${fmtLong(b.date)}</span></div><div class="row"><span class="mut">${t('เวลา','Time')}</span><span>${range(b.hours)}</span></div>
    <div class="row total"><span>${t('ชำระแล้ว','Paid')}</span><span>${baht(b.paid)}</span></div></div></div>
   ${b.invite&&b.invite.length?`<div class="note green">${ic('send',16)}<span>${t(`ส่งคำชวนให้ ${fnList(b.invite)} แล้ว เพื่อนกดยืนยันได้จากลิงก์`,`Invites sent to ${fnList(b.invite)}. They confirm from the link.`)}</span></div>`:`<button class="btn ghost block" data-a="tab" data-t="matchtime">${ic('users',18)} ${t('ชวนเพื่อนผ่าน MatchTime','Invite friends with MatchTime')}</button>`}
   <button class="btn block" style="margin-top:10px" data-a="tab" data-t="bookings">${t('ดูการจองของฉัน','My bookings')}</button>
   <button class="btn ghost block" style="margin-top:10px" data-a="tab" data-t="home">${t('กลับหน้าแรก','Back to home')}</button></div>`;
}
/* --- bookings --- */
function bookings(){
  const segs=`<div class="seg" style="max-width:420px;margin-top:0"><button class="${UI.bkTab==='up'?'on':''}" data-a="bkTab" data-t="up">${t('กำลังจะถึง','Upcoming')}</button><button class="${UI.bkTab==='past'?'on':''}" data-a="bkTab" data-t="past">${t('ที่ผ่านมา','Past')}</button></div>`;
  let body='';
  if(UI.bkTab==='up'){
    const up=upcoming();
    const q=D.queue.map(q=>{const v=V(q.venue);return `<div class="bk" style="border:1px solid #F3CF94"><div class="vrow"><div style="min-width:0"><h3>${vName(v)}</h3><div class="mut sm-t">${court(v,q.court)} · ${fmtDate(q.date)} · ${range([q.h])}</div></div><span class="badge a">${t('คิวที่','Position')} ${q.pos}</span></div>
      <div class="bk-act"><button class="btn amber sm" data-a="simCancel" data-k="${q.key}">${t('จำลอง: มีคนยกเลิก','Simulate: someone cancels')}</button><button class="btn ghost sm" data-a="leaveQ" data-k="${q.key}">${t('ออกจากคิว','Leave queue')}</button></div></div>`}).join('');
    const list=up.map(b=>{const v=V(b.venue),x=parse(b.on);return `<div class="bk"><div class="bk-top"><div class="datebox"><small>${dayS(x.getDay())}</small><b>${x.getDate()}</b><small>${monS(x.getMonth())}</small></div><div style="min-width:0"><h3>${vName(v)}</h3><div class="mut sm-t">${court(v,b.court)} · ${range(b.hours)}</div></div></div>
      <div class="badges"><span class="badge g">${ic('check',12)} ${t('ชำระแล้ว','Paid')}</span>${canCancel(b.on,b.hours)?'':`<span class="badge a">${ic('lock',12)} ${t('ภายใน 24 ชม. ยกเลิกไม่ได้','Within 24 hrs, locked')}</span>`}${b.invite&&b.invite.length?`<span class="badge">${ic('users',12)} ${t(`เพื่อน ${b.invite.length} คน`,`${b.invite.length} friends`)}</span>`:''}<span class="badge">${b.id}</span></div>
      <div class="bk-act"><button class="btn ghost sm" data-a="ticket" data-id="${b.id}" data-on="${b.on}">${t('ดูตั๋วเข้าสนาม','Entry ticket')}</button>${canCancel(b.on,b.hours)?`<button class="btn ghost sm" data-a="cancel" data-id="${b.id}" data-on="${b.on}" style="color:var(--red)">${t('ยกเลิก','Cancel')}</button>`:`<button class="btn ghost sm" disabled title="${t('ยกเลิกไม่ได้ภายใน 24 ชม. ก่อนเวลาเล่น','Cannot cancel within 24 hrs of play')}">${ic('lock',14)} ${t('ยกเลิกไม่ได้','No cancellations')}</button>`}</div></div>`}).join('');
    body=`${D.queue.length?`<div class="sec-h"><h2>${ic('queue',18)}${t('MatchQueue ที่รออยู่','Waiting in MatchQueue')}</h2><span>${D.queue.length} ${t('รายการ','items')}</span></div><div class="bgrid">${q}</div>`:''}
      <div class="sec-h"><h2>${t('กำลังจะถึง','Upcoming')}</h2>${up.length?`<button class="tchip" data-a="simDone">${t('จำลอง: เล่นเสร็จแล้ว','Simulate: game played')}</button>`:''}</div>
      <div class="bgrid">${list||`<div class="empty">${ic('cal',40)}<p style="margin-top:8px">${t('ยังไม่มีการจอง','No bookings yet')}</p><button class="btn sm" style="margin-top:12px" data-a="tab" data-t="home">${t('หาสนาม','Find a venue')}</button></div>`}</div>`;
  }else{
    const past=D.done.slice().reverse();
    body=`<div class="bgrid" style="margin-top:16px">${past.map(p=>{const v=V(p.venue),x=parse(p.on);return `<div class="bk"><div class="bk-top"><div class="datebox" style="background:var(--soft);color:var(--mut)"><small>${dayS(x.getDay())}</small><b>${x.getDate()}</b><small>${monS(x.getMonth())}</small></div><div style="min-width:0"><h3>${vName(v)}</h3><div class="mut sm-t">${court(v,p.court)} · ${range(p.hours)}</div></div></div>
      <div class="badges"><span class="badge">${t('เล่นแล้ว','Played')}</span>${p.rated?`<span class="badge a">${'★'.repeat(p.rated)} ${t('ให้คะแนนแล้ว','Rated')}</span>`:''}</div>
      <div class="bk-act">${p.rated?'':`<button class="btn amber sm" data-a="rate" data-id="${p.id}" data-on="${p.on}">${ic('star',14)} ${t('ให้คะแนน','Rate')}</button>`}<button class="btn ghost sm" data-a="rebook" data-id="${p.id}" data-on="${p.on}">${ic('repeat',14)} ${t('จองอีกครั้ง','Book again')}</button></div></div>`}).join('')
      ||`<div class="empty">${ic('clock',40)}<p style="margin-top:8px">${t('ยังไม่มีประวัติการเล่น','No games played yet')}</p><p class="sm-t">${t('หลังเวลาเล่น การจองจะย้ายมาที่นี่ ให้คะแนนสนามและจองซ้ำได้ในแตะเดียว','After you play, bookings move here so you can rate the venue and book again in one tap.')}</p></div>`}</div>`;
  }
  return `<div class="wrap"><header class="top"><h1>${t('การจองของฉัน','My bookings')}</h1>${topAct()}</header>${segs}${body}</div>`;
}
function notifs(){
  const l=D.notifs.map(n=>{const[i,c]=NI[n.k]||NI.booked;const[ti,b]=(NT[n.k]||NT.welcome)(n.p||{});return `<div class="nt ${n.read?'':'unread'}"><div class="ni ${c}">${ic(i,20)}</div><div><h3>${esc(ti)}</h3><p>${esc(b)}</p><time>${ago(n.at)}</time></div></div>`}).join('');
  return `<div class="wrap"><header class="top"><h1>${t('แจ้งเตือน','Notifications')}</h1><div class="top-act">${langBtn()}<button class="btn ghost sm" data-a="simRemind">${ic('clock',16)} ${t('จำลองเตือนก่อนเล่น','Simulate reminder')}</button></div></header><div class="nlist">${l||`<div class="empty">${t('ยังไม่มีแจ้งเตือน','No notifications yet')}</div>`}</div></div>`;
}
/* --- matchtime --- */
function matchtime(){
  const sel=D.friends,team=['me',...sel],tot=team.length,days=days7(),MH=[16,17,18,19,20,21];
  const score=(d,h)=>(d===TODAY&&h<=nowH())?-1:team.filter(p=>avail(p,d,h)).length;
  const best=[];days.forEach(d=>MH.forEach(h=>{if(score(d,h)===tot)best.push([d,h])}));
  const cells=MH.map(h=>`<div class="t">${hh(h)}</div>`+days.map(d=>{const s=score(d,h);if(s<0)return `<div class="mc" style="border:1px dashed var(--line)"></div>`;
     const r=s/tot;const bg=r===1?'var(--brand)':`rgba(11,122,75,${0.08+r*0.45})`;return `<button class="mc ${r===1?'full':''}" style="background:${bg};color:${r===1?'#fff':'var(--brand-d)'}" data-a="mtCell" data-d="${d}" data-h="${h}" aria-label="${fmtDate(d)} ${hh(h)} ${t(`ว่าง ${s} จาก ${tot}`,`${s} of ${tot} free`)}">${s}/${tot}</button>`}).join('')).join('');
  return `<div class="wrap"><header class="top"><div><div class="hello">MatchTime</div><h1>${t('หาเวลาว่างที่ตรงกัน','Find a time that suits everyone')}</h1></div>${topAct()}</header>
   <div class="mtlayout"><div>
   <p class="mut" style="font-size:15px;margin-bottom:10px">${t('เลือกเพื่อนที่จะชวน ระบบดึงตารางว่างของทุกคนมาเทียบให้','Pick who to invite and it compares everyone’s free time')}</p>
   <div class="friends"><div class="fr me"><div class="av" style="background:var(--brand)">N</div>${t('คุณ','You')}</div>${FRIENDS.map(f=>`<button class="fr ${sel.includes(f.id)?'on':''}" data-a="friend" data-f="${f.id}" aria-pressed="${sel.includes(f.id)}"><div class="av" style="background:${f.c}">${f[lg()].slice(0,1)}</div>${f[lg()]}</button>`).join('')}</div>
   <div class="sec-h"><h2>${t('ช่วงที่ว่างครบทุกคน','Everyone free')}</h2><span>${best.length} ${t('ช่วง','slots')}</span></div>
   ${best.slice(0,4).map(([d,h])=>{const x=parse(d);return `<button class="best" data-a="mtCell" data-d="${d}" data-h="${h}"><div class="datebox"><small>${dayS(x.getDay())}</small><b>${x.getDate()}</b></div><div style="flex:1"><h3>${hh(h)}–${hh(h+1)}</h3><div class="mut sm-t">${t(`ว่างครบ ${tot} คน`,`All ${tot} free`)}</div></div><span class="tchip">${t('หาสนาม','Find venue')}</span></button>`}).join('')||`<div class="note amber">${t('ไม่มีช่วงที่ทุกคนว่างตรงกันในสัปดาห์นี้ ลองลดจำนวนเพื่อน หรือดูช่วงที่ว่างเกือบครบในตาราง','No slot this week where everyone is free. Try fewer friends, or check the near-misses in the grid.')}</div>`}
   </div><div><div class="sec-h"><h2>${t('ตารางว่าง 7 วัน','7-day availability')}</h2><span>${t('จำนวนคนที่ว่าง','People free')}</span></div>
   <div class="card" style="padding:12px"><div class="mtgrid"><div></div>${days.map(d=>{const x=parse(d);return `<div class="h">${d===TODAY?todayL():dayS(x.getDay())}<br><b style="color:var(--ink)">${x.getDate()}</b></div>`}).join('')}${cells}</div></div></div></div></div>`;
}
function mtVenues(){
  const {d,h}=UI.mt;const list=sortVenues(VENUES.filter(v=>v.sport===UI.mtSport)).map(v=>({v,c:firstFreeCourt(v.id,d,h)}));
  return `${bar(t('สนามว่างช่วงนี้','Venues free at this time'),`${fmtLong(d)} · ${hh(h)}–${hh(h+1)}`)}<div class="wrap">
   <div class="note green" style="margin-top:0">${ic('users',16)}<span>${UI.invite.length?t(`ชวน ${fnList(UI.invite)} ระบบจะส่งคำชวนหลังจองเสร็จ`,`Inviting ${fnList(UI.invite)}. Invites go out once you book.`):t('ยังไม่มีเพื่อนที่ว่างช่วงนี้ จองไว้ก่อนแล้วชวนทีหลังได้','None of your friends are free then. Book now and invite people later.')}</span></div>
   <div class="chips">${Object.keys(SPORTS).map(s=>`<button class="chip ${UI.mtSport===s?'on':''}" data-a="mtSport" data-s="${s}">${SPORTS[s].icon} ${sportL(s)}</button>`).join('')}</div>
   <div class="bgrid" style="margin-top:12px">${list.map(({v,c})=>`<div class="bk"><div class="sum"><div class="thumb">${art(v)}</div><div style="flex:1;min-width:0"><h3>${vName(v)}</h3><div class="mut sm-t">${fmtKm(v)} ${KM()} · ${baht(v.price)}/${HR(1)}</div>${c>=0?`<span class="free" style="display:inline-block;margin-top:4px">${t('ว่าง','Free:')} ${court(v,c)}</span>`:`<span class="free none" style="display:inline-block;margin-top:4px">${t('เต็ม','Full')}</span>`}</div></div>
   <div class="bk-act">${c>=0?`<button class="btn sm" data-a="mtBook" data-v="${v.id}" data-c="${c}">${t('จองช่วงนี้','Book this slot')}</button>`:`<button class="btn amber sm" data-a="mtQueue" data-v="${v.id}">${t('เข้าคิว MatchQueue','Join MatchQueue')}</button>`}</div></div>`).join('')}</div></div>`;
}
function profile(){
  const n=D.bookings.length,hrs=D.bookings.reduce((a,b)=>a+b.hours.length*(b.repeat||1),0);
  return `<div class="wrap narrow"><header class="top"><h1>${t('โปรไฟล์','Profile')}</h1>${topAct()}</header>
   <div class="prof"><div class="avatar">N</div><div><h2>Nice</h2><div class="mut" style="font-size:15px">${t('นักศึกษา ม.มหิดล · ฟุตบอล','Mahidol University student · Football')}</div></div></div>
   <div class="stats"><div class="stat"><b>${n}</b><small>${t('การจอง','Bookings')}</small></div><div class="stat"><b>${hrs}</b><small>${t('ชั่วโมงที่จอง','Hours booked')}</small></div><div class="stat"><b>${D.friends.length}</b><small>${t('เพื่อนในกลุ่ม','Friends')}</small></div></div>
   <div class="menu"><button data-a="lang">${ic('globe')}<span style="flex:1">${t('ภาษา','Language')}<br><small class="mut">${t('ไทย · แตะเพื่อเปลี่ยนเป็น English','English · tap to switch to ไทย')}</small></span></button>
    <button data-a="tab" data-t="map">${ic('pin')}<span style="flex:1">${t('พื้นที่ค้นหา','Search area')}<br><small class="mut">${esc(locName())} · ${D.radius} ${KM()}</small></span></button>
    <button data-a="toOwner">${ic('swap')}<span style="flex:1">${t('สลับเป็นเจ้าของสนาม','Switch to venue owner')}<br><small class="mut">${t('ดูมุมมองของคุณ John','See John’s view')}</small></span></button>
    <button data-a="scope">${ic('info')}<span style="flex:1">${t('ขอบเขตของต้นแบบ','Prototype scope')}</span></button>
    <button data-a="reset">${ic('reset')}<span style="flex:1">${t('รีเซ็ตข้อมูลตัวอย่าง','Reset sample data')}</span></button>
    <button data-a="logout" style="color:var(--red)">${ic('logout')}<span style="flex:1">${t('ออกจากระบบ','Sign out')}</span></button></div>
   <p class="mut" style="font-size:13px;text-align:center">${t('BookMatch ต้นแบบสำหรับวิชา ITDS294 · ข้อมูลทั้งหมดเป็นข้อมูลสมมติ','BookMatch prototype for ITDS294 · all data is fictional')}</p></div>`;
}

/* ============ owner views ============ */
function oState(c,d,h){const k=skey(OWNER_V,c,d,h);const m=mineAt(OWNER_V,c,d,h);
  if(m)return {s:'ob',name:'Nice',src:'app',paid:true};
  if(D.blocks[k])return {s:'blocked'};
  if(D.walkins[k])return {s:D.walkins[k].src==='phone'?'oc':'ow',name:D.walkins[k].name,src:D.walkins[k].src,paid:false};
  if(D.released[k]||!baseBooked(OWNER_V,c,d,h))return {s:'free'};
  const r=hash(k+'s')%10,src=r<7?'app':r<9?'phone':'walkin';
  return {s:src==='app'?'ob':src==='phone'?'oc':'ow',name:nameAt(hash(k)),src,paid:src==='app'};
}
function ownerStats(){
  const v=V(OWNER_V),cap=nCourts(v)*HOURS.length;
  const dayHours=d=>{let n=0;v.th.courts.forEach((_,c)=>HOURS.forEach(h=>{const o=oState(c,d,h);if(o.name)n++}));return n};
  const td=parse(TODAY);let rev=0,app=0,src={app:0,phone:0,walkin:0};
  for(let i=1;i<=td.getDate();i++){const d=iso(new Date(td.getFullYear(),td.getMonth(),i));v.th.courts.forEach((_,c)=>HOURS.forEach(h=>{const o=oState(c,d,h);if(o.name){rev+=v.price;src[o.src]++;if(o.src==='app')app+=v.price}}))}
  const week=Array.from({length:7},(_,i)=>{const d=addDays(TODAY,i-6);return {d,n:dayHours(d)}});
  return {cap,today:dayHours(TODAY),rev,app,src,week};
}
function ownerShell(inner){
  const v=V(OWNER_V);const tabs=[['overview','chart',t('ภาพรวม','Overview')],['schedule','grid',t('ตารางจอง','Schedule')],['queue','queue','MatchQueue'],['settings','gear',t('ตั้งค่าและแพ็กเกจ','Settings & plan')]];
  return `<div class="ohead"><div class="wrap"><div class="brand"><div class="logo-m" style="background:var(--lime);color:var(--ink)">B</div><div style="min-width:0"><b>BookMatch for Venues</b><small>${vName(v)} · ${t('สวัสดีครับ คุณ John','Hello, John')}</small></div></div>
   <div style="display:flex;gap:8px">${langBtn('dark')}<button class="btn sm" data-a="toPlayer">${ic('swap',16)} ${t('มุมมองผู้เล่น','Player view')}</button><button class="btn sm" data-a="logout" aria-label="${t('ออกจากระบบ','Sign out')}">${ic('logout',16)}</button></div></div></div>
  <div class="wrap"><div class="otabs">${tabs.map(([k,i,l])=>`<button class="${UI.oTab===k?'on':''}" data-a="oTab" data-t="${k}">${ic(i,16)}${l}</button>`).join('')}</div><div class="obody">${inner}</div></div>`;
}
function ownerOverview(){
  const v=V(OWNER_V),s=ownerStats(),max=Math.max(...s.week.map(w=>w.n),1),tot=Object.values(s.src).reduce((a,b)=>a+b,0)||1;
  const pct=k=>Math.round(s.src[k]/tot*100);const qn=ownerQueue().reduce((a,q)=>a+q.people.length,0);
  const next=[];v.th.courts.forEach((_,c)=>HOURS.forEach(h=>{if(h>nowH()){const o=oState(c,TODAY,h);if(o.name)next.push({c,h,...o})}}));next.sort((a,b)=>a.h-b.h||a.c-b.c);
  return ownerShell(`<div class="kpis"><div class="kpi"><small>${t('ชั่วโมงที่จองวันนี้','Hours booked today')}</small><b>${s.today}<small class="mut" style="font-size:15px"> / ${s.cap}</small></b><span>${t(`${nCourts(v)} สนาม × ${HOURS.length} ชม.`,`${nCourts(v)} pitches × ${HOURS.length} hrs`)}</span></div>
   <div class="kpi"><small>${t('อัตราการใช้สนามวันนี้','Utilisation today')}</small><b>${Math.round(s.today/s.cap*100)}%</b><span>${t('ช่วงพีค','Peak')} 17:00–21:00</span></div>
   <div class="kpi"><small>${t('รายได้เดือนนี้','Revenue this month')}</small><b>${baht(s.rev)}</b><span>${t('ถึง','to')} ${fmtDate(TODAY)}</span></div>
   <div class="kpi"><small>${t('คนรอในคิว','People in queue')}</small><b>${qn}</b><span>${t('พร้อมเติมถ้ามีคนยกเลิก','Ready to fill cancellations')}</span></div></div>
   <div class="ocols"><div class="card"><h3>${t('ชั่วโมงที่ถูกจอง 7 วันล่าสุด','Hours booked, last 7 days')}</h3><div class="bars">${s.week.map(w=>`<div class="${w.d===TODAY?'today':''}"><em>${w.n}</em><i style="height:${Math.max(6,w.n/max*130)}px"></i><small>${w.d===TODAY?todayL():dayS(parse(w.d).getDay())}</small></div>`).join('')}</div></div>
   <div class="card"><h3>${t('ช่องทางการจองเดือนนี้','Booking channels this month')}</h3><div class="stack"><i style="width:${pct('app')}%;background:var(--brand)"></i><i style="width:${pct('phone')}%;background:#6C98DE"></i><i style="width:${pct('walkin')}%;background:#A57BD0"></i></div>
    <div class="lg"><span><i style="background:var(--brand)"></i>BookMatch ${pct('app')}% · ${t('จองและจ่ายเองอัตโนมัติ','self-serve booking and payment')}</span><span><i style="background:#6C98DE"></i>${t('โทรจอง','Phone')} ${pct('phone')}%</span><span><i style="background:#A57BD0"></i>${t('จองหน้าสนาม','Walk-in')} ${pct('walkin')}%</span></div>
    <div class="note green">${ic('info',16)}<span>${t('สายโทรเข้าลดลงเพราะลูกค้าเห็นเวลาว่างเองในแอป','Fewer phone calls, because customers can see free times in the app.')}</span></div></div></div>
   <div class="card"><div class="vrow"><h3>${t('การจองถัดไปวันนี้','Next bookings today')}</h3><button class="btn ghost sm" data-a="oTab" data-t="schedule">${t('ดูตารางทั้งหมด','Full schedule')}</button></div><ul class="list">${next.slice(0,6).map(n=>`<li><span>${hh(n.h)} · ${court(v,n.c)} · ${n.name}</span><span class="badge ${n.src==='app'?'g':''}">${srcL(n.src)}</span></li>`).join('')||`<li><span class="mut">${t('ไม่มีการจองเหลือวันนี้','No more bookings today')}</span></li>`}</ul></div>`);
}
function ownerSchedule(){
  const v=V(OWNER_V),d=UI.oDate;
  const cells=HOURS.map(h=>`<div class="gt">${hh(h)}</div>`+v.th.courts.map((_,c)=>{const o=oState(c,d,h);const past=d===TODAY&&h<=nowH();
    const lab=o.s==='free'?(past?'':t('+ ว่าง','+ Free')):o.s==='blocked'?t('ปิดซ่อม','Maintenance'):esc(o.name);return `<button class="cell ${o.s}" ${past&&o.s==='free'?'disabled style="opacity:.4"':''} data-a="oCell" data-c="${c}" data-h="${h}" title="${lab}">${lab}</button>`}).join('')).join('');
  return ownerShell(`<div class="card"><div class="vrow" style="flex-wrap:wrap"><h3>${t('ตารางจอง','Schedule:')} ${fmtLong(d)}</h3><div class="legend" style="margin:0"><span><i style="background:#DCEFE4"></i>BookMatch</span><span><i style="background:#E7EEF9"></i>${t('โทรจอง','Phone')}</span><span><i style="background:#F1EAF8"></i>${t('หน้าสนาม','Walk-in')}</span><span><i style="background:#33413A"></i>${t('ปิด','Closed')}</span></div></div>
   ${dateStrip(d,'oDate')}<p class="mut sm-t" style="margin:8px 0 12px">${t('แตะช่องว่างเพื่อบันทึกการจองที่รับทางโทรศัพท์หรือหน้าสนาม หรือปิดช่วงเวลาเพื่อซ่อมบำรุง ไม่ต้องจดมือแยก','Tap a free slot to log a phone or walk-in booking, or close it for maintenance. No more paper notes.')}</p>
   <div class="og" style="--n:${nCourts(v)}"><div></div>${vx(v,'courts').map(c=>`<div class="gh">${c}</div>`).join('')}${cells}</div></div>`);
}
function ownerQueue(){
  const v=V(OWNER_V),out=[];
  days7().slice(0,4).forEach(d=>v.th.courts.forEach((_,c)=>[17,18,19,20].forEach(h=>{const k=skey(OWNER_V,c,d,h);if(oState(c,d,h).s==='free'||(d===TODAY&&h<=nowH()))return;
    const n=hash(k+'q')%5;const me=D.queue.find(q=>q.key===k);if(n<3&&!me)return;
    const people=Array.from({length:n%3+1},(_,i)=>nameAt(hash(k+i)));if(me)people.splice(me.pos-1,0,'Nice');out.push({k,d,c,h,people})})));
  return out;
}
function ownerQueueView(){
  const v=V(OWNER_V),q=ownerQueue(),m=D.owner.qmin;
  return ownerShell(`<div class="card"><h3>${t('MatchQueue ทำงานอย่างไร','How MatchQueue works')}</h3><div class="steps" style="margin-top:10px"><div><b>${t('1. ช่วงเวลาเต็ม','1. Slot is full')}</b>${t('ผู้เล่นกดเข้าคิว และเลือกเวลาสำรองไว้','Players join the queue and pick back-up times')}</div><div><b>${t('2. มีคนยกเลิก','2. Someone cancels')}</b>${t(`ระบบเสนอช่วงนั้นให้คิวที่ 1 ทันที ให้ยืนยันใน ${m} นาที`,`The slot goes to position 1 straight away, with ${m} min to confirm`)}</div><div><b>${t('3. ไม่ยืนยัน','3. No reply')}</b>${t('ส่งต่อคิวถัดไปอัตโนมัติ สนามไม่เสียรายได้','It moves to the next person automatically, so no revenue is lost')}</div></div></div>
   <div class="card"><div class="vrow"><h3>${t('ช่วงเวลาที่มีคนรอคิว','Slots with a queue')}</h3><span class="mut sm-t">${q.length} ${t('ช่วง','slots')}</span></div>
   ${q.map(x=>`<div class="qrow"><div><b>${fmtDate(x.d)} · ${hh(x.h)} · ${court(v,x.c)}</b><div class="ppl" style="margin-top:6px">${x.people.map((p,i)=>`<span class="${p==='Nice'?'me':''}">${i+1}. ${p}</span>`).join('')}</div></div><button class="btn ghost sm" data-a="oRelease" data-c="${x.c}" data-d="${x.d}" data-h="${x.h}">${t('จำลอง: ลูกค้ายกเลิก','Simulate: customer cancels')}</button></div>`).join('')||`<p class="mut">${t('ยังไม่มีคิว','No queues yet')}</p>`}</div>`);
}
function ownerSettings(){
  const v=V(OWNER_V),o=D.owner,s=ownerStats();
  const trialEnd=addDays(TODAY,74);
  return ownerShell(`<div class="ocols"><div>
   <div class="card"><h3>${t('ข้อมูลสนาม','Venue details')}</h3>
    <label class="field"><span>${t('ราคาต่อชั่วโมงต่อสนาม (บาท)','Price per pitch per hour (THB)')}</span><input id="oprice" type="number" min="100" step="50" value="${v.price}" inputmode="numeric"></label>
    <div class="two"><label class="field"><span>${t('เวลาเปิด','Opens')}</span><input value="10:00" disabled></label><label class="field"><span>${t('เวลาปิด','Closes')}</span><input value="23:00" disabled></label></div>
    <button class="btn block" style="margin-top:14px" data-a="savePrice">${t('บันทึกราคา','Save price')}</button></div>
   <div class="card"><h3>${t('การจอง','Bookings')}</h3>
    <div class="field"><span>${t('เวลาให้คิวถัดไปยืนยัน (MatchQueue)','Time for the next in queue to confirm (MatchQueue)')}</span><div class="weeks" style="margin-top:0">${[10,15,30].map(m=>`<button class="${o.qmin===m?'on':''}" data-a="qmin" data-m="${m}">${m} ${t('นาที','min')}</button>`).join('')}</div></div>
    </div>
   </div><div>
   <div class="card plan"><small>${t('แพ็กเกจปัจจุบัน','Current plan')}</small><h2 style="margin:2px 0 4px">BookMatch Pro</h2><p style="color:#D2EFDF">${t(`ทดลองใช้ฟรีถึง ${fmtDate(trialEnd)} จากนั้น ฿990/เดือน`,`Free trial until ${fmtDate(trialEnd)}, then ฿990/month`)}</p>
    <ul class="list" style="margin-top:8px"><li><span>${t('MatchQueue เติมสนามที่หลุดจอง','MatchQueue refills cancelled slots')}</span><span>${ic('check',16)}</span></li><li><span>${t('รายงานยอดจองและช่องทาง','Booking and channel reports')}</span><span>${ic('check',16)}</span></li><li><span>${t('บันทึกการจองหน้าสนามและโทร','Log walk-in and phone bookings')}</span><span>${ic('check',16)}</span></li></ul></div>
   <div class="card"><button class="toggle" data-a="oToggle" data-k="boost" aria-pressed="${o.boost}"><div><h3>${t('Boost การมองเห็นสนาม','Boost visibility')}</h3><div class="mut sm-t">${t('ขึ้นเป็นอันดับแรกพร้อมป้าย "แนะนำ" ในแอปผู้เล่น ฿300/เดือน (ฟรีช่วงทดลอง)','Show first with a "Featured" tag in the player app. ฿300/month (free during the trial)')}</div></div><span class="sw ${o.boost?'on':''}"></span></button></div>
   <div class="card"><h3>${t('ยอดโอนรอบถัดไป','Next payout')}</h3><div class="row"><span class="mut">${t('ยอดจองผ่าน BookMatch เดือนนี้','BookMatch bookings this month')}</span><span>${baht(s.app)}</span></div><div class="row"><span class="mut">${t('ค่าคอมมิชชัน 7%','7% commission')}</span><span>-${baht(s.app*0.07)}</span></div><div class="row total"><span>${t('โอนเข้าบัญชีสนาม','Paid to your account')}</span><span>${baht(s.app*0.93)}</span></div><p class="mut" style="font-size:13px;margin-top:6px">${t('โอนทุกวันจันทร์ การจองหน้าสนามและโทรไม่มีค่าคอมมิชชัน','Paid every Monday. No commission on walk-in or phone bookings.')}</p></div>
   </div></div>`);
}

/* ============ router ============ */
const VIEWS={home,map:mapView,venue:venueView,checkout,pay,success,bookings,notifs,matchtime,mtvenues:mtVenues,profile};
const TABS=['home','map','matchtime','bookings','notifs','profile'];
function destroyMaps(){if(MAP){MAP.remove();MAP=null}if(VMAP){VMAP.remove();VMAP=null}}
function render(){
  destroyMaps();const app=$('#app');document.documentElement.lang=lg();
  if(!D.auth){app.innerHTML=login();return save()}
  if(UI.mode==='owner'){app.innerHTML={overview:ownerOverview,schedule:ownerSchedule,queue:ownerQueueView,settings:ownerSettings}[UI.oTab]();}
  else{if(!VIEWS[UI.view]||(['checkout','pay'].includes(UI.view)&&!UI.co))UI.view='home';
    app.innerHTML=`${sidenav()}<main class="main">${VIEWS[UI.view]()}</main>${TABS.includes(UI.view)?tabbar():''}`;
    if(UI.view==='notifs'){D.notifs.forEach(n=>n.read=true)}
    if(UI.view==='map')initMap();
    const vm=$('#vmap');if(vm&&window.L){VMAP=L.map(vm,{zoomControl:false,dragging:false,scrollWheelZoom:false,doubleClickZoom:false,touchZoom:false,attributionControl:false}).setView([+vm.dataset.lat,+vm.dataset.lng],15);L.tileLayer(TILES).addTo(VMAP);L.marker([+vm.dataset.lat,+vm.dataset.lng],{icon:L.divIcon({className:'apin',html:PINSVG,iconSize:[36,46],iconAnchor:[18,45]})}).addTo(VMAP)}}
  save();
}
function go(view,p={}){hist.push({view:UI.view,y:scrollY});Object.assign(UI,p);UI.view=view;render();scrollTo(0,0)}
function back(){closeSheet();const h=hist.pop();UI.view=h?h.view:'home';render();scrollTo(0,h?h.y:0)}
function tab(x){closeSheet();hist=[];UI.view=x;if(x==='home')UI.invite=[];render();scrollTo(0,0)}
const keep=fn=>{const y=scrollY;fn();render();scrollTo(0,y)};

/* ============ actions ============ */
function openVenue(id,preset){UI.venue=id;UI.vtab='time';UI.sel=preset||null;UI.timer=Date.now();go('venue')}
function queueSheet(v,c,d,h){
  const x=V(v),k=skey(v,c,d,h),me=D.queue.find(q=>q.key===k),ahead=hash(k+'q')%3;
  const alts=[];x.th.courts.forEach((_,cc)=>{if(cc!==c&&slotState(v,cc,d,h)==='free')alts.push({v,c:cc,d,h})});[h-1,h+1,h-2,h+2].forEach(h2=>{if(HOURS.includes(h2)&&slotState(v,c,d,h2)==='free')alts.push({v,c,d,h:h2})});
  const others=sortVenues(VENUES.filter(o=>o.id!==v&&o.sport===x.sport&&dist(o)<=Math.max(D.radius,5))).map(o=>({o,c:firstFreeCourt(o.id,d,h)})).filter(z=>z.c>=0);
  openSheet(`<h2>${t('ช่วงเวลานี้เต็มแล้ว','This slot is full')}</h2><div class="sub">${vName(x)} · ${court(x,c)} · ${fmtLong(d)} · ${hh(h)}–${hh(h+1)}</div>
   <div class="qbox"><h3>${ic('queue',18)} MatchQueue</h3><p>${t(`เข้าคิวไว้ ถ้ามีคนยกเลิก ระบบเสนอช่วงนี้ให้คุณก่อน และให้เวลายืนยัน ${D.owner.qmin} นาที`,`Join the queue. If someone cancels, you get first offer with ${D.owner.qmin} min to confirm.`)}</p>
    <p style="margin-top:6px;color:var(--ink)">${me?t(`คุณอยู่คิวที่ <b>${me.pos}</b>`,`You are <b>number ${me.pos}</b> in the queue`):t(`ตอนนี้มี <b>${ahead}</b> คนรออยู่ คุณจะได้คิวที่ <b>${ahead+1}</b>`,`<b>${ahead}</b> waiting now, so you would be <b>number ${ahead+1}</b>`)}</p>
    ${me?`<button class="btn ghost block" data-a="leaveQ" data-k="${k}">${t('ออกจากคิว','Leave queue')}</button>`:`<button class="btn amber block" data-a="joinQ" data-v="${v}" data-c="${c}" data-d="${d}" data-h="${h}">${t('เข้าคิว MatchQueue','Join MatchQueue')}</button>`}</div>
   ${alts.length?`<h3 style="margin-top:16px">${t('เวลาใกล้เคียงที่ยังว่าง','Nearby times still free')}</h3><div class="alts">${alts.slice(0,4).map(a=>`<button class="alt" data-a="pickAlt" data-v="${a.v}" data-c="${a.c}" data-d="${a.d}" data-h="${a.h}"><b>${hh(a.h)}–${hh(a.h+1)}</b>${court(x,a.c)}</button>`).join('')}</div>`:''}
   ${others.length?`<h3 style="margin-top:16px">${t('สนามอื่นใกล้คุณที่ว่างเวลานี้','Other venues nearby free at this time')}</h3><div class="alts">${others.map(z=>`<button class="alt" data-a="pickAlt" data-v="${z.o.id}" data-c="${z.c}" data-d="${d}" data-h="${h}"><b>${vName(z.o)}</b>${fmtKm(z.o)} ${KM()} · ${baht(z.o.price)}/${HR(1)}</button>`).join('')}</div>`:''}`);
}
function offerSheet(q){
  const v=V(q.venue);let left=D.owner.qmin*60;
  openSheet(`<div style="text-align:center"><div style="width:58px;height:58px;border-radius:16px;display:grid;place-items:center;margin:0 auto 10px;background:var(--amber-l);color:var(--amber)">${ic('bell',28)}</div><h2>${t('สนามว่างแล้ว ยืนยันได้เลย','Your slot is free, confirm now')}</h2><div class="sub">${t('MatchQueue เสนอช่วงที่คุณรอไว้ให้คุณก่อน','MatchQueue is offering the slot you waited for to you first')}</div></div>
   <div class="card"><h3>${vName(v)}</h3><div class="mut sm-t">${court(v,q.court)} · ${fmtLong(q.date)} · ${range([q.h])}</div></div>
   <div class="mut" style="text-align:center;font-size:14px">${t('เวลายืนยันที่เหลือ','Time left to confirm')}</div><div class="count" id="ocd">${mmss(left)}</div>
   <button class="btn block" data-a="takeOffer" data-k="${q.key}">${t('จองช่วงนี้','Book this slot')}</button><button class="btn ghost block" data-a="closeSheet">${t('ข้าม ส่งต่อให้คิวถัดไป','Skip, pass it on')}</button>`);
  tick=setInterval(()=>{left--;const e=$('#ocd');if(e)e.textContent=mmss(left);if(left<=0)closeSheet()},1000);
}
function releaseSlot(v,c,d,h){
  const k=skey(v,c,d,h);delete D.walkins[k];D.released[k]=true;
  const q=D.queue.find(x=>x.key===k);
  if(q){D.queue=D.queue.filter(x=>x!==q);D.pendingOffer=q;notify('offer',{v,c,d,h,m:D.owner.qmin},false)}
  save();return q;
}
function rateSheet(){const r=UI.rate,p=D.done.find(x=>x.id===r.id&&x.on===r.on),v=V(p.venue);
  openSheet(`<h2>${t('ให้คะแนนสนาม','Rate the venue')}</h2><div class="sub">${vName(v)} · ${fmtDate(p.on)} ${range(p.hours)}</div>
   <div class="starpick">${[1,2,3,4,5].map(s=>`<button class="${s<=r.stars?'on':''}" data-a="star" data-s="${s}" aria-label="${s} ${t('ดาว','stars')}">★</button>`).join('')}</div>
   <div class="tagpick">${RTAGS[lg()].map((x,i)=>`<button class="chip ${r.tags.includes(i)?'on':''}" data-a="rtag" data-i="${i}">${x}</button>`).join('')}</div>
   <button class="btn block" style="margin-top:16px" data-a="sendRate">${t('ส่งรีวิว','Submit review')}</button>`)}
const A={
  lang:()=>{D.lang=EN()?'th':'en';save();if($('#layer').innerHTML)closeSheet();keep(()=>{})},
  login:d=>{D.auth=d.r;UI.mode=d.r;UI.view='home';UI.oTab='overview';hist=[];render();scrollTo(0,0)},
  logout:()=>{closeSheet();D.auth=null;UI.mode='player';render();scrollTo(0,0)},
  tab:d=>tab(d.t),back:()=>back(),closeSheet:()=>closeSheet(),
  sport:d=>keep(()=>UI.sport=d.s),
  date:d=>keep(()=>UI.date=d.d),
  vdate:d=>keep(()=>{UI.date=d.d;UI.sel=null}),
  vtab:d=>keep(()=>UI.vtab=d.t),
  bkTab:d=>keep(()=>UI.bkTab=d.t),
  openVenue:d=>openVenue(d.v),
  quick:d=>{const c=firstFreeCourt(d.v,UI.date,+d.h);openVenue(d.v,c>=0?{court:c,hours:[+d.h]}:null)},
  focusV:d=>focusVenue(d.v,false),
  radius:d=>{D.radius=+d.r;save();document.querySelectorAll('[data-a=radius]').forEach(b=>b.classList.toggle('on',+b.dataset.r===D.radius));refreshMap(true)},
  msport:d=>{UI.sport=d.s;document.querySelectorAll('[data-a=msport]').forEach(b=>b.classList.toggle('on',b.dataset.s===UI.sport));refreshMap(false)},
  pickArea:d=>{$('#areasug').innerHTML='';const i=$('#areaq');if(i){i.value='';i.blur()}
    if(d.v){const v=V(d.v);setPin(v.lat,v.lng,{kind:'venue',v:d.v},true);setTimeout(()=>focusVenue(d.v,false),700)}
    else{const a=AREAS[+d.i];setPin(a.lat,a.lng,{kind:'area',i:+d.i},true)}},
  geo:()=>{if(!navigator.geolocation)return toast(t('อุปกรณ์นี้ไม่รองรับการระบุตำแหน่ง','This device cannot share its location'));toast(t('กำลังหาตำแหน่งของคุณ','Finding your location'));navigator.geolocation.getCurrentPosition(p=>{setPin(p.coords.latitude,p.coords.longitude,{kind:'here'},true)},()=>toast(t('เข้าถึงตำแหน่งไม่ได้ ลองปักหมุดบนแผนที่แทน','Could not get your location. Drop a pin on the map instead.')),{timeout:8000})},
  cell:d=>{
    const v=UI.venue,c=+d.c,h=+d.h,st=slotState(v,c,UI.date,h);
    if(st==='booked')return queueSheet(v,c,UI.date,h);
    if(st==='mine')return toast(t('ช่วงนี้คุณจองไว้แล้ว','You already booked this slot'));
    if(st==='blocked')return toast(t('สนามปิดปรับปรุงช่วงนี้','Closed for maintenance'));
    if(st==='past')return;
    keep(()=>{const s=UI.sel;
      if(!s||s.court!==c)UI.sel={court:c,hours:[h]};
      else if(s.hours.includes(h)){const mn=Math.min(...s.hours),mx=Math.max(...s.hours);if(h===mn||h===mx){s.hours=s.hours.filter(x=>x!==h);if(!s.hours.length)UI.sel=null}else UI.sel={court:c,hours:[h]}}
      else if(h===Math.min(...s.hours)-1||h===Math.max(...s.hours)+1){if(s.hours.length>=3)toast(t('เลือกต่อกันได้สูงสุด 3 ชม.','Up to 3 hours in a row'));else s.hours.push(h)}
      else UI.sel={court:c,hours:[h]};});
  },
  toCheckout:()=>{if(!UI.sel)return;UI.co={venue:UI.venue,court:UI.sel.court,date:UI.date,hours:[...UI.sel.hours].sort((a,b)=>a-b),method:'promptpay'};go('checkout')},
  method:d=>keep(()=>UI.co.method=d.m),
  toPay:()=>{go('pay');if(UI.co.method==='promptpay'){let left=300;tick=setInterval(()=>{left--;const e=$('#cd');if(!e||left<=0){clearInterval(tick);tick=null;return}e.textContent=mmss(left)},1000)}},
  paid:()=>{if(tick){clearInterval(tick);tick=null}$('#paybody').innerHTML=`<div class="card" style="text-align:center;padding:40px 16px"><div class="spin"></div><h3>${t('กำลังยืนยันการชำระเงิน','Confirming payment')}</h3><p class="mut sm-t">${t('รอสักครู่','One moment')}</p></div>`;setTimeout(confirmBooking,1300)},
  ticket:d=>{const b=D.bookings.find(x=>x.id===d.id),v=V(b.venue);openSheet(`<h2>${t('ตั๋วเข้าสนาม','Entry ticket')}</h2><div class="sub">${t('แสดง QR นี้ที่เคาน์เตอร์สนาม','Show this QR at the venue counter')}</div><div class="card qrwrap"><div class="qr" style="border:0">${qrSvg(b.id+d.on)}</div><b style="letter-spacing:1px">${b.id}</b><div class="mut" style="font-size:15px">${vName(v)} · ${court(v,b.court)}<br>${fmtLong(d.on)} · ${range(b.hours)}</div></div><button class="btn ghost block" data-a="closeSheet">${t('ปิด','Close')}</button>`)},
  cancel:d=>{const b=D.bookings.find(x=>x.id===d.id),v=V(b.venue);if(!canCancel(d.on,b.hours))return toast(t('ยกเลิกไม่ได้ เหลือเวลาไม่ถึง 24 ชม. ก่อนเวลาเล่น','Cannot cancel: play starts in under 24 hrs'));
    openSheet(`<h2>${t('ยกเลิกการจองนี้?','Cancel this booking?')}</h2><div class="sub">${vName(v)} · ${court(v,b.court)} · ${fmtDate(d.on)} ${range(b.hours)}</div>
     <div class="note green">${ic('info',16)}<span>${t('ยกเลิกก่อนเวลาเล่นเกิน 24 ชม. คืนเงินเต็มจำนวนภายใน 3–5 วันทำการ','More than 24 hrs before play: full refund within 3–5 working days.')}</span></div>
     <div class="note">${ic('queue',16)}<span>${t('ช่วงเวลานี้จะถูกเสนอให้คนในคิว MatchQueue ทันที สนามไม่เสียรายได้','The slot goes straight to the MatchQueue, so the venue loses nothing.')}</span></div>
     <button class="btn danger block" data-a="doCancel" data-id="${b.id}" data-on="${d.on}">${t('ยืนยันยกเลิก','Yes, cancel')}</button><button class="btn ghost block" data-a="closeSheet">${t('ไม่ยกเลิก','Keep booking')}</button>`)},
  doCancel:d=>{const b=D.bookings.find(x=>x.id===d.id);if(!b||!canCancel(d.on,b.hours))return closeSheet();const refund=b.paid;
    D.bookings=D.bookings.filter(x=>x!==b);
    b.hours.forEach(h=>D.released[skey(b.venue,b.court,d.on,h)]=true);
    closeSheet();notify('cancelled',{r:refund});render()},
  simDone:()=>{const u=upcoming()[0];if(!u)return;D.done.push({id:u.id,on:u.on,venue:u.venue,court:u.court,hours:u.hours,rated:0});save();toast(t('ย้ายไปที่ "ที่ผ่านมา" แล้ว','Moved to "Past"'));keep(()=>UI.bkTab='past')},
  rate:d=>{UI.rate={id:d.id,on:d.on,stars:5,tags:[]};rateSheet()},
  star:d=>{UI.rate.stars=+d.s;rateSheet()},
  rtag:d=>{const i=+d.i,x=UI.rate.tags;UI.rate.tags=x.includes(i)?x.filter(y=>y!==i):[...x,i];rateSheet()},
  sendRate:()=>{const r=UI.rate,p=D.done.find(x=>x.id===r.id&&x.on===r.on);p.rated=r.stars;D.reviews.unshift({venue:p.venue,stars:r.stars,tags:r.tags,at:Date.now()});closeSheet();notify('review');render()},
  rebook:d=>{const p=D.done.find(x=>x.id===d.id&&x.on===d.on);let nd=p.on;while(nd<=TODAY)nd=addDays(nd,7);if(nd>days7()[6])nd=addDays(TODAY,1);UI.date=nd;const ok=p.hours.every(h=>slotState(p.venue,p.court,nd,h)==='free');openVenue(p.venue,ok?{court:p.court,hours:[...p.hours]}:null);if(!ok)toast(t('ช่วงเดิมไม่ว่าง เลือกเวลาใหม่ได้เลย','Your usual slot is taken, pick another time'))},
  joinQ:d=>{const k=skey(d.v,+d.c,d.d,+d.h);if(!D.queue.find(q=>q.key===k))D.queue.push({key:k,venue:d.v,court:+d.c,date:d.d,h:+d.h,pos:hash(k+'q')%3+1});closeSheet();notify('queued',{v:d.v,d:d.d,h:+d.h});keep(()=>{})},
  leaveQ:d=>{D.queue=D.queue.filter(q=>q.key!==d.k);closeSheet();toast(t('ออกจากคิวแล้ว','Left the queue'));keep(()=>{})},
  pickAlt:d=>{closeSheet();const pre={court:+d.c,hours:[+d.h]};UI.date=d.d;if(d.v===UI.venue&&UI.view==='venue')keep(()=>UI.sel=pre);else openVenue(d.v,pre)},
  simCancel:d=>{const q=D.queue.find(x=>x.key===d.k);releaseSlot(q.venue,q.court,q.date,q.h);D.pendingOffer=null;D.notifs.shift();notify('offer',{v:q.venue,c:q.court,d:q.date,h:q.h,m:D.owner.qmin});render();setTimeout(()=>offerSheet(q),400)},
  takeOffer:d=>{const k=d.k.split('|');closeSheet();UI.co={venue:k[0],court:+k[1],date:k[2],hours:[+k[3]],method:'promptpay'};UI.timer=Date.now();UI.venue=k[0];go('checkout')},
  simRemind:()=>{const u=upcoming()[0];if(!u)return toast(t('ยังไม่มีการจอง ลองจองสนามก่อน','No bookings yet. Book a venue first.'));notify('remind',{v:u.venue,c:u.court,h:u.hours});render()},
  friend:d=>keep(()=>{const f=D.friends;D.friends=f.includes(d.f)?f.filter(x=>x!==d.f):[...f,d.f]}),
  mtCell:d=>{const team=['me',...D.friends];const ok=team.filter(p=>avail(p,d.d,+d.h));const nm=p=>p==='me'?t('คุณ (Nice)','You (Nice)'):FN(p);
    openSheet(`<h2>${fmtLong(d.d)}</h2><div class="sub">${hh(+d.h)}–${hh(+d.h+1)} · ${t(`ว่าง ${ok.length}/${team.length} คน`,`${ok.length}/${team.length} free`)}</div><div class="card"><ul class="list">${team.map(p=>`<li><span>${nm(p)}</span><span style="color:${ok.includes(p)?'var(--brand)':'var(--red)'}">${ok.includes(p)?t('ว่าง','Free'):t('ไม่ว่าง','Busy')}</span></li>`).join('')}</ul></div>
     <button class="btn block" data-a="mtFind" data-d="${d.d}" data-h="${d.h}">${t('หาสนามช่วงนี้','Find a venue for this time')}${ok.length>1?t(` และชวน ${ok.length-1} คนที่ว่าง`,` and invite the ${ok.length-1} who are free`):''}</button>`)},
  mtFind:d=>{const ok=D.friends.filter(p=>avail(p,d.d,+d.h));closeSheet();UI.invite=ok;go('mtvenues',{mt:{d:d.d,h:+d.h}})},
  mtSport:d=>keep(()=>UI.mtSport=d.s),
  mtBook:d=>{UI.date=UI.mt.d;openVenue(d.v,{court:+d.c,hours:[UI.mt.h]})},
  mtQueue:d=>{const x=V(d.v);const c=x.th.courts.findIndex((_,i)=>slotState(d.v,i,UI.mt.d,UI.mt.h)==='booked');queueSheet(d.v,Math.max(c,0),UI.mt.d,UI.mt.h)},
  toOwner:()=>{closeSheet();UI.mode='owner';UI.oTab='overview';render();scrollTo(0,0)},
  toPlayer:()=>{if(D.auth==='owner')D.auth='player';UI.mode='player';hist=[];UI.view='home';render();scrollTo(0,0);if(D.pendingOffer){const q=D.pendingOffer;D.pendingOffer=null;save();setTimeout(()=>offerSheet(q),400)}},
  oTab:d=>{UI.oTab=d.t;render();scrollTo(0,0)},
  oDate:d=>keep(()=>UI.oDate=d.d),
  oCell:d=>{const v=V(OWNER_V),c=+d.c,h=+d.h,dd=UI.oDate,k=skey(OWNER_V,c,dd,h),o=oState(c,dd,h),sub=`${court(v,c)} · ${fmtDate(dd)} · ${hh(h)}–${hh(h+1)}`;
    if(o.s==='free')openSheet(`<h2>${t('ช่วงเวลาว่าง','Free slot')}</h2><div class="sub">${sub}</div><label class="field"><span>${t('ชื่อลูกค้า','Customer name')}</span><input id="wname" placeholder="${t('เช่น คุณเอ ทีมบัญชี','e.g. A, Accounting team')}"></label>
      <div class="two"><button class="btn block" data-a="walkin" data-k="${k}" data-src="phone">${ic('plus',16)} ${t('บันทึกโทรจอง','Log phone booking')}</button><button class="btn ghost block" data-a="walkin" data-k="${k}" data-src="walkin">${ic('plus',16)} ${t('จองหน้าสนาม','Log walk-in')}</button></div>
      <button class="btn dark block" data-a="block" data-k="${k}">${t('ปิดช่วงนี้เพื่อซ่อมบำรุง','Close for maintenance')}</button><p class="mut" style="font-size:13px;margin-top:8px">${t('ช่วงที่บันทึกหรือปิดไว้จะแสดงเป็น "เต็ม" ในแอปผู้เล่นทันที กันจองชน','Logged or closed slots show as "Full" in the player app straight away, so nobody double-books.')}</p>`);
    else if(o.s==='blocked')openSheet(`<h2>${t('ช่วงนี้ปิดอยู่','This slot is closed')}</h2><div class="sub">${sub}</div><button class="btn block" data-a="unblock" data-k="${k}">${t('เปิดให้จองอีกครั้ง','Reopen for booking')}</button>`);
    else openSheet(`<h2>${esc(o.name)}</h2><div class="sub">${sub}</div><div class="card"><div class="row"><span class="mut">${t('ช่องทาง','Channel')}</span><span>${srcL(o.src)}</span></div><div class="row"><span class="mut">${t('เบอร์โทร','Phone')}</span><span>08X-XXX-${String(hash(k)%9000+1000)}</span></div><div class="row"><span class="mut">${t('การชำระเงิน','Payment')}</span><span>${o.paid?t('ชำระผ่านแอปแล้ว ','Paid in app ')+baht(v.price):t('จ่ายที่สนาม','Pays at the venue')}</span></div></div>
      ${o.name==='Nice'?`<p class="mut sm-t">${t('การจองนี้มาจากมุมมองผู้เล่นของคุณ','This booking came from your player view')}</p>`:`<button class="btn ghost block" data-a="oRelease" data-c="${c}" data-d="${dd}" data-h="${h}" style="color:var(--red)">${t('ลูกค้ายกเลิก ส่งต่อให้คิว MatchQueue','Customer cancelled: pass to MatchQueue')}</button>`}`)},
  walkin:d=>{const n=(($('#wname')||{}).value||'').trim()||t('ลูกค้า','Customer');D.walkins[d.k]={name:n,src:d.src};delete D.released[d.k];closeSheet();toast(t('บันทึกการจองแล้ว','Booking logged'));keep(()=>{})},
  block:d=>{D.blocks[d.k]=true;closeSheet();toast(t('ปิดช่วงเวลานี้แล้ว','Slot closed'));keep(()=>{})},
  unblock:d=>{delete D.blocks[d.k];closeSheet();toast(t('เปิดให้จองแล้ว','Slot reopened'));keep(()=>{})},
  oRelease:d=>{const q=releaseSlot(OWNER_V,+d.c,d.d,+d.h);closeSheet();toast(q?t('ส่งข้อเสนอให้ Nice (คิวที่ 1) แล้ว สลับไปมุมมองผู้เล่นเพื่อดู','Offer sent to Nice (position 1). Switch to the player view to see it.'):t('ส่งข้อเสนอให้ลูกค้าคิวที่ 1 แล้ว','Offer sent to the customer in position 1'));keep(()=>{})},
  savePrice:()=>{const p=Math.round(+($('#oprice')||{}).value);if(!p||p<100)return toast(t('ใส่ราคาตั้งแต่ 100 บาทขึ้นไป','Enter a price of at least ฿100'));D.owner.price=p;applyOwner();save();toast(t(`บันทึกราคา ${baht(p)}/ชม. แล้ว แอปผู้เล่นเห็นราคาใหม่ทันที`,`Saved ${baht(p)}/hr. Players see the new price straight away.`));keep(()=>{})},
  qmin:d=>keep(()=>D.owner.qmin=+d.m),
  oToggle:d=>keep(()=>{D.owner[d.k]=!D.owner[d.k];toast(d.k==='boost'?(D.owner.boost?t('เปิด Boost แล้ว สนามขึ้นอันดับแรกในแอปผู้เล่น','Boost on: your venue now shows first'):t('ปิด Boost แล้ว','Boost off')):'')}),
  scope:()=>openSheet(`<h2>${t('ขอบเขตของต้นแบบ','Prototype scope')}</h2><div class="sub">${t('อ้างอิงตาราง MoSCoW ในรายงานหัวข้อ 2.5','Based on the MoSCoW table in report section 2.5')}</div><div class="card"><ul class="scope">
    <li><b style="color:var(--brand)">Must</b><span>${t('ตารางสนามและเวลาว่าง, การจอง, ชำระเงิน, แจ้งเตือน, ตารางจองของเจ้าของสนาม','Venue timetable and free times, booking, payment, notifications, owner schedule')}</span></li>
    <li><b style="color:var(--amber)">Should</b><span>MatchTime, MatchQueue, MatchPitch</span></li>
    <li><b class="mut">${t('เพิ่มเติม','Extra')}</b><span>${t('ค้นหาตามพื้นที่ด้วยหมุดบนแผนที่, รีวิวและจองซ้ำ, Boost และแพ็กเกจสนาม, ภาษาไทย/อังกฤษ','Map pin area search, reviews and rebooking, Boost and venue plans, Thai/English')}</span></li>
    <li><b class="mut">Could</b><span>${t('MatchMake, Tournament, Streak (ยังไม่ทำในต้นแบบ)','MatchMake, Tournament, Streak (not built)')}</span></li>
    <li><b class="mut">Won't</b><span>MatchAnalysis</span></li></ul></div><div class="note">${ic('info',16)}<span>${t('ข้อมูลสนาม ลูกค้า และการชำระเงินเป็นข้อมูลสมมติทั้งหมด ไม่มีการตัดเงินจริง ตำแหน่งสนามบนแผนที่เป็นตำแหน่งสมมติ','All venues, customers and payments are fictional, no money is charged, and map locations are made up.')}</span></div><button class="btn ghost block" data-a="closeSheet">${t('ปิด','Close')}</button>`),
  reset:()=>{closeSheet();const a=D.auth,l=D.lang;D=fresh();D.auth=a;D.lang=l;applyOwner();UI.invite=[];UI.sel=null;UI.sport='all';save();toast(t('รีเซ็ตข้อมูลแล้ว','Sample data reset'));tab('home')},
};
function confirmBooking(){
  const c=UI.co,{per,disc}=coAmounts();
  const id='BM-'+(hash(Date.now()+'')%9000+1000)+String.fromCharCode(65+hash(c.venue)%26);
  const b={id,venue:c.venue,court:c.court,date:c.date,hours:c.hours,paid:per-disc,invite:[...UI.invite],created:Date.now()};
  D.bookings.push(b);D.firstUsed=true;D.queue=D.queue.filter(q=>!(q.venue===c.venue&&q.court===c.court&&q.date===c.date&&c.hours.includes(q.h)));
  c.hours.forEach(h=>delete D.released[skey(c.venue,c.court,c.date,h)]);
  UI.last={...b,elapsed:UI.timer?Math.round((Date.now()-UI.timer)/1000):null};UI.timer=null;UI.co=null;
  hist=[];UI.view='success';render();scrollTo(0,0);
  notify('booked',{v:c.venue,c:c.court,d:c.date,h:c.hours,id});
  if(b.invite.length){D.notifs.unshift({id:Date.now()+1,k:'invite',p:{f:b.invite},at:Date.now(),read:false});save()}
  UI.invite=[];
}
document.addEventListener('click',e=>{const el=e.target.closest('[data-a]');if(!el||el.disabled)return;const f=A[el.dataset.a];if(f){e.preventDefault();e.stopPropagation();f(el.dataset,el)}});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[role=button][data-a]')){e.preventDefault();e.target.click()}
  if(e.key==='Escape'&&$('#layer').innerHTML)closeSheet();
  if(e.key==='Enter'&&e.target.id==='areaq'){const b=document.querySelector('#areasug [data-a=pickArea]');if(b)b.click()}});
document.addEventListener('input',e=>{if(e.target.id==='q'){UI.q=e.target.value;$('#vlist').innerHTML=venueList()}if(e.target.id==='areaq')areaSuggest(e.target.value)});
let lastWide=matchMedia('(min-width:1100px)').matches;
addEventListener('resize',()=>{const w=matchMedia('(min-width:1100px)').matches;if(w!==lastWide&&UI.view==='map'&&UI.mode==='player'){lastWide=w;render()}else lastWide=w;if(MAP)MAP.invalidateSize()});
render();
