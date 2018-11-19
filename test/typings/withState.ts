import { createComposer } from 'recompost'

const enhance = createComposer<{}>()
  .withState('isActive', 'setActive', false)
  .build()

enhance(props => {
  // $ExpectType boolean
  props.isActive

  // $ExpectType (updateFn: boolean | ((input: boolean) => boolean), callback?: (() => void) | undefined) => boolean
  props.setActive

  return null
})
