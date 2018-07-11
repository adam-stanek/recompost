import { createComposer } from 'recompost'

interface MyContext {
  bar: boolean
}

const enhance = createComposer<{ foo: string }>()
  .withPropFromContext('test', (test: MyContext) => ({ bar: test.bar }))
  .build()

enhance(props => {
  // $ExpectType string
  props.foo

  // $ExpectType boolean
  props.bar

  return null
})
