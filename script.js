(() => {
  const projects = Array.from(document.querySelectorAll('.project'));
  if (!projects.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    projects.forEach(project => project.classList.add('is-visible'));
    return;
  }

  projects.forEach(project => project.classList.add('scroll-fade'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    });
  }, {
    threshold: 0.18,
    rootMargin: '-5% 0px -12% 0px'
  });

  projects.forEach(project => observer.observe(project));
})();


// Keep the blurred Expansion background copy synchronized with the visible video.
document.querySelectorAll('.video-blur-stage').forEach((stage) => {
  const bg = stage.querySelector('.video-blur-bg');
  const fg = stage.querySelector('.video-blur-fg');
  if (!bg || !fg) return;

  bg.muted = true;
  bg.removeAttribute('controls');

  const syncTime = () => {
    if (Math.abs((bg.currentTime || 0) - (fg.currentTime || 0)) > 0.18) {
      try { bg.currentTime = fg.currentTime; } catch (e) {}
    }
  };

  fg.addEventListener('play', () => {
    syncTime();
    const p = bg.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  });

  fg.addEventListener('pause', () => bg.pause());
  fg.addEventListener('seeking', syncTime);
  fg.addEventListener('timeupdate', syncTime);
  fg.addEventListener('ended', () => {
    bg.pause();
    try { bg.currentTime = 0; } catch (e) {}
  });

  fg.addEventListener('volumechange', () => { bg.muted = true; });
});


// Play the Expansion project video at 5× speed.
document.querySelectorAll('.video-blur-stage').forEach((stage) => {
  const fg = stage.querySelector('.video-blur-fg');
  const bg = stage.querySelector('.video-blur-bg');

  if (fg) {
    fg.defaultPlaybackRate = 5;
    fg.playbackRate = 5;
    fg.addEventListener('loadedmetadata', () => {
      fg.defaultPlaybackRate = 5;
      fg.playbackRate = 5;
    });
    fg.addEventListener('ratechange', () => {
      if (fg.playbackRate !== 5) fg.playbackRate = 5;
    });
  }

  if (bg) {
    bg.defaultPlaybackRate = 5;
    bg.playbackRate = 5;
    bg.addEventListener('loadedmetadata', () => {
      bg.defaultPlaybackRate = 5;
      bg.playbackRate = 5;
    });
  }
});
