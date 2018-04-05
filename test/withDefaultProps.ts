import { createComposer } from 'recompost'

const enhance = createComposer<{ foo?: string | number }>()
  .withDefaultProps({
    foo: 'DEFAULT',
  })
  .build()

enhance(({ children, ...props }) => {
  // The optionality of the prop must be removed
  // $ExpectType { foo: string | number; }
  props

  return null
})
