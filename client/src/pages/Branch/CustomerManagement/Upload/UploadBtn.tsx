import { clsx } from 'clsx'
import { useRef } from 'react'
import { DropTargetMonitor, useDrop } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'
import { useTranslation } from 'react-i18next'

export interface IUploadBtnProps {
  file?: File
  multiple?: boolean
  accept?: string
  onChange?: (file?: File) => void
  status?: any
  disabled?: boolean
}
const UploadBtn = ({ file, accept, disabled, onChange }: IUploadBtnProps) => {
  const inputFileRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation()

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop: (item: { files: FileList }) => {
        if (!disabled) onChange(item.files?.[0])
      },
      collect: (monitor: DropTargetMonitor) => {
        return {
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        }
      },
    }),
    []
  )
  const isActive = canDrop && isOver
  return (
    <div
      ref={drop}
      className={clsx('', {
        'bg-primary-50': isActive,
      })}
      onClick={() => (disabled ? null : inputFileRef.current?.click())}
    >
      <div
        className={clsx(
          'border-round-lg bg-white  flex flex-column align-items-center justify-content-center relative '
        )}
      >
        <div
          className={clsx(
            'bg-grey-50 w-full flex flex-column  justify-content-center align-items-center py-3 cursor-pointer',
            file ? 'gap-1  text-grey-600' : 'gap-4'
          )}
        >
          {
            <>
              <i className=" isax-document-upload" style={{ fontSize: 56 }}></i>
              <span className=""> {t('Drag file here or Browser')} </span>
              {/* <div className="text-secondary font-medium text-primary font-semibold">
                {t('Browser')}
              </div> */}
            </>
          }
        </div>
      </div>
      <input
        ref={inputFileRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={false}
        onChange={(e) => {
          onChange(e.target.files?.[0])
          inputFileRef.current.value = null
        }}
      />
    </div>
  )
}
export default UploadBtn
