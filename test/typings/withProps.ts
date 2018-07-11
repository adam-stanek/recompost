import { createComposer } from 'recompost'

const enhance = createComposer<{ foo: string; optionalFlag?: boolean }>()
  .withProps(prevProps => {
    // $ExpectType string
    prevProps.foo

    return {
      bar: true,
    }
  })
  .build()

enhance(({ children, ...props }) => {
  // The optionality of the `optionalFlag?` must be preserved
  // $ExpectType { foo: string; optionalFlag?: boolean | undefined; bar: boolean; }
  props

  return null
})
