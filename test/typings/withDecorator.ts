import { createComposer, ComponentDecorator } from 'recompost'

declare const customDecorator: ComponentDecorator<
  { a: number; b: number },
  { result: number },
  'a' | 'b'
>

const enhance = createComposer<{
  a: number
  b: number
  someOtherProp: boolean
}>()
  .withDecorator(customDecorator)
  .build()

enhance(({ children, ...props }) => {
  // $ExpectType { someOtherProp: boolean; result: number; }
  props

  return null
})

// The decorator uses both props `a` and `b`, but it is applied on component which only
// declares `b`. This should cause an error.
createComposer<{ a: number }>()
  // $ExpectError Type 'DecoratedSFC<{ a: number; b: number; }>' provides no match for the signature 'new (props: { a: number; }, context?: any): Component<any, any, never>'.
  .withDecorator(customDecorator)
  .build()
