const container = document.getElementById('interaction-container');
const bgImage = document.getElementById('bg-image');

// src 폴더 내의 나머지 심볼 이미지들 경로
const symbolImages = [
  '/src/인터렉션-02.png',
  '/src/인터렉션-03.png',
  '/src/인터렉션-04.png',
  '/src/인터렉션-05.png',
  '/src/인터렉션-06.png',
  '/src/인터렉션-07.png'
];

const randomRange = (min, max) => Math.random() * (max - min) + min;

// 배경 이미지의 실제 화면상 렌더링 크기를 계산
let renderW = window.innerWidth;
let renderH = window.innerHeight;

function updateContainerBounds() {
  if (!bgImage || bgImage.naturalWidth === 0) return;
  const nw = bgImage.naturalWidth;
  const nh = bgImage.naturalHeight;
  const cw = window.innerWidth;
  const ch = window.innerHeight;

  const ratio = Math.min(cw / nw, ch / nh);
  // 인터랙션 컨테이너의 크기를 이미지 영역 대비 80%로 축소
  const containerScale = 0.93;
  renderW = nw * ratio * containerScale;
  renderH = nh * ratio * containerScale;
  const renderX = (cw - renderW) / 2;
  const renderY = (ch - renderH) / 2;

  // 컨테이너 크기를 정확히 사진이 있는 영역으로만 제한
  container.style.width = `${renderW}px`;
  container.style.height = `${renderH}px`;
  container.style.left = `${renderX}px`;
  container.style.top = `${renderY}px`;
}

window.addEventListener('resize', updateContainerBounds);
if (bgImage) {
  if (bgImage.complete) updateContainerBounds();
  else bgImage.addEventListener('load', updateContainerBounds);
}

function spawnSymbol(baseAngle) {
  const imgEl = document.createElement('img');
  imgEl.className = 'symbol-instance';

  // 1. 랜덤 이미지 선택
  const imgSrc = symbolImages[Math.floor(Math.random() * symbolImages.length)];
  imgEl.src = imgSrc;

  // 2. 크기 설정 (크기 차이가 더 심하도록 범위 확장: 40px ~ 700px)
  const size = randomRange(40, 700);
  imgEl.style.width = `${size}px`;
  imgEl.style.height = `${size}px`;

  // 3. 방사형(원형 궤도) 배치 로직
  const centerX = renderW / 2;
  const centerY = renderH / 2;

  // 중앙 로고 피하는 반경 (120px)
  const minRadius = 120;
  // 퍼지는 최대 반경 (이전 / 1.5에서 범위를 좁힘)
  const maxRadius = Math.max(renderW, renderH) / 1.5;

  // baseAngle(기준 각도)이 전달되면 해당 방향 주변에 모여서 생성
  const angle = baseAngle !== undefined
    ? baseAngle + randomRange(-Math.PI / 6, Math.PI / 6)
    : randomRange(0, Math.PI * 2);

  const distance = minRadius + (maxRadius - minRadius) * Math.sqrt(Math.random());

  const x = centerX + Math.cos(angle) * distance - size / 2;
  const y = centerY + Math.sin(angle) * distance - size / 2;

  imgEl.style.left = `${x}px`;
  imgEl.style.top = `${y}px`;

  // 4. 크기 초기화 (회전 제거)
  const initialScale = randomRange(0.6, 0.8);
  imgEl.style.transform = `scale(${initialScale})`;

  container.appendChild(imgEl);

  // 머무는 시간도 조금 더 늘려서 화면이 풍성해지도록 (4초 ~ 8초)
  const duration = randomRange(4000, 8000);

  imgEl.onload = () => {
    void imgEl.offsetWidth;

    const targetScale = randomRange(0.9, 1.1);

    imgEl.style.opacity = '1';
    imgEl.style.transform = `scale(${targetScale})`;

    setTimeout(() => {
      imgEl.style.opacity = '0';
      imgEl.style.transform = `scale(${initialScale})`;

      setTimeout(() => {
        if (imgEl.parentNode) imgEl.remove();
      }, 600);
    }, duration);
  };

  imgEl.onerror = () => {
    imgEl.remove();
  };
}

function symbolSpawner() {
  // 한쪽 구역에서 무리지어 발생
  const baseAngle = randomRange(0, Math.PI * 2);

  // 한 번에 피어나는 개수를 대폭 증가 (6개 ~ 15개)
  const count = Math.floor(randomRange(6, 10));
  for (let i = 0; i < count; i++) {
    // 개수가 많아졌으므로 시간차를 살짝 줄임 (0~0.2초)
    setTimeout(() => {
      spawnSymbol(baseAngle);
    }, randomRange(0, 200));
  }

  // 다음 무리가 나타날 때까지의 시간 단축 (엄청 자주 피어나게: 0.2초 ~ 0.6초)
  const nextSpawnTime = randomRange(200, 600);
  setTimeout(symbolSpawner, nextSpawnTime);
}

// 스포너 시작
setTimeout(symbolSpawner, 200);