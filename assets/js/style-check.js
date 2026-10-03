/* No upload, persistent storage, analytics payload or face classification. */
(function () {
  'use strict';
  var root = document.getElementById('style-check');
  if (!root) return;
  var form = root.querySelector('[data-check-form]');
  var steps = Array.from(root.querySelectorAll('[data-check-step]'));
  var workspace = root.querySelector('[data-check-workspace]');
  var result = root.querySelector('[data-check-result]');
  var start = root.querySelector('[data-check-start]');
  var back = root.querySelector('[data-check-back]');
  var next = root.querySelector('[data-check-next]');
  var error = root.querySelector('[data-check-error]');
  var current = 0;
  var note = '';
  var names = ['concern', 'mood', 'routine'];
  var progress = ['지금의 고민', '원하는 인상', '평소 손질'];
  var concerns = {
    face: ['내 얼굴에 어울리는 머리', '얼굴형 이름보다, 비율과 여백부터', '상·중·하안부의 흐름, 얼굴의 가로 폭, 눈썹과 헤어라인의 여백을 함께 살펴봅니다. 앞머리로 드러낼 부분과 볼륨을 둘 위치를 상담해 보세요.'],
    volume: ['앞머리·뒤통수 볼륨', '높이보다, 볼륨을 둘 위치', '정수리만 높이기보다 앞머리부터 뒤통수까지 이어지는 옆선을 봅니다. 가마의 방향과 모질을 확인하고 볼륨을 살리거나 정돈할 위치를 함께 찾아요.'],
    side: ['뜨거나 무거운 옆머리', '내 옆선에 맞는 길이와 무게', '귀 주변, 관자와 광대 옆의 공간을 살펴봅니다. 커트로 조절할 부분과 다운펌이 도움 될 부분을 나누어 설명드려요.'],
    fringe: ['이마와 눈썹이 보이는 정도', '앞머리로 달라지는 눈 주변의 인상', '눈썹의 짙기·길이·높낮이, 눈과 눈썹 사이, 눈끝에서 헤어라인까지의 여백을 함께 봅니다. 이마를 드러내는 정도와 앞머리의 흐름을 비교해 보세요.'],
    explore: ['아직 잘 모르겠어요', '좋아하는 모습부터 발견하기', '지금 머리에서 좋은 점과 불편한 점부터 이야기해 주세요. 현재 분위기를 살리는 방향과 새로운 인상을 더하는 방향을 비교하며 고릅니다.']
  };
  var moods = {
    soft: ['부드럽고 자연스럽게', '가벼운 결과 유연한 흐름', '부드럽게 흐르는 앞머리와 가벼운 질감을 참고해 보세요. 원하는 길이와 실제 모류에 맞춰 앞머리의 무게와 컬을 조절합니다.', ['soft', 'archive']],
    sharp: ['깔끔하고 또렷하게', '옆선과 앞머리의 선을 정돈하기', '슬릭한 결과 정돈된 옆선을 참고해 보세요. 짧게 자르는 것만으로 정하지 않고 이마 노출과 모량, 손질 습관을 함께 봅니다.', ['sharp', 'classic']],
    classic: ['단정하고 성숙하게', '넘긴 앞머리와 차분한 흐름', '가일·슬릭백처럼 앞머리를 넘기는 방향을 참고해 보세요. 이마를 드러낼 범위와 고정에 필요한 손질까지 함께 정합니다.', ['classic', 'sharp']],
    archive: ['개성과 입체감 있게', '질감과 컬로 표현하는 내 분위기', '텍스쳐컷이나 다양한 컬의 움직임을 참고해 보세요. 원하는 개성에 맞춰 질감의 강도와 실루엣을 조절합니다.', ['archive', 'soft']],
    unsure: ['비교하면서 찾고 싶어요', '두 가지 분위기부터 비교하기', '부드러운 결과 또렷한 선을 번갈아 보세요. 사진 전체보다 앞머리·옆선·질감 중 마음에 드는 부분 하나를 골라도 상담의 출발점이 됩니다.', ['soft', 'sharp']]
  };
  var routines = {
    easy: ['최대한 간단하게', '말리는 방향부터 쉽게', '제품과 도구 사용을 최소화하고 싶다는 점을 먼저 알려주세요. 자연스럽게 마를 때의 모류를 보고 가능한 디자인과 필요한 손질을 설명드립니다.'],
    daily: ['5분 정도 손질 가능', '매일 반복할 짧은 손질 순서', '드라이로 방향을 잡고 소량의 제품으로 마무리하는 방식을 함께 연습해요. 5분 안에 가능한지는 길이와 모질에 맞춰 확인합니다.'],
    enjoy: ['스타일링을 즐겨요', '한 가지 커트, 다른 표현', '자연스러운 질감과 정돈된 질감을 바꾸는 제품·드라이 방법을 물어보세요. 일상과 특별한 날에 맞춘 표현을 함께 찾아요.']
  };
  var styles = {
    soft: ['부드러운 결 · 소프트', '시스루 · 세미리프 · 쉐도우', 'core_soft_poster.jpg'],
    sharp: ['또렷한 선 · 샤프', '슬릭댄디 · 드롭 · 크롭', 'core_sharp_poster.jpg'],
    classic: ['단정한 흐름 · 클래식', '슬릭백 · 가일 · 포마드', 'core_classic_poster.jpg'],
    archive: ['입체적인 질감 · 아카이브', '텍스쳐컷 · 빈티지 · 히피', 'core_archive_poster.jpg']
  };
  function focusOn(el) {
    el.focus({ preventScroll: true });
    workspace.scrollIntoView({ block: 'start', behavior: 'auto' });
  }
  function showStep(index) {
    current = index;
    form.hidden = false;
    result.hidden = true;
    steps.forEach(function (step, i) { step.hidden = i !== index; });
    back.hidden = index === 0;
    next.textContent = index === 2 ? '상담 포인트 보기 →' : '다음 →';
    root.querySelector('[data-check-progress]').textContent = (index + 1) + ' / 3 · ' + progress[index];
    root.querySelector('[data-check-progressbar]').style.setProperty('--progress', ((index + 1) / 3 * 100) + '%');
    error.textContent = '';
    focusOn(steps[index].querySelector('legend'));
  }
  function selected(name) { return form.querySelector('input[name="' + name + '"]:checked'); }
  function element(tag, text, className) {
    var el = document.createElement(tag);
    if (text) el.textContent = text;
    if (className) el.className = className;
    return el;
  }
  function showResult() {
    var concern = concerns[selected('concern').value];
    var mood = moods[selected('mood').value];
    var routine = routines[selected('routine').value];
    var points = root.querySelector('[data-check-points]');
    var cards = root.querySelector('[data-check-cards]');
    points.replaceChildren();
    cards.replaceChildren();
    [concern, mood, routine].forEach(function (item, i) {
      var article = element('article', '', 'style-check__point');
      article.append(element('span', '0' + (i + 1) + ' / ' + progress[i]), element('h4', item[1]), element('p', item[2]));
      points.append(article);
    });
    mood[3].forEach(function (id) {
      var item = styles[id];
      var link = element('a', '', 'style-check__card');
      link.href = 'styles.html#core-' + id;
      var image = document.createElement('img');
      image.src = 'assets/img/' + item[2];
      image.alt = '토르소 실제 시술 예시 · ' + item[0];
      image.width = 600; image.height = 800; image.loading = 'lazy';
      var copy = document.createElement('div');
      copy.append(element('span', item[0]), element('strong', item[1]), element('p', '실제 스타일 더 보기 ↗'));
      link.append(image, copy);
      cards.append(link);
    });
    root.querySelector('[data-check-selection]').textContent = '내 선택 · ' + concern[0] + ' / ' + mood[0] + ' / ' + routine[0];
    note = '토르소 방문 전 스타일 체크\n\n궁금한 점: ' + concern[0] + '\n원하는 인상: ' + mood[0] + '\n평소 손질: ' + routine[0] + '\n\n상담에서 함께 확인하고 싶어요.\n• ' + concern[1] + '\n• ' + mood[1] + '\n• ' + routine[1] + '\n\n선택한 취향을 정리한 메모입니다. 얼굴형 진단이나 시술 확정이 아닙니다.';
    root.querySelector('[data-check-note]').value = note;
    root.querySelector('[data-check-copy-status]').textContent = '';
    root.querySelector('[data-check-copy-fallback]').hidden = true;
    form.hidden = true;
    result.hidden = false;
    start.textContent = '내 상담 메모 다시 보기 ↗';
    focusOn(root.querySelector('#style-check-result-title'));
  }
  start.hidden = false;
  start.addEventListener('click', function () {
    workspace.hidden = false;
    if (note && !result.hidden) focusOn(root.querySelector('#style-check-result-title'));
    else showStep(current);
  });
  back.addEventListener('click', function () { showStep(Math.max(0, current - 1)); });
  form.addEventListener('change', function () { error.textContent = ''; });
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!selected(names[current])) {
      error.textContent = '한 가지를 골라주세요. 잘 모르겠다면 그 항목을 선택해도 괜찮아요.';
      steps[current].querySelector('input').focus();
      return;
    }
    if (current < 2) showStep(current + 1);
    else showResult();
  });
  root.querySelector('[data-check-restart]').addEventListener('click', function () {
    form.reset();
    note = '';
    start.textContent = '내 스타일 체크하기 ↗';
    showStep(0);
  });
  root.querySelector('[data-check-copy]').addEventListener('click', async function () {
    var status = root.querySelector('[data-check-copy-status]');
    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(note);
      root.querySelector('[data-check-copy-fallback]').hidden = true;
      status.textContent = '복사했어요. 예약 요청사항에 붙여 넣어 주세요.';
    } catch (error) {
      root.querySelector('[data-check-copy-fallback]').hidden = false;
      status.textContent = '직접 복사할 수 있도록 메모를 열었어요.';
      var field = root.querySelector('[data-check-note]');
      field.focus(); field.select();
    }
  });
}());
