module.exports = {
    "extends": "airbnb",
    "installedESLint": true,
    "plugins": [
      "react"
    ],
    "rules": {
      "import/no-extraneous-dependencies": [2, { devDependencies: true }]
    }
};
