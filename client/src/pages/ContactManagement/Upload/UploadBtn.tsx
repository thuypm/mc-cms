import { clsx } from 'clsx'
import { useEffect, useRef } from 'react'
import { DropTargetMonitor, useDrop } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'
import { useTranslation } from 'react-i18next'
import { FileUploadStatus } from './enum'

export interface IUploadBtnProps {
  files?: Array<any>
  multiple?: boolean
  accept?: string
  onChange?: (files?: FileList) => void
  status?: FileUploadStatus
}
const UploadBtn = ({
  files,
  multiple = true,
  accept,
  onChange,
}: IUploadBtnProps) => {
  const inputFileRef = useRef<HTMLInputElement>(null)
  const onChangeRef = useRef((files) => {})
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop: (item: { files: FileList }) => {
        onChangeRef.current(item.files)
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
  const { t } = useTranslation()
  return (
    <div
      ref={drop}
      className={clsx(
        'w-full border border-dashed border-gray-300 border-round p-2 w-10rem h-fit',
        {
          'bg-primary-50': isActive,
        }
      )}
      onClick={() => inputFileRef.current?.click()}
    >
      <div
        className={clsx(
          'text-sm bg-gray-50 w-full flex flex-column justify-content-center align-items-center  py-3 cursor-pointer gap-2'
        )}
      >
        <i className="isax-document-upload"></i>

        <span>{t('Upload')}</span>
      </div>
      <input
        ref={inputFileRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          onChangeRef.current && onChangeRef.current(e.target.files)
          inputFileRef.current.value = null
        }}
      />
    </div>
  )
}
export default UploadBtn
