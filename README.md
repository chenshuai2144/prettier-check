# prettier-check

> check that all files match [prettier](Check that all files match prettier code style.) code style.

> ps: because I want to use the configuration, so I wrote this library. If you want to use the command line, you should use [check-prettier](https://github.com/hexacta/prettier-check#readme)

## Install

`$ npm install --save-dev prettier check-prettier`

## Usage

package.json adds checkFiles attribute

```json
...
 "checkFiles":[
    "src/**/*.js*",
    "src/**/*.ts*",
    "src/**/*.less",
    "config/**/*.js*",
    "scripts/**/*.js"
  ],
...
```

Add a script

```json
"scripts": {
    "lint-prettier": "check-prettier"
},
```
