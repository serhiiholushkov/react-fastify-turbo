import { Button } from '@repo/ui/components/button'
import { memo, type PropsWithChildren } from 'react'

type Props = PropsWithChildren & {
  title: string
  onReset: () => void
}

const Child = memo(function Child({ title, children, onReset }: Props) {
  'use no memo'
  console.log('ChildAffected component rendered')

  return (
    <div>
      <h1>{title}</h1>
      {children}
      <Button onClick={onReset}>Reset input</Button>
    </div>
  )
})

export { Child }
