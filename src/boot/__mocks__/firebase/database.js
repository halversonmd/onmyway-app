export const getDatabase = jest.fn();
export const ref = jest.fn();
export const child = jest.fn();
export const get = jest
    .fn()
    .mockImplementation(() => Promise.resolve({ exists: jest.fn() }));
