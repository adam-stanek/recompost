# 1.3.0 (June 18, 2018)

- Fixed exported type to work properly in JSX with new React typings

# 1.2.1 (June 8, 2018)

- Fixed `onlyUpdateForProps` binding

# 1.2.0 (June 7, 2018)

\* Simplified typings for ComponentDecorator (now inherits from
AbstractComponentDecorator and GenericComponentDecorator). This should help in
TS to infer generics in some edge cases.

- `withDecorator`: Fixed for generics in resulting props (see
  `tests/withDecoratorResultGenerics`)
- Added `withStatic`

# 1.1.0 (May 6, 2018)

- Added CHANGELOG :)
- Added `withDisplayName()`
- Added `componentDidCatch` support for `withLifecycle()`

# 1.0.4, 1.0.5 (May 6, 2018)

- Internal builds covering packaging issues (`.npmignore`)

# 1.0.3 (May 6, 2018)

- Improved typing of `withDecorator` so that it takes into account prop types in
  passed parameters.

# 1.0.2 (April 18, 2018)

- Fixed issue with `withDecorator` typings when explicit typing of decorator to
  `any` could break typings on whole chain.

# 1.0.1 (April 18, 2018)

- Switched build to ES5 target for legacy project support.

# 1.0.0 (April 11, 2018)

- Initial release
