import { DEFAULt_ERROR_MESSAGE, getErrorMessage, log } from '@/lib/utils';
import { constructSearchParams } from '@/lib/utils';

describe('getErrorMessage', () => {
  it('should return default message when error is undefined', () => {
    const result = getErrorMessage(undefined);
    expect(result).toBe(DEFAULt_ERROR_MESSAGE);
  });

  it('should return default message when error is null', () => {
    const result = getErrorMessage(null);
    expect(result).toBe(DEFAULt_ERROR_MESSAGE);
  });

  it('should return error message when error is an instance of Error ', () => {
    const error = new Error('Test error message');
    const result = getErrorMessage(error);
    expect(result).toBe('Test error message');
  });

  it('should return default message when error is not an instance of Error', () => {
    const error = 1;
    const result = getErrorMessage(error);
    expect(result).toBe(DEFAULt_ERROR_MESSAGE);
  });
});

describe('log', () => {
  const originalConsoleLog = console.log;
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    console.log = jest.fn(); // mock console.log
  });

  afterEach(() => {
    console.log = originalConsoleLog; // restore console.log
    process.env.NODE_ENV = originalEnv; // restore NODE_ENV
  });

  test('should log message when IS_DEVELOPMENT is true', () => {
    process.env.NODE_ENV = 'development';
    log('Test message', 'extra param');
    expect(console.log).toHaveBeenCalledWith('Test message', 'extra param');
  });

  test('should not log message when IS_DEVELOPMENT is false', () => {
    process.env.NODE_ENV = 'production';
    log('Test message', 'extra param');
    expect(console.log).not.toHaveBeenCalled();
  });
});

describe('constructSearchParams', () => {
  it('should construct a query string from valid key-value pairs', () => {
    const params = {
      name: 'John Doe',
      age: 30,
    };
    const result = constructSearchParams(params);
    expect(result).toBe('?name=John%20Doe&age=30');
  });

  it('should ignore keys with undefined or null values', () => {
    const params = {
      name: 'John Doe',
      age: undefined,
      city: null,
    };
    const result = constructSearchParams(params);
    expect(result).toBe('?name=John%20Doe&age=&city=');
  });

  it('should return an empty string if all values are undefined or null', () => {
    const params = {
      name: undefined,
      age: null,
    };
    const result = constructSearchParams(params);
    expect(result).toBe('?name=&age=');
  });

  it('should handle empty params and return just a "?"', () => {
    const params = {};
    const result = constructSearchParams(params);
    expect(result).toBe('?');
  });
});
