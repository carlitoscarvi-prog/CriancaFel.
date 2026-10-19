const demoEvents = [
 {id:"e1",title:"Pequenos Exploradores da Natureza",category:"Natureza",date:futureDate(3),time:"10:00",location:"Ponta Delgada",age:"3–5 anos",ageGroup:"3-5",description:"Uma manhã de descobertas ao ar livre, com jogos sensoriais e pequenas missões para explorar a natureza.",capacity:16,booked:5,organizer:"Equipa CriançaFel",status:"approved",emoji:"🌿",color:"mint"},
 {id:"e2",title:"Música para Mãos Pequenas",category:"Música",date:futureDate(5),time:"10:30",location:"Lagoa",age:"0–2 anos",ageGroup:"0-2",description:"Sons, ritmos, canções e instrumentos simples para partilhar com o bebé num ambiente tranquilo.",capacity:12,booked:4,organizer:"Som em Família",status:"approved",emoji:"🎵",color:"pink"},
 {id:"e3",title:"Oficina das Cores e Texturas",category:"Oficina criativa",date:futureDate(7),time:"14:00",location:"Ribeira Grande",age:"3–5 anos",ageGroup:"3-5",description:"Uma experiência criativa para experimentar cores, formas e materiais através da brincadeira.",capacity:14,booked:8,organizer:"Ateliê Brincar",status:"approved",emoji:"🎨",color:"yellow"},
 {id:"e4",title:"Histórias com Movimento",category:"Histórias",date:futureDate(9),time:"11:00",location:"Ponta Delgada",age:"3–9 anos",ageGroup:"6-9",description:"Uma história ganha vida com gestos, imaginação, dança e desafios divertidos para toda a família.",capacity:20,booked:7,organizer:"Contos ao Colo",status:"approved",emoji:"📚",color:"blue"},
 {id:"e5",title:"Mini Atletas em Ação",category:"Movimento",date:futureDate(12),time:"10:00",location:"Vila Franca do Campo",age:"6–9 anos",ageGroup:"6-9",description:"Jogos cooperativos e percursos de movimento onde o mais importante é participar e divertir-se.",capacity:18,booked:18,organizer:"Movimento Miúdo",status:"approved",emoji:"⚽",color:"lilac"},
 {id:"e6",title:"Manhã de Brincadeira Sensorial",category:"Oficina criativa",date:futureDate(14),time:"09:30",location:"Lagoa",age:"0–2 anos",ageGroup:"0-2",description:"Uma sessão calma de exploração sensorial pensada para bebés acompanhados por um adulto.",capacity:10,booked:2,organizer:"Mãos Curiosas",status:"approved",emoji:"🫧",color:"peach"}
];
let events = demoEvents.map(e=>({...e}));
let bookings = [];
let selectedEventId = null;
let toastTimer;
const $ = s => document.querySelector(s);
const grid = $("#eventGrid");
function futureDate(days){const d=new Date();d.setDate(d.getDate()+days);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;}
function formatDate(s){if(!s)return "Data a definir";return new Intl.DateTimeFormat("pt-PT",{day:"numeric",month:"long",year:"numeric"}).format(new Date(`${s}T12:00:00`));}
function escapeHTML(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function showToast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2800);}
function available(e){return Math.max(0,Number(e.capacity)-Number(e.booked));}
function renderEvents(){
 const search=$("#searchInput").value.trim().toLocaleLowerCase("pt-PT"),loc=$("#locationFilter").value,age=$("#ageFilter").value;
 const visible=events.filter(e=>e.status==="approved"&&(!search||`${e.title} ${e.description} ${e.category} ${e.location}`.toLocaleLowerCase("pt-PT").includes(search))&&(!loc||e.location===loc)&&(!age||e.ageGroup===age||e.age.includes(age.replace("+",""))));
 $("#eventCount").textContent=`${visible.length} ${visible.length===1?"evento":"eventos"}`;
 grid.innerHTML=visible.map(e=>`<article class="event-card">
 <div class="event-art ${escapeHTML(e.color||"peach")}"><span>${escapeHTML(e.emoji||"🎈")}</span></div>
 <div class="event-body"><span class="category">${escapeHTML(e.category)}</span><h3>${escapeHTML(e.title)}</h3>
 <p class="event-description">${escapeHTML(e.description)}</p>
 <div class="event-meta"><span>📅 ${formatDate(e.date)} · ${escapeHTML(e.time)}</span><span>📍 ${escapeHTML(e.location)}</span><span>🧒 ${escapeHTML(e.age)}</span></div>
 <div class="event-bottom"><span class="availability"><strong>${available(e)} ${available(e)===1?"lugar disponível":"lugares disponíveis"}</strong>Reserva gratuita</span><button class="button button-primary reserve-button" data-reserve="${escapeHTML(e.id)}" ${available(e)<1?"disabled":""}>${available(e)<1?"Esgotado":"Reservar"}</button></div></div></article>`).join("");
 $("#emptyState").classList.toggle("hidden",visible.length>0);
 document.querySelectorAll("[data-reserve]").forEach(b=>b.addEventListener("click",()=>openBooking(b.dataset.reserve)));
 const locations=[...new Set(events.filter(e=>e.status==="approved").map(e=>e.location))].sort((a,b)=>a.localeCompare(b,"pt-PT"));
 const sel=$("#locationFilter"),old=sel.value;
 sel.innerHTML='<option value="">Todas as localidades</option>'+locations.map(l=>`<option value="${escapeHTML(l)}">${escapeHTML(l)}</option>`).join("");
 sel.value=locations.includes(old)?old:"";
}
function openBooking(id){
 const e=events.find(x=>x.id===id);if(!e||available(e)<1)return;
 selectedEventId=id;$("#bookingForm").reset();$("#bookingMessage").classList.add("hidden");
 $("#bookingTitle").textContent=e.title;$("#bookingDetails").textContent=`${formatDate(e.date)} às ${e.time} · ${e.location} · ${available(e)} lugares disponíveis`;
 const seats=$("#seatCount");[...seats.options].forEach(o=>o.disabled=Number(o.value)>available(e));seats.value="1";
 $("#bookingDialog").showModal();
}
function renderAdmin(){
 const pending=events.filter(e=>e.status==="pending");
 $("#pendingList").innerHTML=pending.length?pending.map(e=>`<div class="pending-item"><div><strong>${escapeHTML(e.title)}</strong><span class="muted">${formatDate(e.date)} · ${escapeHTML(e.location)} · ${escapeHTML(e.organizer)}</span><div><span class="status">Pendente</span></div></div><div class="pending-actions"><button class="small-button approve" data-approve="${escapeHTML(e.id)}">Aprovar</button><button class="small-button" data-reject="${escapeHTML(e.id)}">Rejeitar</button></div></div>`).join(""):'<p class="muted">Não há eventos pendentes.</p>';
 $("#bookingList").innerHTML=bookings.length?bookings.slice().reverse().map(b=>`<div class="booking-item"><div><strong>${escapeHTML(b.eventTitle)}</strong><span class="muted">${escapeHTML(b.adult)} · ${escapeHTML(b.email)} · ${b.seats} lugar(es)</span></div><span class="status approved">${escapeHTML(b.code)}</span></div>`).join(""):'<p class="muted">Ainda não existem reservas de teste.</p>';
 document.querySelectorAll("[data-approve]").forEach(b=>b.onclick=()=>{const e=events.find(x=>x.id===b.dataset.approve);if(e){e.status="approved";renderAll();showToast("Evento aprovado nesta demonstração.");}});
 document.querySelectorAll("[data-reject]").forEach(b=>b.onclick=()=>{events=events.filter(x=>x.id!==b.dataset.reject);renderAll();showToast("Evento removido da demonstração.");});
}
function renderAll(){renderEvents();renderAdmin();}
$("#searchInput").addEventListener("input",renderEvents);
$("#locationFilter").addEventListener("change",renderEvents);
$("#ageFilter").addEventListener("change",renderEvents);
$("#adminToggle").addEventListener("click",()=>{$("#adminPanel").classList.remove("hidden");$("#adminPanel").scrollIntoView({behavior:"smooth"});});
$("#closeAdmin").addEventListener("click",()=>$("#adminPanel").classList.add("hidden"));
$("#closeBooking").addEventListener("click",()=>$("#bookingDialog").close());
$("#bookingForm").addEventListener("submit",e=>{
 e.preventDefault();const event=events.find(x=>x.id===selectedEventId);if(!event)return;
 const fd=new FormData(e.currentTarget),seats=Number(fd.get("seats"));
 if(seats<1||seats>available(event)){showToast("Já não há lugares suficientes. Atualiza a página.");return;}
 const booking={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),code:"CF-"+Math.random().toString(36).slice(2,7).toUpperCase(),eventId:event.id,eventTitle:event.title,adult:fd.get("adult").trim(),email:fd.get("email").trim(),seats};
 event.booked+=seats;bookings.push(booking);renderAll();
 $("#bookingMessage").textContent=`Reserva de teste registada! Código: ${booking.code}. Não foi enviado qualquer email.`;
 $("#bookingMessage").classList.remove("hidden");
 e.currentTarget.querySelector('button[type="submit"]').textContent="Reserva registada";
 showToast("Reserva de teste registada.");
});
$("#eventForm").addEventListener("submit",e=>{
 e.preventDefault();
 const form=e.currentTarget;
 const submitButton=form.querySelector('button[type="submit"]');
 const fd=new FormData(form);
 try {
  const title=String(fd.get("title")||"").trim();
  const date=String(fd.get("date")||"");
  const time=String(fd.get("time")||"");
  const location=String(fd.get("location")||"").trim();
  const age=String(fd.get("age")||"").trim();
  const description=String(fd.get("description")||"").trim();
  const organizer=String(fd.get("organizer")||"").trim();
  const capacity=Number(fd.get("capacity"));
  if(!title||!date||!time||!location||!age||!description||!organizer||!Number.isFinite(capacity)||capacity<1){
   showToast("Confirma os campos obrigatórios e o número de lugares.");
   return;
  }
  const newEvent={id:"new-"+Date.now()+"-"+Math.random().toString(36).slice(2,7),title,category:String(fd.get("category")||"Outro"),date,time,location,age,ageGroup:"",description,capacity,booked:0,organizer,status:"pending",emoji:"🎈",color:["peach","yellow","mint","blue","pink"][events.length%5]};
  events.push(newEvent);
  renderAll();
  form.reset();
  const pendingItem=[...document.querySelectorAll("#pendingList .pending-item")].find(item=>item.textContent.includes(title));
  if(pendingItem) pendingItem.scrollIntoView({behavior:"smooth",block:"center"});
  showToast("Evento adicionado. Está pendente de aprovação.");
 } catch(error) {
  console.error("Erro ao adicionar evento CriançaFel:",error);
  showToast("Não foi possível adicionar o evento. Atualiza a página e tenta novamente.");
 }
});
if("serviceWorker" in navigator && location.protocol!=="file:"){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));}
renderAll();
