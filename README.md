# cli-css-modules
=======
# dojo-cli-css-modules

<!-- TODO: change and uncomment
[![Build Status](https://travis-ci.org/dojo/cli-build.svg?branch=master)](https://travis-ci.org/dojo/cli-build)
[![codecov](https://codecov.io/gh/dojo/cli-build/branch/master/graph/badge.svg)](https://codecov.io/gh/dojo/cli-build)
[![npm version](https://badge.fury.io/js/dojo-cli-build.svg)](http://badge.fury.io/js/dojo-cli-build)
-->

Compile [CSS modules](https://github.com/css-modules/css-modules) using the [dojo cli](http://github.com/dojo/cli).
g
## Features

Pass a file glob to match CSS files to compile, outputting compiles CSS modules and [TypeScript](https://www.typescriptlang.org/) modules containing a map of local CSS classnames to generated classnames.

## How do I use this package?

1. `npm install -g dojo-cli`
2. `npm install -g dojo-cli-css-modules`
3. `dojo css modules -cssOut . -tsOut . css/*.css`

## How do I contribute?

We appreciate your interest!  Please see the [Dojo 2 Meta Repository](https://github.com/dojo/meta#readme) for the
Contributing Guidelines and Style Guide.

## Testing

Test cases MUST be written using [Intern](https://theintern.github.io) using the Object test interface and Assert assertion interface.

90% branch coverage MUST be provided for all code submitted to this repository, as reported by istanbul’s combined coverage results for all supported platforms.

To test locally in node run:

`grunt test`

## Licensing information

* [postcss](https://github.com/postcss/postcss) ([MIT](https://github.com/postcss/postcss/blob/master/LICENSE))
* [postcss-modules](https://github.com/css-modules/postcss-modules/blob/master/LICENSE) ([MIT](https://github.com/css-modules/postcss-modules/blob/master/LICENSE))
* [globby](https://github.com/sindresorhus/globby) ([MIT](https://github.com/sindresorhus/globby/blob/master/license))
* [async](https://github.com/caolan/async/) ([Custom](https://github.com/caolan/async/blob/master/LICENSE))
* [mkdirp](https://github.com/substack/node-mkdirp) ([MIT](https://github.com/substack/node-mkdirp/blob/master/LICENSE))
* [chalk](https://github.com/chalk/chalk) ([MIT](https://github.com/chalk/chalk/blob/master/license))

© 2004–2016 Dojo Foundation & contributors. [New BSD](http://opensource.org/licenses/BSD-3-Clause) license.
