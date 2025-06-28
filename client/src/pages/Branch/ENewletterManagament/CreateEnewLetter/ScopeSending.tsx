import { WorkspaceContext } from 'context/workspace.context'
import { observer } from 'mobx-react'
import { useContext } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const ScopeSending = () => {
  const { t } = useTranslation()

  const { watch, control, setValue, getValues, reset } = useFormContext()

  const scope = watch('sendTo')
  const { user } = useContext(WorkspaceContext)
  return (
    <div
      className="gap-4"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
      }}
    ></div>
  )
}
export default observer(ScopeSending)
