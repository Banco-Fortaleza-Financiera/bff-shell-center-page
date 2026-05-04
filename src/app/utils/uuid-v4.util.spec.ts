import { generateUuidV4 } from './uuid-v4.util';

describe('generateUuidV4', () => {
  const originalRandomUUID = crypto.randomUUID;
  const originalGetRandomValues = crypto.getRandomValues;

  afterEach(() => {
    Object.defineProperty(crypto, 'randomUUID', {
      configurable: true,
      value: originalRandomUUID,
    });
    Object.defineProperty(crypto, 'getRandomValues', {
      configurable: true,
      value: originalGetRandomValues,
    });
  });

  it('should use crypto.randomUUID when it is available', () => {
    Object.defineProperty(crypto, 'randomUUID', {
      configurable: true,
      value: jest.fn(() => 'uuid-from-browser'),
    });

    expect(generateUuidV4()).toBe('uuid-from-browser');
  });

  it('should generate a valid UUID v4 when randomUUID is not available', () => {
    Object.defineProperty(crypto, 'randomUUID', {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(crypto, 'getRandomValues', {
      configurable: true,
      value: jest.fn((array: Uint8Array) => {
        array[0] = 15;
        return array;
      }),
    });

    expect(generateUuidV4()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });
});
