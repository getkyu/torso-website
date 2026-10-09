(function () {
  'use strict';
  var root = document.getElementById('consult-experience');
  if (!root) return;
  var q = function (selector) { return root.querySelector(selector); };
  var qa = function (selector) { return Array.from(root.querySelectorAll(selector)); };
  var areas = {
    balance: {
      title: '얼굴 전체의 균형', question: '같은 얼굴인데, 앞머리만 바꿔도 왜 분위기가 달라질까요?',
      observe: ['정면에서 이마·눈 주변이 드러나는 폭과 얼굴 윤곽의 여백', '사선에서 윗머리 높이·옆 폭과 눈길이 머무는 부분'],
      influence: '눈 주변을 살리고 싶다면 앞머리 끝과 옆 폭을 조절해 시선이 모이는 위치를 비교합니다. 이마를 열고 높이를 더하면 윤곽이 또렷해 보일 수 있지만, 그 흐름을 유지할 드라이도 함께 봅니다.',
      check: '앞머리를 올리고 내렸을 때, 살리고 싶은 인상과 눈길이 가는 부분이 어떻게 달라지나요?',
      a: ['차분한 실루엣', '높이를 절제해 부드러운 흐름으로. 앞머리 갈라짐을 정돈하는 손질을 확인해요.'],
      b: ['입체적인 실루엣', '이마와 윗선이 드러나 또렷한 흐름으로. 뿌리 볼륨을 만드는 손질을 확인해요.'],
      example: ['눈 주변의 분위기는 살리고, 너무 꾸민 느낌은 피하고 싶어요.', '앞머리를 내릴 때와 올릴 때 이마의 여백과 윗선이 달라 보인다면.', '낮은 윗선은 차분하게, 이마를 조금 연 윗선은 선명하게 느껴질 수 있어 두 방향을 비교합니다.', '얼굴 점수 대신 원하는 인상을 기준으로, 평소 말리는 방법으로 유지되는지 봅니다.']
    },
    fringe: {
      title: '이마·눈·눈썹', question: '이마를 조금만 드러내도 인상이 달라질까요?',
      observe: ['앞머리 끝이 눈·눈썹 어디에 닿는지와 헤어라인의 모양', '평소 갈라지는 위치, 눈썹이 드러나는 폭과 좌우 흐름'],
      influence: '앞머리가 눈썹에 걸리면 끝의 무게와 방향에 따라 눈 주변이 가려지거나 부드럽게 이어질 수 있습니다. 갈라지는 위치를 옮겨 이마를 더 열면 선명한 인상을 줄 수 있어, 노출 범위와 뿌리 손질을 함께 비교합니다.',
      check: '앞머리 끝과 갈라지는 위치를 달리했을 때, 원하는 노출 범위가 모류와도 맞나요?',
      a: ['부드럽게 드리우기', '눈썹 주변에 가벼운 끝선을 남겨요. 갈라지거나 눈을 찌르는 부분을 확인해요.'],
      b: ['시원하게 드러내기', '갈라지는 위치를 정해 눈썹·이마를 보여요. 방향을 잡는 드라이가 필요할 수 있어요.'],
      example: ['이마는 조금만 보이고, 차분한 분위기는 남기고 싶어요.', '앞머리가 한쪽으로 갈라지고 끝이 눈썹을 덮는 상태라면.', '끝선을 가볍게 내려 부드러움을 남기거나, 자연스러운 가르마 쪽만 열어 눈썹을 드러내 봅니다.', '정해진 비율 대신 원하는 노출 정도와 마른 뒤 다시 갈라지는 위치를 확인합니다.']
    },
    side: {
      title: '광대·관자·볼 주변', question: '옆머리를 눌렀는데, 왜 낯설게 느껴졌을까요?',
      observe: ['관자부터 광대·볼까지 옆선이 들어가고 나오는 위치', '옆머리 위쪽에 남는 부피와 아래쪽이 뜨는 방향'],
      influence: '관자 주변의 부피가 줄면 그 아래 윤곽이 더 드러나 보일 수 있습니다. 옆머리 전체를 누르기보다 관자 쪽 길이는 남기고, 아래의 뜨는 부분만 정돈하는 방향도 비교합니다.',
      check: '관자 쪽 부피를 남기면서 아래의 뜨는 부분을 정리할 수 있나요? 자랐을 때도 이어질까요?',
      a: ['부드럽게 이어지는 옆선', '관자 쪽 길이와 부피를 남겨 연결해요. 옆으로 뻗는 끝의 손질을 확인해요.'],
      b: ['정돈된 옆선', '아래쪽 뜨는 부분을 정리해 윤곽을 보여요. 짧아진 모발이 다시 뜨는지 확인해요.'],
      example: ['옆머리는 깔끔하게, 관자 주변은 너무 붙지 않았으면 해요.', '관자 쪽은 들어가 보이고 귀 위의 모발은 바깥으로 뜬다면.', '위쪽 길이를 남겨 선을 잇거나, 아래쪽 부피를 줄여 단정함을 더하는 차이를 봅니다.', '누를 범위를 나눠 비교하고 모류·성장 방향에 맞는 커트와 손질 방법을 확인합니다.']
    },
    ear: {
      title: '턱선·하관·귀', question: '귀 주변의 작은 길이 차이가 왜 분위기를 바꿀까요?',
      observe: ['구레나룻의 폭·길이와 귀 앞뒤로 드러나는 끝선', '턱선에서 목선으로 이어지는 흐름과 안경 착용 시 닿는 부분'],
      influence: '귀 주변과 목덜미에 길이를 남기면 선이 부드럽게 이어질 수 있고, 끝선을 드러내면 단정한 느낌이 강해질 수 있습니다. 선명한 라인은 자랄 때 변화도 보여, 원하는 분위기와 관리 부담을 함께 봅니다.',
      check: '구레나룻·귀·목선이 원하는 분위기로 이어지나요? 안경을 쓴다면 닿거나 뜨는 곳은 없나요?',
      a: ['길이를 남겨 연결하기', '귀와 목선에 부드러운 흐름을 남겨요. 닿는 부분이 뻗지 않도록 말리는 법을 봐요.'],
      b: ['귀 주변을 깔끔하게', '귀 주변과 끝선을 드러내 단정하게. 자란 뒤 라인이 달라지는 정도를 확인해요.'],
      example: ['단정해 보이고 싶지만 옆선이 너무 짧아지는 건 싫어요.', '귀 위 모발은 안경 다리에 닿고, 구레나룻 길이는 마음에 든다면.', '구레나룻은 남긴 채 닿는 부분만 정리하거나, 귀 주변까지 열어 더 선명한 선을 비교합니다.', '평소 쓰는 안경을 착용하고 앞·옆모습과 목선의 연결을 함께 확인합니다.']
    },
    profile: {
      title: '측면·두상·전체 실루엣', question: '정면은 괜찮은데, 옆모습은 왜 다르게 느껴질까요?',
      observe: ['정면·사선·측면에서 가장 높고 도톰해 보이는 위치', '윗머리에서 뒤통수·목선으로 이어지는 곡선과 가마 방향'],
      influence: '볼륨이 위로만 모이면 높이가 강조되고, 뒤쪽으로 옮기면 옆모습의 곡선이 달라 보일 수 있습니다. 가장 도톰한 위치와 층의 시작점을 조절하되, 실제 두상과 가마에서 만들 수 있는 흐름인지 확인합니다.',
      check: '볼륨을 둘 위치를 바꾸면 정면·사선·측면이 어떻게 이어지나요? 집에서도 만들 수 있나요?',
      a: ['차분한 윗선', '윗머리 높이를 절제해 정돈해요. 가마가 뜨는 방향을 말리며 조절할 수 있는지 봐요.'],
      b: ['뒤쪽의 입체감', '뒤통수 쪽 볼륨 위치로 곡선을 만들어요. 필요한 길이와 뿌리 드라이를 확인해요.'],
      example: ['윗머리는 차분하게, 옆에서 보는 뒤쪽은 둥글었으면 해요.', '볼륨이 정수리 위에 모이고 뒤통수 쪽은 낮아 보인다면.', '윗선의 높이를 줄이거나, 뒤쪽에 길이·층을 조절해 볼륨 위치를 옮기는 방향을 비교합니다.', '가마 방향에서 가능한 실루엣과 드라이 순서를 확인하고, 자랐을 때 달라질 부분도 봅니다.']
    },
    hair: {
      title: '모발이 움직이는 방식', question: '마음에 드는 사진처럼, 커트만으로도 가능할까요?',
      observe: ['마른 상태의 굵기·양·곱슬과 가마에서 자라는 방향', '현재 길이에서 자연스럽게 놓이는 결, 뜨거나 꺾이는 부분'],
      influence: '원하는 흐름이 본래 모류와 비슷하면 길이와 무게 조절로 가까워질 수 있습니다. 반대 방향이나 새로운 컬을 원하면 손질·펌의 도움과 한계를 따로 설명하고, 커트만 할 때의 차이도 함께 비교합니다.',
      check: '커트와 평소 손질만으로 어디까지 가능한가요? 추가 시술을 하지 않을 때의 차이도 알려주세요.',
      a: ['본래의 결 살리기', '자연스럽게 놓이는 방향에 길이를 맞춰요. 말리기만으로 되는 범위를 확인해요.'],
      b: ['새로운 흐름 시도하기', '방향이나 컬을 바꿨을 때를 비교해요. 필요한 손질·시술과 유지 부담을 함께 봐요.'],
      example: ['굵은 컬이 좋지만, 매일 오래 손질하기는 어려워요.', '현재 모발은 곧고 가마 방향으로 쉽게 갈라지는 상태라면.', '커트로 본래 흐름을 정리하는 안과, 컬을 더해 분위기를 바꾸는 안의 차이를 설명합니다.', '모발 상태와 가능한 손질을 보고 시술 필요성을 정하며, 시술 없이 유지할 방향도 함께 고릅니다.']
    }
  };
  var routines = {
    simple: ['말리는 정도가 편해요', '말리는 방향만으로 가능한 범위와 어려운 부분을 현장에서 확인하고 싶어요.'],
    dryer: ['드라이로 방향을 잡을 수 있어요', '앞머리·뿌리·옆선 중 어디부터 말리면 좋을지 알고 싶어요.'],
    product: ['드라이와 제품 사용도 괜찮아요', '제품의 양과 바르는 순서, 질감·고정력의 차이를 알고 싶어요.'],
    unsure: ['아직 잘 모르겠어요', '직접 따라 할 수 있는 간단한 방법부터 상담하고 싶어요.']
  };
  var keys = Object.keys(areas), active = keys[0], choices = {}, routine = null, step = 0, copyToken = 0;
  var tabs = qa('[data-cex-area]'), note = q('#cex-note'), preference = q('#cex-preference');
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
    q('[data-cex-question]').textContent = area.question;
    q('[data-cex-check]').textContent = area.check;
    q('.cex-example').open = false;
    qa('[data-cex-example]').forEach(function (item, index) { item.textContent = area.example[index]; });
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
      lines.push('함께 확인할 것: ' + area.check);
    });
    var wish = preference.value.trim().slice(0, 160);
    if (wish) lines.push('', '남기고 싶은 모습·피하고 싶은 변화: ' + wish);
    lines.push('', '평소 손질: ' + routines[routine][0], routines[routine][1], '', '원하는 인상과 관찰 근거, 두 방향의 차이, 집에서의 손질·자랐을 때의 변화를 함께 설명해 주세요.');
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
  preference.addEventListener('input', invalidateCopy);
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
