import { createComposer } from 'recompost'

const enhance = createComposer<{ foo?: string | boolean }>()
  .withDefaultProps({
    foo: 'DEFAULT',
  })
  .build()

enhance(({ children, ...props }) => {
  // The optionality of the prop must be removed
  // $ExpectType { foo: string | boolean; }
  props

  return null
})
