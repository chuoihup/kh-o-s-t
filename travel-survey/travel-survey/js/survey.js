// ===== Cấu hình 15 câu hỏi, chia 5 nhóm =====
// type: radio (chọn 1) | check (chọn nhiều) | select | cards (thẻ ảnh) | text (tự do)
const STEPS = [
 {t:'Thông tin cá nhân',qs:[
  {n:'age',q:'Bạn thuộc nhóm tuổi nào?',type:'select',o:['Dưới 18','18–25','26–35','36–50','Trên 50']},
  {n:'companion',q:'Bạn thường đi du lịch với ai?',type:'radio',o:['Một mình','Bạn bè','Gia đình','Người yêu','Đồng nghiệp']},
  {n:'freq',q:'Bạn đi du lịch bao nhiêu lần mỗi năm?',type:'select',o:['1 lần','2–3 lần','4–6 lần','Trên 6 lần']}]},
 {t:'Địa điểm du lịch',qs:[
  {n:'type',q:'Bạn thích loại hình du lịch nào?',type:'radio',o:['Biển','Núi','Thành phố','Sinh thái']},
  {n:'places',q:'Bạn muốn du lịch ở địa điểm nào? (chọn nhiều)',type:'cards'},
  {n:'scope',q:'Bạn thích du lịch trong nước hay nước ngoài?',type:'radio',o:['Trong nước','Nước ngoài','Cả hai']}]},
 {t:'Chi phí du lịch',qs:[
  {n:'budget',q:'Ngân sách cho một chuyến du lịch của bạn?',type:'radio',o:['Dưới 3 triệu','3–5 triệu','5–10 triệu','Trên 10 triệu']},
  {n:'hotel',q:'Bạn sẵn sàng chi bao nhiêu cho khách sạn mỗi đêm?',type:'select',o:['Dưới 300k','300k–700k','700k–1,5 triệu','Trên 1,5 triệu']},
  {n:'priority',q:'Bạn ưu tiên điều gì khi chọn dịch vụ?',type:'radio',o:['Giá rẻ','Chất lượng','Tiện nghi']}]},
 {t:'Phương tiện và lưu trú',qs:[
  {n:'transport',q:'Bạn thường dùng phương tiện nào? (chọn nhiều)',type:'check',o:['Máy bay','Xe khách','Ô tô','Xe máy','Tàu hỏa']},
  {n:'stay',q:'Bạn thích loại hình lưu trú nào?',type:'radio',o:['Khách sạn','Homestay','Resort','Camping']},
  {n:'booking',q:'Bạn thường đặt vé và phòng bằng cách nào?',type:'select',o:['App/Website OTA','Website khách sạn','Qua đại lý','Gọi điện/nhắn tin','Đặt trực tiếp']}]},
 {t:'Trải nghiệm và sở thích',qs:[
  {n:'activities',q:'Bạn thích hoạt động nào khi đi du lịch? (chọn nhiều)',type:'check',o:['Tắm biển','Leo núi','Ẩm thực','Tham quan di tích','Mua sắm','Chụp ảnh']},
  {n:'reason',q:'Điều gì khiến bạn chọn một địa điểm du lịch?',type:'text',opt:true},
  {n:'plan',q:'Bạn có dự định đi du lịch trong 6 tháng tới không?',type:'radio',o:['Có','Chưa chắc','Không']}]}
];
let cur = 0, num = 0;

// Dựng form từ cấu hình
function build(){
  num = 0;
  const html = STEPS.map((s,i)=>`<div class="step" data-i="${i}" style="display:none"><h5 class="text-success mb-3">Nhóm ${i+1}: ${s.t}</h5>`+
   s.qs.map(x=>{ num++; return `<div class="q" data-n="${x.n}" data-type="${x.type}" data-opt="${x.opt?1:0}"><label class="main fw-semibold mb-2">${num}. ${x.q}${x.opt?'':' <span class="text-danger">*</span>'}</label>`+field(x)+`</div>`; }).join('')+`</div>`).join('');
  $('#steps').html(html);
}
function field(x){
  if(x.type==='select') return `<select class="form-select" name="${x.n}"><option value="">-- Chọn --</option>${x.o.map(o=>`<option>${o}</option>`).join('')}</select>`;
  if(x.type==='text') return `<textarea class="form-control" name="${x.n}" rows="3" placeholder="Nhập câu trả lời của bạn..."></textarea>`;
  if(x.type==='cards') return `<div class="row g-3">${DESTS.map(d=>destCard(d,true)).join('')}</div>`;
  const t = x.type==='radio'?'radio':'checkbox';
  return x.o.map(o=>`<div class="form-check"><input class="form-check-input" type="${t}" name="${x.n}" value="${o}"><label class="form-check-label">${o}</label></div>`).join('');
}
// Lấy giá trị 1 câu hỏi
function val($q){
  const type=$q.data('type');
  if(type==='select') return $q.find('select').val();
  if(type==='text') return $.trim($q.find('textarea').val());
  if(type==='radio') return $q.find('input:checked').val()||'';
  return $q.find('input:checked').map(function(){return this.value}).get(); // check, cards
}
// Kiểm tra các câu bắt buộc của bước hiện tại
function validate(){
  let ok = true;
  $('.step').eq(cur).find('.q').each(function(){
    const $q=$(this), v=val($q), empty = !v || v.length===0;
    const bad = empty && !$q.data('opt');
    $q.toggleClass('invalid',bad); if(bad) ok=false;
  });
  $('#alertBox').toggleClass('d-none',ok).text('Vui lòng trả lời đầy đủ các câu hỏi có dấu * trước khi tiếp tục.');
  return ok;
}
function show(i){
  cur=i; $('.step').hide().eq(i).fadeIn(200);
  $('#bar').css('width',(i/STEPS.length*100)+'%').text(Math.round(i/STEPS.length*100)+'%');
  $('#stepLabel').text(`Bước ${i+1}/${STEPS.length}`);
  $('#prev').toggle(i>0); $('#next').text(i===STEPS.length-1?'Gửi khảo sát ✓':'Tiếp tục →');
  window.scrollTo({top:0,behavior:'smooth'});
}
// Thu thập toàn bộ câu trả lời & lưu LocalStorage
function submit(){
  const data={time:new Date().toISOString()};
  $('.q').each(function(){ data[$(this).data('n')]=val($(this)); });
  const all=getData(); all.push(data); localStorage.setItem(KEY,JSON.stringify(all));
  $('#bar').css('width','100%').text('100%');
  $('#surveyForm').fadeOut(300,()=>{ $('#thanks').removeClass('d-none').hide().fadeIn(500); });
}
$(function(){
  build(); show(0);
  $('#next').on('click',function(){ if(!validate()) return;
    if(cur<STEPS.length-1) show(cur+1); else submit(); });
  $('#prev').on('click',()=>{ $('#alertBox').addClass('d-none'); show(cur-1); });
  // Bỏ cảnh báo khi người dùng chọn lại
  $('#steps').on('change input','input,select,textarea',function(){ $(this).closest('.q').removeClass('invalid'); });
  // Click vào thẻ ảnh = chọn / bỏ chọn
  $('#steps').on('click','.dest-card',function(e){
    const $c=$(this).find('input');
    if(!$(e.target).is('input')) $c.prop('checked',!$c.prop('checked')).trigger('change');
    $(this).toggleClass('picked',$c.prop('checked'));
  });
  $('#again').on('click',()=>location.reload());
});
