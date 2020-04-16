function swRegister() {
  function init() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(error => console.log(error));
    }
  }

  return {
    init
  }
}

export default swRegister;
