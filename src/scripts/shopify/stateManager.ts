import punSub from '../modules/pubSub';

function StateManager() {
  function variantChanged(variant: HTMLElement) {
    punSub.publish('variant/changed', variant);
  }

  function showKeyMapModal(target: HTMLButtonElement) {
    punSub.publish('show/key/map/modal', target);
  }

  function keyMapCreated(keyMapImage: string) {
    punSub.publish('key/map/created', keyMapImage);
  }

  return {
    variantChanged,
    showKeyMapModal,
    keyMapCreated
  }
}

export default StateManager();
