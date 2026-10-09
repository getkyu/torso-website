(function () {
  'use strict';
  var root = document.getElementById('consult-experience');
  if (!root) return;
  var q = function (selector) { return root.querySelector(selector); };
  var qa = function (selector) { return Array.from(root.querySelectorAll(selector)); };
  var areas = {
    balance: { title: '얼굴 전체의 균형', observe: ['가로·세로의 인상과 이목구비 주변 여백', '정면과 사선에서 보이는 좌우 흐름'], influence: '윗머리 높이와 옆머리 폭, 무게가 모이는 선을 어디에 둘지 비교합니다. 같은 비율도 원하는 인상에 따라 선택이 달라집니다.', a: ['차분한 실루엣', '높이를 절제하고 자연스럽게 이어지는 흐름'], b: ['입체적인 실루엣', '윗머리와 옆선의 볼륨 차이가 느껴지는 흐름'] },
    fringe: { title: '이마·눈·눈썹', observe: ['헤어라인과 이마가 드러나는 폭', '눈썹의 선명함·위치와 눈 주변의 여백'], influence: '앞머리가 떨어지는 각도와 길이, 갈라지는 위치를 비교합니다. 끝의 무게를 조절하면 눈썹과 이마가 드러나는 느낌도 달라집니다.', a: ['부드럽게 드리우기', '앞머리를 내려 가볍게 흐르는 분위기'], b: ['시원하게 드러내기', '이마와 눈썹이 보이는 선명한 분위기'] },
    side: { title: '광대·관자·볼 주변', observe: ['관자 주변에서 옆선으로 이어지는 볼륨', '정면·사선에서 보이는 광대와 볼의 선'], influence: '관자와 광대 주변에서 어느 위치에 길이와 부피를 남길지 비교합니다. 옆머리 층과 무게선을 조절해 이어지는 흐름을 달리합니다.', a: ['부드럽게 이어지는 옆선', '옆머리의 길이와 흐름을 남기는 방향'], b: ['정돈된 옆선', '뜨는 부분을 정리하고 윤곽을 드러내는 방향'] },
    ear: { title: '턱선·하관·귀', observe: ['귀를 드러내는 정도와 구레나룻의 길이', '턱선·목선과 이어지는 옆머리의 흐름'], influence: '구레나룻의 폭·길이, 귀 주변의 끝선과 목선을 어떻게 연결할지 비교합니다. 길이를 남기는 범위와 드러낼 부분을 함께 고릅니다.', a: ['길이를 남겨 연결하기', '귀 주변과 목선으로 부드럽게 이어지는 흐름'], b: ['귀 주변을 깔끔하게', '끝선을 정리해 단정함을 더하는 방향'] },
    profile: { title: '측면·두상·전체 실루엣', observe: ['윗머리에서 뒤통수로 이어지는 곡선', '가마·모류와 목·어깨에 닿는 길이'], influence: '볼륨이 가장 도톰하게 보이는 지점과 층이 시작되는 높이를 비교합니다. 가마·모류를 확인해 윗머리와 뒤통수의 흐름을 연결합니다.', a: ['차분한 윗선', '과하게 솟지 않고 정돈된 높이'], b: ['뒤쪽의 입체감', '뒤통수로 이어지는 둥근 흐름'] },
    hair: { title: '모발이 움직이는 방식', observe: ['굵기·양·곱슬과 머리가 자라는 방향', '마른 상태의 흐름과 평소 뜨는 부분'], influence: '가마·모류에 맞춰 나눠지는 선, 남길 길이와 질감을 살펴봅니다. 커트로 가능한 흐름과 추가 시술이 필요한 부분은 실제 모발을 보고 구분합니다.', a: ['본래의 결 살리기', '지금 모발의 움직임을 활용하는 방향'], b: ['새로운 흐름 시도하기', '컬이나 방향을 달리했을 때의 차이 비교'] }
  };
  var routines = {
    simple: ['말리는 정도가 편해요', '말리는 방향만으로 가능한 범위와 어려운 부분을 현장에서 확인하고 싶어요.'],
    dryer: ['드라이로 방향을 잡을 수 있어요', '앞머리·뿌리·옆선 중 어디부터 말리면 좋을지 알고 싶어요.'],
    product: ['드라이와 제품 사용도 괜찮아요', '제품의 양과 바르는 순서, 질감·고정력의 차이를 알고 싶어요.'],
    unsure: ['아직 잘 모르겠어요', '직접 따라 할 수 있는 간단한 방법부터 상담하고 싶어요.']
  };
  var keys = Object.keys(areas), active = keys[0], choices = {}, routine = null, step = 0, copyToken = 0;
  var tabs = qa('[data-cex-area]'), note = q('#cex-note');
  function selectionCount() { return Object.keys(choices).length; }
  function invalidateCopy() {
    copyToken++;
    note.value = '';
    q('[data-cex-copy-status]').textContent = '';
    q('[data-cex-booking]').hidden = true;
  }
  function refreshProgress() {
    var selected = selectionCount();
    q('[data-cex-remove]').hidden = !choices[active];
    q('[data-cex-next="1"]').disabled = !selected;
    q('[data-cex-step="1"]').disabled = !selected;
    q('[data-cex-next="2"]').disabled = !selected || !routine;
    q('[data-cex-step="2"]').disabled = !selected || !routine;
    tabs.forEach(function (tab) { tab.dataset.picked = String(!!choices[tab.dataset.cexArea]); });
    q('[data-cex-selection-status]').textContent = selected ? selected + '개 부분의 선호를 담았어요. 다른 부분도 살펴보거나, 손질 습관으로 넘어가세요.' : '궁금한 부분 한 곳에서 원하는 방향을 선택해 주세요.';
  }
  function renderArea(key, focus) {
    active = key;
    q('[data-cex-remove]').hidden = !choices[key];
    var area = areas[key];
    tabs.forEach(function (tab) {
      var selected = tab.dataset.cexArea === key;
      tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1;
      if (selected && focus) tab.focus();
    });
    q('#cex-area-panel').setAttribute('aria-labelledby', 'cex-tab-' + key);
    q('[data-cex-title]').textContent = area.title;
    q('[data-cex-observe]').replaceChildren();
    area.observe.forEach(function (text) { var li = document.createElement('li'); li.textContent = text; q('[data-cex-observe]').appendChild(li); });
    q('[data-cex-influence]').textContent = area.influence;
    ['a', 'b'].forEach(function (value) {
      q('[data-cex-choice-title="' + value + '"]').textContent = area[value][0];
      q('[data-cex-choice-copy="' + value + '"]').textContent = area[value][1];
    });
    qa('[name="cex-direction"]').forEach(function (radio) { radio.checked = radio.value === choices[key]; });
    // SVG does not implement HTMLElement.hidden consistently; set the attribute explicitly.
    [q('.cex-diagram-front'), q('.cex-diagram-profile')].forEach(function (g, index) {
      if ((index === 0) === (key === 'profile')) g.setAttribute('hidden', ''); else g.removeAttribute('hidden');
    });
    qa('[data-cex-mark]').forEach(function (mark) {
      if (mark.dataset.cexMark === key) mark.removeAttribute('hidden'); else mark.setAttribute('hidden', '');
    });
    q('#cex-diagram-title').textContent = area.title + '을 살펴보는 위치 도해.';
  }
  function buildNote() {
    var lines = ['토르소 맨즈헤어 · 헤어컨설팅 상담 준비', '내가 선택한 취향과 살펴보고 싶은 부분', ''];
    keys.forEach(function (key) {
      if (!choices[key]) return;
      var area = areas[key], value = choices[key];
      lines.push(area.title + ': ' + (value === 'both' ? area.a[0] + ' / ' + area.b[0] + ' 모두 비교하고 싶어요.' : area[value][0] + ' 쪽이 궁금해요.'));
    });
    lines.push('', '평소 손질: ' + routines[routine][0], routines[routine][1], '', '현장에서 헤어라인·두상·모질·모류와 가능한 손질 방법을 함께 확인하고 싶어요.');
    return lines.join('\n');
  }
  function showStep(value, focus) {
    if (value > 0 && !selectionCount()) return;
    if (value === 2 && !routine) return;
    step = value;
    qa('[data-cex-panel]').forEach(function (panel) { panel.hidden = Number(panel.dataset.cexPanel) !== value; });
    qa('[data-cex-step]').forEach(function (button) {
      if (Number(button.dataset.cexStep) === value) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');
    });
    if (value === 2) note.value = buildNote();
    if (focus) {
      var heading = q('[data-cex-panel="' + value + '"]>h5');
      heading.focus({ preventScroll: true });
      heading.scrollIntoView({ block: 'nearest', behavior: 'auto' });
    }
  }
  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () { renderArea(tab.dataset.cexArea, false); });
    tab.addEventListener('keydown', function (event) {
      var target = index;
      if (event.key === 'ArrowRight') target = (index + 1) % keys.length;
      else if (event.key === 'ArrowLeft') target = (index + keys.length - 1) % keys.length;
      else if (event.key === 'ArrowDown') target = (index + 3) % keys.length;
      else if (event.key === 'ArrowUp') target = (index + 3) % keys.length;
      else if (event.key === 'Home') target = 0;
      else if (event.key === 'End') target = keys.length - 1;
      else return;
      event.preventDefault(); renderArea(keys[target], true);
    });
  });
  qa('[name="cex-direction"]').forEach(function (radio) {
    radio.addEventListener('change', function () { if (radio.checked) { choices[active] = radio.value; invalidateCopy(); refreshProgress(); } });
  });
  q('[data-cex-remove]').addEventListener('click', function () {
    delete choices[active];
    invalidateCopy();
    renderArea(active, true);
    refreshProgress();
  });
  qa('[name="cex-routine"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      if (!radio.checked) return;
      routine = radio.value; q('[data-cex-routine-note]').textContent = routines[routine][1]; invalidateCopy(); refreshProgress();
    });
  });
  qa('[data-cex-step],[data-cex-next],[data-cex-back]').forEach(function (button) {
    button.addEventListener('click', function () {
      var value = button.hasAttribute('data-cex-step') ? button.dataset.cexStep : button.hasAttribute('data-cex-next') ? button.dataset.cexNext : button.dataset.cexBack;
      showStep(Number(value), true);
    });
  });
  q('[data-cex-copy]').addEventListener('click', async function () {
    if (step !== 2 || !selectionCount() || !routine) return;
    var token = ++copyToken;
    note.value = buildNote();
    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('manual-copy');
      await navigator.clipboard.writeText(note.value);
      if (token !== copyToken) return;
      q('[data-cex-copy-status]').textContent = '복사했어요. 네이버 예약 요청사항에 붙여넣어 주세요.';
    } catch (error) {
      if (token !== copyToken) return;
      q('[data-cex-copy-status]').textContent = '자동 복사를 할 수 없어요. 위 메모를 길게 누르거나 선택한 뒤 직접 복사해 주세요.';
      note.focus({ preventScroll: true }); note.select();
    }
    q('[data-cex-booking]').hidden = false;
  });
  renderArea(active, false); refreshProgress();
  q('.cex-fallback').hidden = true;
  q('.cex-interactive').hidden = false;
})();
