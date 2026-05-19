declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.webp';
declare module '*.svg';

// Crypto polyfill types
declare global {
  namespace NodeJS {
    interface Global {
      crypto: Crypto;
      Buffer: typeof Buffer;
    }
  }

  interface Crypto {
    getRandomValues<
      T extends Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Uint8ClampedArray,
    >(
      array: T,
    ): T;
  }
}

export {};
