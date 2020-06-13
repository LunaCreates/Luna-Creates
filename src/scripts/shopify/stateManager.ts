import punSub from '../modules/pubSub';
// import shopify from '../modules/shopify';

function StateManager() {
  function variantChanged(variant: HTMLElement) {
    punSub.publish('variant/changed', variant);
  }

  function showKeyMapModal() {
    punSub.publish('show/key/map/modal', true);
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
