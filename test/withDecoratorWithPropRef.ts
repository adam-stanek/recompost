import { createComposer, ComponentDecorator } from 'recompost'

declare function withSalutation<TProps extends {}>(
  salutationFromProps: (props: TProps) => string,
): ComponentDecorator<TProps, { salutation: string }>

createComposer<{ name: string }>()
  .withDecorator(
    withSalutation(({ name, ...props }) => {
      // $ExpectType string
      name
      // $ExpectType {}
      props
      return `Hello ${name}`
    }),
  )
  .build()
