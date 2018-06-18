import {
  createComposer,
  AbstractComponentDecorator,
  ComponentDecorator,
  GenericComponentDecorator,
} from 'recompost'

interface Item {
  foo: string
}

export interface WithProgressMapperOptions<TResultingProps> {
  /** Custom prop mapper */
  mapToProps?(item: Item): TResultingProps
}

declare function withProgress<TResultingProps extends {} = { item: Item }>(
  options?: WithProgressMapperOptions<TResultingProps>,
): ComponentDecorator<{}, TResultingProps>

const enhance = createComposer<{ a: number }>()
  .withDecorator(withProgress())
  .withPropsOnChange(['a'], ({ a }) => ({ b: a * 2 }))
  .build()

enhance(({ children, ...props }) => {
  // $ExpectType { a: number; item: Item; b: number; }
  props

  return null
})
