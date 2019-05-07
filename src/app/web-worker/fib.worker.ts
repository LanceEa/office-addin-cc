/// <reference lib="webworker" />
console.log('Fibonacci Web worker is runnning!');

self.addEventListener('message', (event: MessageEvent) => {
  const action = JSON.parse(event.data);

  if (action.type !== 'FIB_REQUEST') {
    console.log('ignoring because I do not understand you!');
  }

  const result = fib(action.value);
  const resultMessage = JSON.stringify({
    type: 'FIB_RESULT',
    value: result
  });

  postMessage(resultMessage);
});

function fib(n: number): number {
  if (n <= 1) {
    return 1;
  }

  return fib(n - 1) + fib(n - 2);
}
