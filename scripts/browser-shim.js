export const process = {
    env: { NODE_ENV: "production" },
    cwd: () => "/",
    platform: "browser",
};

export const Buffer = {
    from: (str, encoding) => new TextEncoder().encode(str),
    isBuffer: (obj) => false,
};
