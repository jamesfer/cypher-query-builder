declare module 'node-cleanup' {
  function cleanup(callback: () => void): void;
  export = cleanup;
}
