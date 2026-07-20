import { useCallback, useMemo, useState } from 'react'
import { Field, FieldLabel, FieldDescription, Input } from '@repo/ui'
import { Child } from './child'

const Parent = () => {
  'use no memo'
  // ^^^ disable react compiler for this component that is set in vite config by reactCompilerPreset()
  const [value, setValue] = useState<string>('')

  const childTitle = useMemo(() => 'Affected Child Component', [])

  const childContent = useMemo(
    () => <p>This is a child component affected by state changes.</p>,
    [],
  )

  // Without useCallback, this would be a brand new function reference on
  // every Parent render (e.g. each keystroke updating `value`), which would
  // defeat memo(Child) since the `onReset` prop would never be equal.
  const handleReset = useCallback(() => {
    setValue('')
  }, [])

  console.log('Parent rendered')

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <Field>
          <FieldLabel htmlFor="memo-input">Some input</FieldLabel>
          <Input
            id="memo-input"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="without memo will trigger all components to re-render"
          />
          <FieldDescription>
            Will cause the other child components of state component to
            re-render.
          </FieldDescription>
        </Field>
      </div>
      <div>
        <Child title={childTitle} onReset={handleReset}>
          {childContent}
        </Child>
      </div>
    </div>
  )
}

export { Parent }
