export const GLTFLoader = jest.fn().mockImplementation(() => {
    return {
        load: jest.fn().mockImplementation((file, callback) => {
            // return a mocked GLTF object
            const gltf = {
                scene: {},
                animations: [],
            };
            callback(gltf);
        }),
    };
});
