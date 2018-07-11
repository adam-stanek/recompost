import * as React from 'react'
import { createComposer } from 'recompost'

interface MyContextPayload {
  bar: boolean
}

const MyContext = React.createContext<MyContextPayload>({ bar: false })

const enhance = createComposer<{ foo: string }>()
  .withPropFromContext(MyContext, (ctx, props) => {
    // $ExpectType string
    props.foo

    // $ExpectType MyContextPayload
    ctx

    return { bar: ctx.bar }
  })
  .build()

enhance(props => {
  // $ExpectType string
  props.foo

  // $ExpectType boolean
  props.bar

  return null
})
