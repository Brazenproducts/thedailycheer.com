
/* ---------- Dynamic Story Loader ---------- */
function renderStories(stories) {
  var grid = document.getElementById('storyGrid');
  if (!grid) return;

  var html = '';
  var featured = true;

  stories.forEach(function(s, i) {
    var isFeatured = featured && i === 0;
    var isFunny = s.category === 'funny';
    var classes = 'story-card' + (isFeatured ? ' card-featured' : '') + (isFunny ? ' card-funny' : '');
    var badge = isFeatured ? '<div class="card-badge">⭐ Featured Story</div>' :
                isFunny   ? '<div class="card-badge funny-badge">😂 Funny</div>' : '';
    var catLabel = (s.category || 'good-news').replace(/-/g,' ').replace(/\w/g, function(c){return c.toUpperCase();});
    var smiles = s.smileCount || Math.floor(Math.random()*800 + 50);

    html += '<article class="' + classes + '" data-category="' + (s.category||'good-news') + '" style="cursor:pointer;" onclick="window.open(\'' + s.link + '\',\'_blank\',\'noopener\')">' +
      badge +
      '<div class="card-media">' +
        '<img src="' + s.imageUrl + '" alt="' + (s.imageAlt||'') + '" loading="lazy" ' +
          'style="width:100%;height:100%;object-fit:cover;" ' +
          'onerror="this.style.background=\'linear-gradient(135deg,#a8edea,#fed6e3)\';this.style.display=\'block\';">' +
      '</div>' +
      '<div class="card-body">' +
        '<span class="card-tag">' + catLabel + '</span>' +
        '<h3><a href="' + s.link + '" target="_blank" rel="noopener" style="color:inherit;text-decoration:none;" onclick="event.stopPropagation()">' + s.title + '</a></h3>' +
        (s.description ? '<p>' + s.description.slice(0,160) + (s.description.length>160?'…':'') + '</p>' : '') +
        '<div class="card-footer">' +
          '<span class="card-source" style="font-size:.78rem;color:#999;">' + s.source + '</span>' +
          '<span class="card-date">' + s.dateStr + '</span>' +
          '<button class="smile-btn" data-id="' + s.id + '" aria-label="Smile for this story">😊 <span class="smile-count">' + smiles + '</span></button>' +
        '</div>' +
      '</div>' +
    '</article>';
  });

  grid.innerHTML = html;
  // Re-init after dynamic render
  initSmileButtons();
  if (typeof initScrollReveal === 'function') initScrollReveal();
  if (typeof initCategoryFilter === 'function') initCategoryFilter();
}

function loadStories() {
  fetch('stories.json?v=' + Date.now())
    .then(function(r) { return r.json(); })
    .then(function(stories) {
      if (!stories || !stories.length) throw new Error('empty');
      renderStories(stories);
    })
    .catch(function(e) {
      console.log('Stories load failed, using static fallback:', e);
      var loading = document.getElementById('storiesLoading');
      if (loading) loading.textContent = 'Could not load stories. Try refreshing.';
    });
}

/* ============================================================
   The Daily Cheer — app.js
   ============================================================ */

/* ---------- Animated Stats Counter ---------- */
function animateCount(el, target, suffix = '') {
  const duration = 1800;
  const start = performance.now();
  const startVal = 0;
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const val = Math.round(easeOut(progress) * target);
    el.textContent = val.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function initStats() {
  function runCounters() {
    animateCount(document.getElementById('storiesCount'), 4820);
    animateCount(document.getElementById('smilesCount'), 183000);
    animateCount(document.getElementById('daysCount'), 847);
  }
  // Run after a short delay so page has rendered
  setTimeout(runCounters, 400);
}

/* ---------- Ticker Duplication (seamless loop) ---------- */
function initTicker() {
  const track = document.getElementById('tickerTrack');
  if (!track) return;
  track.innerHTML += track.innerHTML; // duplicate for seamless loop
}

/* ---------- Smile Buttons ---------- */
const smileData = JSON.parse(localStorage.getItem('tdc-smiles') || '{}');

function initSmileButtons() {
  document.querySelectorAll('.smile-btn').forEach(btn => {
    const id = btn.dataset.id;
    const countEl = btn.querySelector('.smile-count');
    let count = parseInt(countEl.textContent.replace(/,/g, ''), 10);

    if (smileData[id]) {
      btn.classList.add('smiling');
      btn.setAttribute('aria-pressed', 'true');
    }

    btn.addEventListener('click', async () => {
      if (smileData[id]) return; // already smiled
      smileData[id] = true;
      localStorage.setItem('tdc-smiles', JSON.stringify(smileData));
      count++;
      countEl.textContent = count.toLocaleString();
      btn.classList.add('smiling');
      btn.setAttribute('aria-pressed', 'true');
      btn.style.transform = 'scale(1.3)';
      setTimeout(() => { btn.style.transform = ''; }, 300);
    });
  });
}

/* ---------- Category Filter Pills ---------- */
function initCategoryFilter() {
  const pills = document.querySelectorAll('.cat-pill');
  const cards = document.querySelectorAll('.story-card');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const filter = pill.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });

      document.getElementById('today')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ---------- Quote of the Day ---------- */
const quotes = [
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Keep your face always toward the sunshine, and shadows will fall behind you.", author: "Walt Whitman" },
  { text: "Try to be a rainbow in someone's cloud.", author: "Maya Angelou" },
  { text: "The smallest act of kindness is worth more than the grandest intention.", author: "Oscar Wilde" },
  { text: "Optimism is the faith that leads to achievement.", author: "Helen Keller" },
  { text: "The world is full of magical things patiently waiting for our wits to grow sharper.", author: "Bertrand Russell" },
  { text: "There are always flowers for those who want to see them.", author: "Henri Matisse" },
  { text: "Do small things with great love.", author: "Mother Teresa" },
  { text: "Even the darkest night will end and the sun will rise.", author: "Victor Hugo" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
];

let quoteIndex = Math.floor(Math.random() * quotes.length);

function showQuote(idx) {
  const q = quotes[idx];
  document.getElementById('quoteText').textContent = q.text;
  document.getElementById('quoteAuthor').textContent = `— ${q.author}`;
}

function initQuote() {
  showQuote(quoteIndex);
  document.getElementById('newQuoteBtn')?.addEventListener('click', () => {
    quoteIndex = (quoteIndex + 1) % quotes.length;
    showQuote(quoteIndex);
  });
}

/* ---------- Mood Lifter / Cheer Me Up ---------- */
const cheerFacts = [
  { emoji: "🐝", fact: "Bees can recognize human faces and remember them for days. Your friendly neighborhood bee definitely knows who you are." },
  { emoji: "🦦", fact: "Sea otters hold hands while sleeping so they don't drift apart. This is called a 'raft' and it's the cutest thing in the ocean." },
  { emoji: "🌳", fact: "Trees in a forest share nutrients through underground fungal networks — they literally feed their sick and young neighbors." },
  { emoji: "🐘", fact: "Elephants are the only non-human animals known to hold funeral rituals for their dead, sometimes returning to grieve years later." },
  { emoji: "🎵", fact: "Cows produce more milk when they listen to relaxing music. Beethoven is their all-time top pick." },
  { emoji: "🐧", fact: "Male penguins propose to their mates by finding the perfect pebble and presenting it. Some search for hours." },
  { emoji: "🌊", fact: "The ocean produces 50–80% of Earth's oxygen. Every other breath you take comes from the sea." },
  { emoji: "🧠", fact: "Your brain generates about 70,000 thoughts per day — most of them are just you narrating your own life like a documentary." },
  { emoji: "🌻", fact: "Young sunflowers track the sun east to west during the day, then reset overnight. Scientists call it 'solar tracking.' You can call it cute." },
  { emoji: "🐬", fact: "Dolphins call each other by name — each dolphin has a unique whistle signature that others use to address them directly." },
  { emoji: "🍀", fact: "The odds of finding a four-leaf clover are about 1 in 5,000. You've probably walked past hundreds of lucky days without knowing." },
  { emoji: "⭐", fact: "There are more stars in the observable universe than grains of sand on all of Earth's beaches. You matter in an impossibly vast place." },
];

let cheerIndex = Math.floor(Math.random() * cheerFacts.length);

function initMoodLifter() {
  const overlay = document.getElementById('moodOverlay');
  const moodBtn = document.getElementById('moodBtn');
  const moodClose = document.getElementById('moodClose');
  const nextFactBtn = document.getElementById('nextFactBtn');
  const moodEmoji = document.getElementById('moodEmoji');
  const moodFact = document.getElementById('moodFact');

  function openMood() {
    showFact();
    overlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    moodClose.focus();
  }
  function closeMood() {
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
    moodBtn.focus();
  }
  function showFact() {
    const f = cheerFacts[cheerIndex % cheerFacts.length];
    moodEmoji.textContent = f.emoji;
    moodFact.textContent = f.fact;
    cheerIndex++;
  }

  moodBtn?.addEventListener('click', openMood);
  moodClose?.addEventListener('click', closeMood);
  nextFactBtn?.addEventListener('click', showFact);
  overlay?.addEventListener('click', e => { if (e.target === overlay) closeMood(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMood(); });
}

/* ---------- Newsletter Form ---------- */
function initNewsletter() {
  const form = document.getElementById('nlForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('nlEmail').value.trim();
    if (!email || !email.includes('@')) {
      document.getElementById('nlEmail').focus();
      return;
    }
    // In production: POST to your email provider API here
    form.querySelector('[type=submit]').disabled = true;
    setTimeout(() => {
      document.getElementById('nlSuccess').removeAttribute('hidden');
      form.querySelector('[type=submit]').style.display = 'none';
    }, 600);
  });
}

/* ---------- Load More (placeholder) ---------- */
function initLoadMore() {
  const btn = document.getElementById('loadMoreBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    btn.textContent = 'You\'ve found all the good news for today! Come back tomorrow 🌅';
    btn.disabled = true;
    btn.style.opacity = '.6';
  });
}

/* ---------- Footer Year ---------- */
function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------- Scroll Fade-In ---------- */
function initScrollReveal() {
  const cards = document.querySelectorAll('.story-card, .cat-pill');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    observer.observe(card);
  });
}

/* ---------- Zen Lofi Widget ---------- */
function initChillZone() {
  var trigger  = document.getElementById('chillTrigger');
  var panel    = document.getElementById('chillPanel');
  var closeBtn = document.getElementById('chillClose');
  var npBar    = document.getElementById('nowPlayingBar');
  var npLabel  = document.getElementById('nowPlayingLabel');
  var npStop   = document.getElementById('nowPlayingStop');
  var npOpen   = document.getElementById('nowPlayingOpen');
  if (!trigger || !panel) return;

  // Open / close panel
  trigger.addEventListener('click', function() { panel.classList.toggle('open'); });
  closeBtn.addEventListener('click', function() { panel.classList.remove('open'); });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') panel.classList.remove('open'); });

  // Now Playing bar helpers
  function showNowPlaying(label) {
    if (!npBar) return;
    npBar.style.display = 'flex';
    if (npLabel) npLabel.textContent = label;
    // Push page content up so bar doesn't cover it
    document.body.style.paddingBottom = '48px';
    // Push chill trigger up too
    if (trigger) trigger.style.bottom = '72px';
  }
  function hideNowPlaying() {
    if (!npBar) return;
    npBar.style.display = 'none';
    document.body.style.paddingBottom = '';
    if (trigger) trigger.style.bottom = '';
  }

  if (npStop) npStop.addEventListener('click', function() { stopAll(); hideNowPlaying(); });
  if (npOpen) npOpen.addEventListener('click', function() { panel.classList.add('open'); });

  // Tabs
  document.querySelectorAll('.chill-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.chill-tab').forEach(function(t) { t.classList.remove('active'); });
      document.querySelectorAll('.chill-pane').forEach(function(p) { p.classList.remove('active'); });
      tab.classList.add('active');
      var pane = document.getElementById(tab.dataset.tab);
      if (pane) pane.classList.add('active');
    });
  });

  // ---- Global stop ----
  var currentNatureBtn = null;
  var currentNatureAudio = null;

  function stopAll() {
    if (currentNatureAudio) { currentNatureAudio.pause(); currentNatureAudio.currentTime = 0; }
    if (currentNatureBtn) currentNatureBtn.classList.remove('playing');
    currentNatureBtn = null; currentNatureAudio = null;
    var frame = document.getElementById('ytFrame');
    var ytPlayer = document.getElementById('ytPlayer');
    if (frame) frame.src = '';
    if (ytPlayer) ytPlayer.style.display = 'none';
    document.querySelectorAll('.stream-card').forEach(function(c) { c.classList.remove('active'); });
    hideNowPlaying();
  }

  // Nature sounds
  document.querySelectorAll('.nb').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var snd = btn.dataset.snd;
      var audio = document.getElementById('snd-' + snd);
      if (!audio) return;
      if (currentNatureBtn === btn) { stopAll(); return; }
      stopAll();
      audio.volume = 0.7;
      audio.currentTime = 0;
      audio.play().catch(function(e) { console.log('Audio err:', e); });
      btn.classList.add('playing');
      currentNatureBtn = btn;
      currentNatureAudio = audio;
      // Show now playing bar with sound name
      var label = btn.querySelector('span') ? btn.querySelector('span').textContent : snd;
      showNowPlaying('🌿 ' + label + ' — tap Stop to end');
    });
  });

  // Stream cards
  document.querySelectorAll('.stream-card').forEach(function(card) {
    card.addEventListener('click', function() {
      var ytId = card.dataset.yt;
      if (!ytId) return;
      stopAll();
      card.classList.add('active');
      var ytPlayer = document.getElementById('ytPlayer');
      var frame  = document.getElementById('ytFrame');
      if (ytPlayer && frame) {
        frame.src = 'https://www.youtube.com/embed/' + ytId + '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
        ytPlayer.style.display = 'block';
      }
      showNowPlaying('🎧 ' + card.textContent.trim() + ' — tap Stop to end');
    });
  });
}


/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  loadStories();
  initStats();
  initTicker();
  initSmileButtons();
  initCategoryFilter();
  initQuote();
  initMoodLifter();
  initNewsletter();
  initLoadMore();
  initFooterYear();
  initScrollReveal();
  initChillZone();
});
