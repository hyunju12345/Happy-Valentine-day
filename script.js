const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const arena = document.getElementById("arena");

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function moveNoButtonRandomly() {
  const arenaRect = arena.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const padding = 6;
  const maxX = arenaRect.width - btnRect.width - padding;
  const maxY = arenaRect.height - btnRect.height - padding;

  const x = Math.random() * maxX + padding;
  const y = Math.random() * maxY + padding;

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  noBtn.style.transform = "none";
}

function fleeFromPointer(clientX, clientY) {
  const btnRect = noBtn.getBoundingClientRect();
  const arenaRect = arena.getBoundingClientRect();

  // 버튼 중심
  const cx = btnRect.left + btnRect.width / 2;
  const cy = btnRect.top + btnRect.height / 2;

  const dx = cx - clientX;
  const dy = cy - clientY;

  const dist = Math.max(1, Math.hypot(dx, dy));
  const strength = clamp(240 / dist, 0.9, 2.2);

  const ux = dx / dist;
  const uy = dy / dist;

  const curLeft = parseFloat(noBtn.style.left || 0);
  const curTop  = parseFloat(noBtn.style.top  || 0);

  let nx = curLeft + ux * 70 * strength;
  let ny = curTop  + uy * 50 * strength;

  // arena 내부로 제한
  const maxX = arenaRect.width - btnRect.width - 6;
  const maxY = arenaRect.height - btnRect.height - 6;

  nx = clamp(nx, 6, maxX);
  ny = clamp(ny, 6, maxY);

  noBtn.style.left = `${nx}px`;
  noBtn.style.top  = `${ny}px`;
  noBtn.style.transform = "none";
}

// 레이아웃 잡힌 뒤 초기 위치 랜덤
requestAnimationFrame(() => moveNoButtonRandomly());

// hover하면 순간이동
noBtn.addEventListener("mouseenter", moveNoButtonRandomly);

// 마우스가 가까워지면 도망(더 악랄)
arena.addEventListener("mousemove", (e) => {
  const btnRect = noBtn.getBoundingClientRect();
  const near =
    e.clientX > btnRect.left - 40 &&
    e.clientX < btnRect.right + 40 &&
    e.clientY > btnRect.top - 30 &&
    e.clientY < btnRect.bottom + 30;

  if (near) fleeFromPointer(e.clientX, e.clientY);
});

// 모바일 터치도 도망
arena.addEventListener("touchstart", (e) => {
  const t = e.touches[0];
  fleeFromPointer(t.clientX, t.clientY);
}, { passive: true });

arena.addEventListener("touchmove", (e) => {
  const t = e.touches[0];
  fleeFromPointer(t.clientX, t.clientY);
}, { passive: true });

// Yes 클릭하면 결과 페이지로 이동
yesBtn.addEventListener("click", () => {
  // 필요하면 이름 같은 거 URL로 넘겨도 됨: valentine.html?from=...
  window.location.href = "valentine.html";
});
