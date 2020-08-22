import Accordion from './modules/accordion';

function FaqsAccordion(element: HTMLElement) {
  function init() {
    const accordion = Accordion(element, 'accordion');

    accordion.init();
  }

  return {
    init
  }
}

export default FaqsAccordion;
