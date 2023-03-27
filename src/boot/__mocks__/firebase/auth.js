export const initializeAuth = jest.fn();
export const browserLocalPersistence = jest.fn();
export const onAuthStateChanged = jest.fn();
export const signInAnonymously = jest
    .fn()
    .mockImplementation(() => Promise.resolve({ exists: jest.fn() }));
