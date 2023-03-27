const data = {
    trackingHistory: { value: '{ "value": {"key": "value" }}' },
    returningUser: { value: true },
    userName: { value: '{ "value": {"key": "value" }}' },
};

export const Preferences = {
    get: jest.fn().mockImplementation(({ key }) => Promise.resolve(data[key])),
    set: jest.fn(),
    clear: jest.fn(),
};
