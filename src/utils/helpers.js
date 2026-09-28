export const CATEGORY_IMAGES = {
  'Computers & Laptops': 'https://th.bing.com/th/id/OIP.NhCHxzgloG-ZRd4EyVbfOAHaE8?w=273&h=182&c=7&r=0&o=7&pid=1.7&rm=3',
  'Mobile & Tablets': 'https://image01.realme.net/general/20250922/1758515178252f9cbb0ca5d3f4b09b1764bc83483f879.png?width=1080&height=1080&size=265016',
  'Audio & Wearables': 'https://th.bing.com/th/id/OIP.t8cjDKOGDWdwAEbpu8FlJgHaHa?w=167&h=180&c=7&r=0&o=7&pid=1.7&rm=3',
  'Gaming & Entertainment': 'https://th.bing.com/th/id/OIP.vWP2DBBFbQ4Z183xwqObhQHaFj?w=248&h=186&c=7&r=0&o=7&pid=1.7&rm=3',
};

export const CATEGORIES = [
 {name:'Computers & Laptops', subcategories:['Laptops','Desktop Computers','Monitors','Keyboards','Mice','Webcams','Printers','SSDs','Hard Drives','RAM','Computer Accessories','Networking Devices']},
 {name:'Mobile & Tablets', subcategories:['Smartphones','Tablets','Smart Accessories','Chargers','Power Banks','Mobile Cases','Screen Protectors','Cables','Mobile Accessories']},
 {name:'Audio & Wearables', subcategories:['Headphones','Earbuds','Speakers','Soundbars','Smart Watches','Fitness Bands','Microphones','Audio Accessories']},
 {name:'Gaming & Entertainment', subcategories:['Gaming Laptops','Gaming Consoles','Gaming Controllers','Gaming Headsets','Gaming Keyboards','Gaming Mice','Gaming Monitors','Cameras','TVs','Streaming Devices','Gaming Accessories']}
];
export const SORTS=[['newest','Newest'],['popular','Popular'],['rating','Rating'],['price_asc','Price: Low to High'],['price_desc','Price: High to Low']];
export const ORDER_STATUSES=['Pending','Confirmed','Processing','Shipped','Out for Delivery','Delivered','Cancelled'];
export const money=(v)=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(Number(v||0));
export const date=(v)=>v?new Date(v).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'}):'—';
export const discount=(p)=>p?.originalPrice&&p.originalPrice>p.price?Math.round((1-p.price/p.originalPrice)*100):Number(p?.discount||0);
export const imageOf=(p)=>p?.images?.[0]||'';
export const errorMessage=(e,fallback='Something went wrong')=>e?.response?.data?.message||e?.message||fallback;
export const passwordChecks=(p='')=>({length:p.length>=8,upper:/[A-Z]/.test(p),lower:/[a-z]/.test(p),number:/\d/.test(p),special:/[^A-Za-z0-9]/.test(p)});
export const strongPassword=(p='')=>Object.values(passwordChecks(p)).every(Boolean);
export const passwordMissingRequirements=(p='')=>{
 const checks=passwordChecks(p);
 const labels={length:'at least 8 characters',upper:'an uppercase letter',lower:'a lowercase letter',number:'a number',special:'a special character'};
 return Object.entries(checks).filter(([,ok])=>!ok).map(([key])=>labels[key]);
};

export const SPECIFICATION_MATRIX = {
  'Computers & Laptops': ['Processor','RAM','Storage','Display','GPU','OS','Battery','Weight','Warranty'],
  'Mobile & Tablets': ['Processor','RAM','Storage','Screen Size','Refresh Rate','Cameras','Battery','Charging','Warranty'],
  'Audio & Wearables': ['Driver Size','Connectivity','Bluetooth Version','ANC','Battery Life','Water Resistance','Warranty'],
  'Gaming & Entertainment': ['Platform','Resolution','Refresh Rate','Storage','Ports','Features','Warranty'],
};

export const formatSpecLabel = (key='') => key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export const productSpecs = (product) => {
  const raw = product?.specifications || {};
  const entries = Object.entries(raw).filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '');
  const preferred = SPECIFICATION_MATRIX[product?.majorCategory] || [];
  const rank = (key) => {
    const label = formatSpecLabel(key).toLowerCase();
    const index = preferred.findIndex((item) => item.toLowerCase() === label);
    return index === -1 ? preferred.length + 1 : index;
  };
  return entries.sort(([a], [b]) => rank(a) - rank(b));
};
