// ===== Dữ liệu dùng chung =====
// Ảnh lấy từ Unsplash; có thể thay bằng ảnh trong assets/images/ (đổi đường dẫn "img").
const U = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=70`;
const DESTS = [
  {id:'Đà Lạt',desc:'Thành phố ngàn hoa, khí hậu mát mẻ quanh năm.',img:U('photo-1578662996442-48f60103fc96')},
  {id:'Đà Nẵng',desc:'Biển đẹp, cầu Vàng và ẩm thực hấp dẫn.',img:U('photo-1559592413-7cec4d0cae2b')},
  {id:'Phú Quốc',desc:'Đảo ngọc với bãi cát trắng và hoàng hôn tuyệt đẹp.',img:U('photo-1583417319070-4a69db38a482')},
  {id:'Vịnh Hạ Long',desc:'Di sản thiên nhiên với hàng nghìn đảo đá vôi.',img:U('photo-1528127269322-539801943592')},
  {id:'Sa Pa',desc:'Ruộng bậc thang và núi non hùng vĩ vùng Tây Bắc.',img:U('photo-1509030450996-dd1a26dda07a')},
  {id:'Hội An',desc:'Phố cổ đèn lồng thơ mộng bên sông Hoài.',img:U('photo-1558862107-d49ef2a04d72')}
];
const KEY = 'travelSurveyResponses';
function getData(){ try{ return JSON.parse(localStorage.getItem(KEY))||[]; }catch(e){ return []; } }
// Thẻ địa điểm; withCheck=true thì có checkbox chọn
function destCard(d, withCheck){
  return `<div class="col-6 col-md-4"><div class="card dest-card h-100 shadow-sm">
  <img src="${d.img}" alt="${d.id}" onerror="this.removeAttribute('src')">
  <div class="card-body"><h6 class="card-title text-primary">${d.id}</h6><p class="small mb-2">${d.desc}</p>
  ${withCheck?`<div class="form-check"><input class="form-check-input" type="checkbox" name="places" value="${d.id}"><label class="form-check-label">Chọn</label></div>`:''}</div></div></div>`;
}
$(function(){
  // Đánh dấu menu đang mở
  const page = location.pathname.split('/').pop() || 'index.html';
  $('.nav-link').each(function(){ if($(this).attr('href')===page) $(this).addClass('active'); });
  $('.reveal').hide().fadeIn(900); // hiệu ứng xuất hiện
});
