import { createComposer, ComponentDecorator } from 'recompost'

declare const customDecorator: ComponentDecorator<
  { a: number; b: number },
  { result: number },
  'a' | 'b'
>

const enhance = createComposer<{ a: number; b: number }>()
  .withDecorator(customDecorator)
  .build()

enhance(({ children, ...props }) => {
  // $ExpectType { result: number; }
  props

  return null
})
