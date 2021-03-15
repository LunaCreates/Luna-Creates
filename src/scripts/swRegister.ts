function swRegister() {
  function init() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          // Successfully registered the Service Worker
          //console.log('Service Worker registration successful with scope: ', registration.scope);
        }).catch(err => {
          // Failed to register the Service Worker
          //console.log('Service Worker registration failed: ', err);
        });
      });
    }
  }

  return {
    init
  }
}

export default swRegister;
