import Glide from '@glidejs/glide';

function GlideSliderModule(element: HTMLElement, options = {}) {
  const defaultOptions = {
    animationDuration: 700,
    animationTimingFunc: 'ease',
    dragThreshold: 130,
    gap: 20,
    keyboard: false
  };

  const mergedOptions = Object.assign({}, defaultOptions, options);
  const slider = new Glide(element, mergedOptions);

  function hideArrow(arrow: HTMLButtonElement) {
    arrow.classList.add('glide__arrow--hidden');
    arrow.setAttribute('aria-hidden', 'true');
    arrow.setAttribute('disbaled', '');
  }

  function showArrow(arrow: HTMLButtonElement) {
    arrow.classList.remove('glide__arrow--hidden');
    arrow.removeAttribute('aria-hidden');
    arrow.removeAttribute('disbaled');
  }

  function toggleVisibilityOfArrows(isStart: boolean, isEnd: boolean) {
    const previousArrow = element.querySelector('[data-glide-dir="<"]') as HTMLButtonElement;
    const nextArrow = element.querySelector('[data-glide-dir=">"]') as HTMLButtonElement;

    if (isStart) {
      hideArrow(previousArrow);
      showArrow(nextArrow);
      return;
    }

    if (isEnd) {
      hideArrow(nextArrow);
      showArrow(previousArrow);
      return;
    }
  }

  function moveCarousel(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      slider.go('<');
    }

    if (event.key === 'ArrowRight') {
      slider.go('>');
    }
  }

  function enableKeyboard(event: FocusEvent) {
    const currentTarget = event.currentTarget as HTMLElement;

    if (currentTarget === document.activeElement) {
      currentTarget.addEventListener('keyup', moveCarousel);
    }
  }

  function preventBlur(event: Event) {
    const currentTarget = event.currentTarget as HTMLElement;

    currentTarget.focus();
  }

  function addArrowListeners(arrow: HTMLElement) {
    arrow.addEventListener('mouseup', preventBlur);
    arrow.addEventListener('touchend', preventBlur);
    arrow.addEventListener('focus', enableKeyboard);
  }

  function addEventListeners() {
    const arrows: Array<HTMLElement> = Array.from(element.querySelectorAll('[data-glide-dir]'));

    element.addEventListener('mouseup', preventBlur);
    element.addEventListener('touchend', preventBlur);
    element.addEventListener('focus', enableKeyboard);

    arrows.forEach(addArrowListeners);
  }

  function controls(Glide: Glide, Components: any, Events: any) {
    const isSliderType = Glide.isType('slider');

    function updateHeight() {
      Components.Html.track.style.height = `${Components.Html.slides[Glide.index].offsetHeight}px`;
    }

    function update() {
      const controls = element.querySelector('[data-glide-el="controls"]');
      const isStart = Components.Run.isStart();
      const isEnd = Components.Run.isEnd();

      if (controls) {
        toggleVisibilityOfArrows(isStart, isEnd);
      }

      updateHeight();
    }

    if (isSliderType) {
      Events.on('mount.after', updateHeight);
      Events.on('run', update);
    }

    return update;
  }

  function init() {
    slider.mount({ 'controls': controls });
    addEventListeners();
  }

  return {
    init,
    slider
  };
}

export default GlideSliderModule;
