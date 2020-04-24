let subscribers: Array<any> = [];

const pubSub = {
  publish(event: any, data: any) {
    if (!subscribers[event]) return;

    subscribers[event].forEach((subscriberCallback: Function) => subscriberCallback(data));
  },

  subscribe(event: any, callback: Function) {
    let index: number;

    if (!subscribers[event]) {
      subscribers[event] = [];
    }

    index = subscribers[event].push(callback) - 1;

    return {
      unsubscribe() {
        subscribers[event].splice(index, 1);
      }
    };
  }
};

export default pubSub;
