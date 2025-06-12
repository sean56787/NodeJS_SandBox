const refreshTokens = new Set();

module.exports = {
    add:(token) => refreshTokens.add(token),
    remove:(token) => refreshTokens.delete(token),
    exists:(token) => refreshTokens.has(token),
};