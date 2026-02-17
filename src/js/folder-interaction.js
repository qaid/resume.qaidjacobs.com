document.addEventListener('DOMContentLoaded', () => {
  const pagesContainer = document.querySelector('.resume-pages');
  const pages = Array.from(document.querySelectorAll('.resume-page'));
  const prevBtn = document.querySelector('.page-nav-btn.prev');
  const nextBtn = document.querySelector('.page-nav-btn.next');
  const indicator = document.querySelector('.page-nav-indicator');

  if (pages.length === 0) return;

  let currentPage = 0;
  let isAnimating = false;

  // --- Initialize pages immediately ---
  updatePageStates();

  // --- Page stack management ---

  function updatePageStates() {
    pages.forEach((page, i) => {
      page.className = 'resume-page';
      page.removeAttribute('data-stack');
      page.style.transition = '';
      page.scrollTop = 0;

      if (i === currentPage) {
        page.classList.add('active');
      } else if (i > currentPage) {
        const stackPos = i - currentPage;
        if (stackPos <= 3) {
          page.classList.add('underneath');
          page.setAttribute('data-stack', String(stackPos));
          page.style.opacity = '1';
        } else {
          page.style.opacity = '0';
        }
      } else {
        page.style.opacity = '0';
        page.style.transform = 'translate(-120%, -55%) rotate(-8deg)';
      }
    });

    updateNav();
  }

  function updateNav() {
    if (!indicator) return;
    indicator.textContent = `${currentPage + 1} / ${pages.length}`;
    if (prevBtn) prevBtn.disabled = currentPage === 0;
    if (nextBtn) nextBtn.disabled = currentPage === pages.length - 1;
  }

  // --- Page transitions ---

  function goToNextPage() {
    if (isAnimating || currentPage >= pages.length - 1) return;
    isAnimating = true;

    const outgoing = pages[currentPage];
    const incoming = pages[currentPage + 1];

    outgoing.classList.remove('active');
    outgoing.classList.add('pulled-away');

    setTimeout(() => {
      currentPage++;
      incoming.classList.remove('underneath');
      incoming.removeAttribute('data-stack');
      incoming.classList.add('sliding-in', 'active');

      pages.forEach((page, i) => {
        if (i > currentPage) {
          const stackPos = i - currentPage;
          page.removeAttribute('data-stack');
          if (stackPos <= 3) {
            page.setAttribute('data-stack', String(stackPos));
            page.style.opacity = '1';
          }
        }
      });

      updateNav();

      setTimeout(() => {
        incoming.classList.remove('sliding-in');
        isAnimating = false;
      }, 650);
    }, 150);
  }

  function goToPrevPage() {
    if (isAnimating || currentPage <= 0) return;
    isAnimating = true;

    const returning = pages[currentPage - 1];
    const demoting = pages[currentPage];

    demoting.classList.remove('active');
    demoting.classList.add('underneath');
    demoting.setAttribute('data-stack', '1');

    returning.classList.remove('pulled-away');
    returning.style.transition = 'none';
    returning.style.transform = 'translate(-120%, -55%) rotate(-8deg)';
    returning.style.opacity = '0';

    // Force reflow then animate
    returning.offsetHeight;
    returning.style.transition = '';
    returning.classList.add('returning', 'active');

    currentPage--;

    pages.forEach((page, i) => {
      if (i > currentPage) {
        const stackPos = i - currentPage;
        page.removeAttribute('data-stack');
        if (stackPos <= 3) {
          page.classList.add('underneath');
          page.setAttribute('data-stack', String(stackPos));
          page.style.opacity = '1';
        } else {
          page.style.opacity = '0';
        }
      }
    });

    updateNav();

    setTimeout(() => {
      returning.classList.remove('returning');
      isAnimating = false;
    }, 650);
  }

  // --- Scroll/wheel navigation ---

  let wheelAccumulator = 0;
  const WHEEL_THRESHOLD = 80;

  pagesContainer.addEventListener('wheel', (e) => {
    const activePage = pages[currentPage];
    if (!activePage) return;

    const atTop = activePage.scrollTop <= 0;
    const atBottom = activePage.scrollTop + activePage.clientHeight >= activePage.scrollHeight - 2;
    const hasScroll = activePage.scrollHeight > activePage.clientHeight + 2;

    if (hasScroll && !atTop && !atBottom) {
      wheelAccumulator = 0;
      return;
    }

    if ((e.deltaY > 0 && (atBottom || !hasScroll)) || (e.deltaY < 0 && atTop)) {
      e.preventDefault();
      wheelAccumulator += e.deltaY;

      if (wheelAccumulator > WHEEL_THRESHOLD) {
        wheelAccumulator = 0;
        goToNextPage();
      } else if (wheelAccumulator < -WHEEL_THRESHOLD) {
        wheelAccumulator = 0;
        goToPrevPage();
      }
    } else {
      wheelAccumulator = 0;
    }
  }, { passive: false });

  // --- Button navigation ---
  if (prevBtn) prevBtn.addEventListener('click', goToPrevPage);
  if (nextBtn) nextBtn.addEventListener('click', goToNextPage);

  // --- Keyboard navigation ---
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      const activePage = pages[currentPage];
      const atBottom = !activePage || activePage.scrollTop + activePage.clientHeight >= activePage.scrollHeight - 2;
      const hasScroll = activePage && activePage.scrollHeight > activePage.clientHeight + 2;

      if (atBottom || !hasScroll) {
        e.preventDefault();
        goToNextPage();
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      const activePage = pages[currentPage];
      const atTop = !activePage || activePage.scrollTop <= 0;

      if (atTop) {
        e.preventDefault();
        goToPrevPage();
      }
    }
  });

  // --- Touch / swipe navigation ---
  let touchStartY = 0;
  let touchStartX = 0;

  pagesContainer.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  pagesContainer.addEventListener('touchend', (e) => {
    const deltaY = touchStartY - e.changedTouches[0].clientY;
    const deltaX = touchStartX - e.changedTouches[0].clientX;

    if (Math.abs(deltaY) < 50 || Math.abs(deltaX) > Math.abs(deltaY)) return;

    const activePage = pages[currentPage];
    const atTop = activePage.scrollTop <= 0;
    const atBottom = activePage.scrollTop + activePage.clientHeight >= activePage.scrollHeight - 2;

    if (deltaY > 0 && atBottom) {
      goToNextPage();
    } else if (deltaY < 0 && atTop) {
      goToPrevPage();
    }
  }, { passive: true });
});
