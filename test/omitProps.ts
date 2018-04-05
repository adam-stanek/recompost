import { createComposer } from 'recompost'

const enhance = createComposer<{ foo: string; bar: number }>()
  .omitProps('bar')
  .build()

enhance(({ children, ...props }) => {
  // $ExpectType { foo: string; }
  props

  return null
})
