Recompost

Typed binding for `recompose`/`recompact` functions with
[fluent interface](https://en.wikipedia.org/wiki/Fluent_interface) builder
pattern.

# Why?

React HoCs are quite common in todays projects, but Typescript at it's current
version (2.8) struggles with inferring generics with variadic arguments (the
`compose()` function). You can learn more about this problematic in
[issue 5453](https://github.com/Microsoft/TypeScript/issues/5453)).

This library was build as a workaround to cover the gap before TS catches up. It
doesn't provide any additional functionality to `recompose` but offers
alternative way of specifying component composition which allows TS to correctly
infer types and avoid messing your code with `<any>` or unnecessary interfaces.

Example usage:

```.ts
import * as React from 'react'
import { createBuilder } from 'recompost'

export interface MyComponentProps {
  name: string
}

const enhance = createComposer<MyComponentProps>()
  .withPropsOnChange(['name'], ({ name }) => ({ salutation: `Hey ${name}!` }))
  .withHandler('handleClick', ({ salutation }) => (e: React.MouseEvent<any>) => {
    e.preventDefault()
    console.log(salutation)
  })
  .build()

export const MyComponent = enhance({
  salutation,
  handleClick
}) => (
  <a href="#" onClick={handleClick}>{salutation}</a>
)
```
