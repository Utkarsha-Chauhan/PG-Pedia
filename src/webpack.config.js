const path = require('path');

module.exports = {
    // other webpack configurations...

    resolve: {
        fallback: {
            "url": require.resolve("http://localhost:5000")
        }
    }
};
