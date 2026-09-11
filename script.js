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
  bg.defaultMuted = true;
  bg.volume = 0;
  bg.removeAttribute('controls');
  fg.muted = true;
  fg.defaultMuted = true;
  fg.volume = 0;

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

  fg.addEventListener('volumechange', () => {
    bg.muted = true;
    bg.defaultMuted = true;
    bg.volume = 0;
    fg.muted = true;
    fg.defaultMuted = true;
    fg.volume = 0;
  });
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


// Final Music Project preview button.
document.querySelectorAll('[data-preview-audio]').forEach((button) => {
  const audio = document.getElementById(button.dataset.previewAudio);
  if (!audio) return;

  const updateLabel = () => {
    const playing = !audio.paused && !audio.ended;
    button.textContent = playing ? 'Pause Preview' : 'Preview Song';
    button.setAttribute('aria-pressed', String(playing));
  };

  button.addEventListener('click', () => {
    document.querySelectorAll('audio').forEach((other) => {
      if (other !== audio) other.pause();
    });
    if (audio.paused || audio.ended) {
      if (audio.ended) audio.currentTime = 0;
      const p = audio.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } else {
      audio.pause();
    }
  });

  audio.addEventListener('play', updateLabel);
  audio.addEventListener('pause', updateLabel);
  audio.addEventListener('ended', updateLabel);
});


// Enlightment Project: the WAV player is slide 1 and the Ableton arrangement image is slide 2.
document.querySelectorAll('[data-enlightment-showcase]').forEach((showcase) => {
  const audioSlide = showcase.querySelector('[data-enlightment-slide="audio"]');
  const compositionSlide = showcase.querySelector('[data-enlightment-slide="composition"]');
  const nextButton = showcase.querySelector('[data-enlightment-next]');
  const prevButton = showcase.querySelector('[data-enlightment-prev]');
  const caption = showcase.querySelector('[data-enlightment-caption]');

  if (!audioSlide || !compositionSlide) return;

  const showAudio = () => {
    audioSlide.classList.add('is-active');
    audioSlide.setAttribute('aria-hidden', 'false');
    compositionSlide.classList.remove('is-active');
    compositionSlide.setAttribute('aria-hidden', 'true');
    if (caption) {
      caption.textContent = 'Original composition created from scratch in Ableton Live 12 for the Enlightment Project.';
    }
  };

  const showComposition = () => {
    audioSlide.classList.remove('is-active');
    audioSlide.setAttribute('aria-hidden', 'true');
    compositionSlide.classList.add('is-active');
    compositionSlide.setAttribute('aria-hidden', 'false');
    if (caption) {
      caption.textContent = 'Ableton Live 12 arrangement view from the finished Enlightment Project.';
    }
  };

  if (nextButton) nextButton.addEventListener('click', showComposition);
  if (prevButton) prevButton.addEventListener('click', showAudio);

  showAudio();
});
