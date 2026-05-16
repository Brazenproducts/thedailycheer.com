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
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCount(document.getElementById('storiesCount'), 4820);
      animateCount(document.getElementById('smilesCount'), 183000);
      animateCount(document.getElementById('daysCount'), 847);
      observer.disconnect();
    });
  }, { threshold: 0.3 });
  const hero = document.querySelector('.hero');
  if (hero) observer.observe(hero);
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

    btn.addEventListener('click', () => {
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

let cheerIndex = 0;

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

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
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
});
