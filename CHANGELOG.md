## [5.0.4](https://github.com/jamesfer/cypher-query-builder/compare/v5.0.3...v5.0.4) (2019-12-23)


### Bug Fixes

* **Transformer:** handle undefined values better ([b819b9a](https://github.com/jamesfer/cypher-query-builder/commit/b819b9a1c9028fce4a11e0086b90617cae2fbf71)), closes [/github.com/neo4j/neo4j-javascript-driver/blob/4.0/types/spatial-types.d.ts#L27](https://github.com//github.com/neo4j/neo4j-javascript-driver/blob/4.0/types/spatial-types.d.ts/issues/L27)

## [5.0.3](https://github.com/jamesfer/cypher-query-builder/compare/v5.0.2...v5.0.3) (2019-12-16)


### Bug Fixes

* update package versions in lockfile ([2d8534e](https://github.com/jamesfer/cypher-query-builder/commit/2d8534ebf8b1f20cdb4a75fc542c592dd27cd9da))

## [5.0.2](https://github.com/jamesfer/cypher-query-builder/compare/v5.0.1...v5.0.2) (2019-12-16)


### Bug Fixes

* remove rimraf dependency ([e2aa8f3](https://github.com/jamesfer/cypher-query-builder/commit/e2aa8f336f2aee5f4d58864612bb66f71ed0890e))
* update any-observable ([c5cb388](https://github.com/jamesfer/cypher-query-builder/commit/c5cb3885e573ded3b4d4e8776bef0f41a33c79ed))
* update lodash version in package.json ([67e71c4](https://github.com/jamesfer/cypher-query-builder/commit/67e71c429cefcedae08f09323c4edde25d646640))
* update typedoc dependency ([f4bde55](https://github.com/jamesfer/cypher-query-builder/commit/f4bde5546dfafa575f499fb5feb524cb5696ecc3))

## [5.0.1](https://github.com/jamesfer/cypher-query-builder/compare/v5.0.0...v5.0.1) (2019-12-08)


### Bug Fixes

* export builder, clause and clause collection ([6dde494](https://github.com/jamesfer/cypher-query-builder/commit/6dde494)), closes [#116](https://github.com/jamesfer/cypher-query-builder/issues/116)

# [5.0.0](https://github.com/jamesfer/cypher-query-builder/compare/v4.4.0...v5.0.0) (2019-09-21)


### Bug Fixes

* **Set:** replace override option with merge ([91ab4f6](https://github.com/jamesfer/cypher-query-builder/commit/91ab4f6))
* make error handling more consistent ([56a7591](https://github.com/jamesfer/cypher-query-builder/commit/56a7591))


### BREAKING CHANGES

* The run and stream methods of the Connection and Query classes no longer throw
exceptions. Instead they return a rejected promise or an observable that will immediately error.
* **Set:** The default behaviour of the Set clause has changed to use the `=` operator.
This is to be more consistent with cypher.

# [4.4.0](https://github.com/jamesfer/cypher-query-builder/compare/v4.3.1...v4.4.0) (2019-08-25)


### Features

* **create:** add unique option ([202bc4c](https://github.com/jamesfer/cypher-query-builder/commit/202bc4c)), closes [#105](https://github.com/jamesfer/cypher-query-builder/issues/105)
* **create:** add unique option ([39c860d](https://github.com/jamesfer/cypher-query-builder/commit/39c860d)), closes [#105](https://github.com/jamesfer/cypher-query-builder/issues/105)

## [4.3.1](https://github.com/jamesfer/cypher-query-builder/compare/v4.3.0...v4.3.1) (2019-08-25)


### Bug Fixes

* **return:** pass options from query interface to return clause ([f35ebda](https://github.com/jamesfer/cypher-query-builder/commit/f35ebda))

# [4.3.0](https://github.com/jamesfer/cypher-query-builder/compare/v4.2.0...v4.3.0) (2019-08-25)


### Features

* **return:** add distinct option ([205960a](https://github.com/jamesfer/cypher-query-builder/commit/205960a)), closes [#90](https://github.com/jamesfer/cypher-query-builder/issues/90)

# [4.2.0](https://github.com/jamesfer/cypher-query-builder/compare/v4.1.0...v4.2.0) (2019-08-06)


### Features

* **Where:** allow RegExp objects directly in where clause ([595b6a9](https://github.com/jamesfer/cypher-query-builder/commit/595b6a9)), closes [#13](https://github.com/jamesfer/cypher-query-builder/issues/13)

# [4.1.0](https://github.com/jamesfer/cypher-query-builder/compare/v4.0.2...v4.1.0) (2019-07-16)


### Features

* **Union:** create union clause ([7e3b7c8](https://github.com/jamesfer/cypher-query-builder/commit/7e3b7c8))

## [4.0.2](https://github.com/jamesfer/cypher-query-builder/compare/v4.0.1...v4.0.2) (2019-07-16)


### Bug Fixes

* update lodash version ([8e9687f](https://github.com/jamesfer/cypher-query-builder/commit/8e9687f))

## [4.0.1](https://github.com/jamesfer/cypher-query-builder/compare/v4.0.0...v4.0.1) (2019-06-25)


### Bug Fixes

* update code style and test errors ([1b94118](https://github.com/jamesfer/cypher-query-builder/commit/1b94118))

# [4.0.0](https://github.com/jamesfer/cypher-query-builder/compare/v3.8.5...v4.0.0) (2019-06-25)


### Bug Fixes

* remove unused rxjs peer dependency ([ae0c95d](https://github.com/jamesfer/cypher-query-builder/commit/ae0c95d))
* **Delete:** change the default behaviour of delete clause not to use detach ([9f367c7](https://github.com/jamesfer/cypher-query-builder/commit/9f367c7))
* **Limit:** use a parameter for limit number ([025c873](https://github.com/jamesfer/cypher-query-builder/commit/025c873))
* **Skip:** use a parameter in skip number ([7f6360c](https://github.com/jamesfer/cypher-query-builder/commit/7f6360c))
* **Skip, Limit:** make skip and limit only accept number amounts ([cfb62c3](https://github.com/jamesfer/cypher-query-builder/commit/cfb62c3))


### BREAKING CHANGES

* **Skip, Limit:** The type of skip and limit clauses no longer accept a string. This will only effect
typescript users, there is no breaking change for javascript users.
* **Delete:** The `.delete` method now uses `detach: false` by default meaning that it will
become a plain old `DELETE` clause in cypher. To retain the previous behaviour of becoming a `DETACH
DELETE` clause by default, use the `.detachDelete` method instead.
* **Skip:** A string expression as the skip number is no longer accepted. The argument must be
a number.
* **Limit:** A string expression as the limit number is no longer accepted. The argument must be
a number.

## [3.8.5](https://github.com/jamesfer/cypher-query-builder/compare/v3.8.4...v3.8.5) (2018-11-15)


### Bug Fixes

* tell rollup to output external modules with node style paths ([248f039](https://github.com/jamesfer/cypher-query-builder/commit/248f039)), closes [#68](https://github.com/jamesfer/cypher-query-builder/issues/68)

## [3.8.4](https://github.com/jamesfer/cypher-query-builder/compare/v3.8.3...v3.8.4) (2018-11-06)


### Bug Fixes

* fix conflicting any promise types ([13a9eff](https://github.com/jamesfer/cypher-query-builder/commit/13a9eff))

## [3.8.3](https://github.com/jamesfer/cypher-query-builder/compare/v3.8.2...v3.8.3) (2018-11-04)


### Bug Fixes

* fix generated references to lodash types ([9b27bab](https://github.com/jamesfer/cypher-query-builder/commit/9b27bab))

## [3.8.2](https://github.com/jamesfer/cypher-query-builder/compare/v3.8.1...v3.8.2) (2018-11-03)


### Bug Fixes

* fix how rollup was emitting imports ([110a022](https://github.com/jamesfer/cypher-query-builder/commit/110a022))

## [3.8.1](https://github.com/jamesfer/cypher-query-builder.git/compare/v3.8.0...v3.8.1) (2018-11-03)


### Bug Fixes

* **Where:** bind where clause parameters during build ([bf0d4c2](https://github.com/jamesfer/cypher-query-builder.git/commit/bf0d4c2))

# [3.8.0](https://github.com/jamesfer/cypher-query-builder/compare/v3.7.0...v3.8.0) (2018-10-31)


### Features

* **Remove:** create remove clause ([9d600b6](https://github.com/jamesfer/cypher-query-builder/commit/9d600b6))

# [3.7.0](https://github.com/jamesfer/cypher-query-builder/compare/v3.6.0...v3.7.0) (2018-09-28)


### Bug Fixes

* **Query:** ensure Query.run doesn't throw synchronously ([feebde0](https://github.com/jamesfer/cypher-query-builder/commit/feebde0))


### Features

* support registering observables using any-observable ([57b2089](https://github.com/jamesfer/cypher-query-builder/commit/57b2089))
* support registering promises using any-promise ([5284e6d](https://github.com/jamesfer/cypher-query-builder/commit/5284e6d))

# [3.6.0](https://github.com/jamesfer/cypher-query-builder/compare/v3.5.5...v3.6.0) (2018-09-27)


### Features

* **Connection:** accept neo4j driver options in connection constructor ([d76d65a](https://github.com/jamesfer/cypher-query-builder/commit/d76d65a))

## [3.5.5](https://github.com/jamesfer/cypher-query-builder/compare/v3.5.4...v3.5.5) (2018-08-14)


### Bug Fixes

* **Where:** remove side effects from build ([f664ebe](https://github.com/jamesfer/cypher-query-builder/commit/f664ebe)), closes [#42](https://github.com/jamesfer/cypher-query-builder/issues/42)

## [3.5.4](https://github.com/jamesfer/cypher-query-builder/compare/v3.5.3...v3.5.4) (2018-08-14)


### Bug Fixes

* **OrderBy:** accept direction case-insensitively ([728497d](https://github.com/jamesfer/cypher-query-builder/commit/728497d))

## [3.5.3](https://github.com/jamesfer/cypher-query-builder/compare/v3.5.2...v3.5.3) (2018-08-13)


### Bug Fixes

* **Clause:** match whole variable when inlining using interpolate ([d0588aa](https://github.com/jamesfer/cypher-query-builder/commit/d0588aa))

## [3.5.2](https://github.com/jamesfer/cypher-query-builder/compare/v3.5.1...v3.5.2) (2018-08-13)


### Bug Fixes

* **Where:** make WhereOp class abstract ([5ccd199](https://github.com/jamesfer/cypher-query-builder/commit/5ccd199))

## [3.5.1](https://github.com/jamesfer/cypher-query-builder/compare/v3.5.0...v3.5.1) (2018-07-08)


### Bug Fixes

* **Set:** Only use += in Set when value is an object ([c61a37f](https://github.com/jamesfer/cypher-query-builder/commit/c61a37f))

# [3.5.0](https://github.com/jamesfer/cypher-query-builder/compare/v3.4.1...v3.5.0) (2018-06-18)


### Bug Fixes

* **OrderBy:** remove deprecation notice about old constraint style ([2c35ac9](https://github.com/jamesfer/cypher-query-builder/commit/2c35ac9))


### Features

* **OrderBy:** add new order by constraint style ([2324831](https://github.com/jamesfer/cypher-query-builder/commit/2324831)), closes [#9](https://github.com/jamesfer/cypher-query-builder/issues/9)
