// 모바일 내비게이션 토글
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a =>
        a.addEventListener('click', () => links.classList.remove('open')));
}

// 스크롤 시 요소 등장 애니메이션 (뷰포트에 들어올 때마다 매번 재생)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        entry.target.classList.toggle('visible', entry.isIntersecting);
    });
}, { threshold: 0.12 });

const revealGroups = new Map();
document.querySelectorAll('.reveal').forEach((el) => {
    const group = revealGroups.get(el.parentElement) || [];
    group.push(el);
    revealGroups.set(el.parentElement, group);
});
revealGroups.forEach((group) => {
    group.forEach((el, i) => {
        el.style.transitionDelay = `${Math.min(i * 60, 240)}ms`;
        observer.observe(el);
    });
});

// About 영역에 들어올 때마다 문장을 한 줄씩 타이핑으로 다시 보여주기
const aboutText = document.getElementById('aboutText');
if (aboutText) {
    const typeLines = Array.from(aboutText.querySelectorAll('.type-line'));
    const originalTexts = typeLines.map((el) => el.textContent.trim());
    let activeIntervals = [];

    const stopTyping = () => {
        activeIntervals.forEach(clearInterval);
        activeIntervals = [];
        typeLines.forEach((el) => el.classList.remove('typing-active'));
    };

    const typeLine = (index) => {
        if (index >= typeLines.length) return;
        const el = typeLines[index];
        const text = originalTexts[index];
        el.classList.add('typing-active');
        let charIndex = 0;
        const interval = setInterval(() => {
            charIndex++;
            el.textContent = text.slice(0, charIndex);
            if (charIndex >= text.length) {
                clearInterval(interval);
                el.classList.remove('typing-active');
                typeLine(index + 1);
            }
        }, 18);
        activeIntervals.push(interval);
    };

    const startTyping = () => {
        stopTyping();
        typeLines.forEach((el) => { el.textContent = ''; });
        typeLine(0);
    };

    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                startTyping();
            } else {
                stopTyping();
            }
        });
    }, { threshold: 0.3 });
    aboutObserver.observe(aboutText);
}

// 맨 위로 버튼
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('show', window.scrollY > 300);
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// 성공 메시지가 있으면 contact 섹션으로 부드럽게 이동
if (document.querySelector('.alert-success') || document.querySelector('.alert-error')) {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
}

// 프로젝트 카드 클릭 시 GitHub 요약 모달 표시
const projectModal = document.getElementById('projectModal');
if (projectModal) {
    const modalTitle = projectModal.querySelector('.modal-title');
    const modalMeta = projectModal.querySelector('.modal-meta');
    const modalSummary = projectModal.querySelector('.modal-summary');
    const modalLink = projectModal.querySelector('.modal-link');
    const modalClose = document.getElementById('projectModalClose');

    const openProjectModal = (card) => {
        modalTitle.textContent = card.dataset.title || '';
        const stars = card.dataset.stars || '0';
        const updated = card.dataset.updated;
        modalMeta.textContent = updated ? `⭐ ${stars} · 업데이트 ${updated}` : `⭐ ${stars}`;
        modalSummary.textContent = card.dataset.summary || '요약 정보를 불러오지 못했습니다.';
        modalLink.href = card.dataset.repoUrl || '#';
        projectModal.classList.add('open');
        projectModal.setAttribute('aria-hidden', 'false');
    };

    const closeProjectModal = () => {
        projectModal.classList.remove('open');
        projectModal.setAttribute('aria-hidden', 'true');
    };

    document.querySelectorAll('.project-card').forEach((card) => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('a')) return;
            openProjectModal(card);
        });
    });

    modalClose?.addEventListener('click', closeProjectModal);
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) closeProjectModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeProjectModal();
    });
}
