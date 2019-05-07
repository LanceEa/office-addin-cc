console.log('Simple Web Worker has started!');

self.addEventListener('message', event => {
  console.log(`Worker received ${event.data}`);

  self.postMessage(`beep boop beep --> ${event.data} --> boop beep boop`);
});
