import { createComposer } from 'recompost'

const enhance = createComposer<{ foo: string }>()
  .withHandler('handleClick', props => (e: MouseEvent) => {
    // $ExpectType string
    props.foo
  })
  .build()

enhance(props => {
  // $ExpectType string
  props.foo

  // $ExpectType (e: MouseEvent) => void
  props.handleClick

  return null
})
