import { createComposer } from 'recompost'

const enhance = createComposer<{ foo: string }>()
  .withHandlers(initialProps => {
    // $ExpectType string
    initialProps.foo

    return {
      handleClick: props => (e: MouseEvent) => {
        // $ExpectType string
        props.foo
      },
      handleKeyPress: props => (e: KeyboardEvent) => {
        // $ExpectType string
        props.foo
      },
    }
  })
  .build()

enhance(props => {
  // $ExpectType string
  props.foo

  // $ExpectType (e: MouseEvent) => void
  props.handleClick

  // $ExpectType (e: KeyboardEvent) => void
  props.handleKeyPress

  return null
})
