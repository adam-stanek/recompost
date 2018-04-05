import { createComposer } from 'recompost'

const enhance = createComposer<{}>()
  .withState('isActive', 'setActive', false)
  .build()

enhance(props => {
  // $ExpectType boolean
  props.isActive

  // $ExpectType (newState: boolean) => boolean
  props.setActive

  return null
})
