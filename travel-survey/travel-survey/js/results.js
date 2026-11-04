// ===== Trang thống kê =====
let SAMPLE = false, charts = [];
const COLORS=['#0d6efd','#198754','#20c997','#6ea8fe','#a3cfbb','#0dcaf0'];
// Dữ liệu mẫu riêng (chỉ để kiểm tra giao diện, KHÔNG lưu vào LocalStorage)
function makeSample(){
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const many=a=>a.filter(()=>Math.random()>.5).concat(pick(a)).filter((v,i,s)=>s.indexOf(v)===i);
  return Array.from({length:40},()=>({
    places:many(DESTS.map(d=>d.id)),
    budget:pick(['Dưới 3 triệu','3–5 triệu','5–10 triệu','Trên 10 triệu']),
    transport:many(['Máy bay','Xe khách','Ô tô','Xe máy','Tàu hỏa']),
    stay:pick(['Khách sạn','Homestay','Resort','Camping'])}));
}
// Đếm số lần xuất hiện của từng đáp án (hỗ trợ cả mảng và chuỗi)
function count(data,key){
  const m={}; data.forEach(r=>[].concat(r[key]||[]).forEach(v=>m[v]=(m[v]||0)+1)); return m;
}
function draw(id,type,key,data){
  const c=count(data,key);
  charts.push(new Chart($('#'+id)[0],{type:type,data:{labels:Object.keys(c),datasets:[{data:Object.values(c),backgroundColor:COLORS}]},
    options:{plugins:{legend:{display:type!=='bar'}},scales:type==='bar'?{y:{beginAtZero:true,ticks:{precision:0}}}:{}}}));
}
function render(){
  charts.forEach(c=>c.destroy()); charts=[];
  const data = SAMPLE ? makeSample() : getData();
  $('#total').text(data.length);
  $('#empty').toggleClass('d-none',data.length>0);
  $('#mode').text(SAMPLE?'⚠ Đang xem DỮ LIỆU MẪU (ngẫu nhiên, chỉ để thử giao diện).':'Đang xem dữ liệu thực từ các lượt khảo sát lưu trên trình duyệt này.');
  $('#btnReal').toggleClass('btn-primary',!SAMPLE).toggleClass('btn-outline-primary',SAMPLE);
  if(!data.length) return;
  draw('c1','bar','places',data); draw('c2','doughnut','budget',data);
  draw('c3','bar','transport',data); draw('c4','pie','stay',data);
}
$(function(){
  $('#btnReal').on('click',()=>{SAMPLE=false;render();});
  $('#btnSample').on('click',()=>{SAMPLE=true;render();});
  $('#btnClear').on('click',()=>{ if(confirm('Xóa toàn bộ dữ liệu khảo sát thực?')){localStorage.removeItem(KEY);SAMPLE=false;render();} });
  render();
});
