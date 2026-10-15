/* ─── Typed text animation ─────────────────────────────────────────── */
(function () {
    const phrases = [
        'ANDROID ENGINEER',
        'KMP DEVELOPER',
        'COMPOSE ARCHITECT',
        'OFFLINE-FIRST BUILDER',
        'SECURITY-MINDED DEV',
        'CROSS-PLATFORM SHIPPER',
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    const el = document.getElementById('typed-text');
    if (!el) return;

    function type() {
        const current = phrases[phraseIndex];
        el.textContent = deleting ? current.substring(0, charIndex--) : current.substring(0, charIndex++);

        let delay = deleting ? 40 : 80;
        if (!deleting && charIndex > current.length) {
            delay = 1800;
            deleting = true;
        } else if (deleting && charIndex < 0) {
            deleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            charIndex = 0;
            delay = 300;
        }
        setTimeout(type, delay);
    }
    type();
})();

/* ─── Scroll reveal observer ───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal-item').forEach(el => observer.observe(el));
});

/* ─── Active nav link highlighting ────────────────────────────────── */
(function () {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav .desktop-nav a[href^="#"]');

    // Immediate visual feedback on click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('nav-active'));
            link.classList.add('nav-active');
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('nav-active');
                    if (link.getAttribute('href') === '#' + entry.target.id) {
                        link.classList.add('nav-active');
                    }
                });
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => observer.observe(s));
})();

/* ─── Hamburger mobile menu ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('hamburger-btn');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
        btn.classList.toggle('open');
        menu.classList.toggle('open');
    });

    menu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            btn.classList.remove('open');
            menu.classList.remove('open');
        });
    });
});

/* ─── Scroll-to-top + score HUD ────────────────────────────────────── */
(function () {
    const btn = document.getElementById('scroll-top');
    const scoreEl = document.getElementById('score-value');
    let ticking = false;

    function onScroll() {
        if (btn) btn.classList.toggle('visible', window.scrollY > 400);
        if (scoreEl) {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
            const isBottom = max <= 0 || (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) || pct >= 1;
            const score = isBottom ? 999999 : Math.min(999999, Math.floor(pct * 999999));
            scoreEl.textContent = String(score).padStart(6, '0');
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });

    window.addEventListener('resize', onScroll, { passive: true });

    if (btn) {
        btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
    onScroll();
})();

/* ─── Project filter tabs ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('#project-filters .filter-tab');
    const cards = document.querySelectorAll('#project-grid .cartridge');
    if (!tabs.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('is-active'));
            tab.classList.add('is-active');
            const filter = tab.dataset.filter;
            cards.forEach(card => {
                const show = filter === 'all' || card.dataset.category === filter;
                card.classList.toggle('is-hidden', !show);
            });
        });
    });
});

/* ─── Konami code easter egg ───────────────────────────────────────── */
(function () {
    const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let progress = 0;

    window.addEventListener('keydown', (e) => {
        const expected = code[progress];
        if (e.key.toLowerCase() === expected.toLowerCase()) {
            progress++;
            if (progress === code.length) {
                progress = 0;
                triggerCheat();
            }
        } else {
            progress = e.key === code[0] ? 1 : 0;
        }
    });

    function triggerCheat() {
        document.body.classList.add('konami-mode');
        setTimeout(() => document.body.classList.remove('konami-mode'), 1800);

        const toast = document.createElement('div');
        toast.className = 'konami-toast';
        toast.textContent = '🎮 CHEAT CODE ACCEPTED: +30 LIVES';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    }
})();

/* ─── Cleanup any legacy scale settings ────────────────────────────── */
try {
    localStorage.removeItem('portfolio_scale');
    document.documentElement.style.zoom = '';
} catch (e) {}


