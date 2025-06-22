import axios from 'axios'
import clsx from 'clsx'
import { t } from 'i18next'
import { ProgressBar } from 'primereact/progressbar'
import { ProgressSpinner } from 'primereact/progressspinner'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { LIST_ACCPET_IMAGE_TYPE, MAX_UPLOAD_SIZE } from 'utils/constants/file'
import { FileUploadStatus } from './enum'
import { FileView } from './interface'
import { uploadImage } from './requestUpload'

const type = 'DraggableItem'
interface DraggableItemProps {
  onRemove?: (value: any) => void
  onDrag?: Function
  index?: number
  file?: FileView
  className?: string
  onUpdateUploadStatus?: (changeFile: any) => void
  onUpdateCaption?: (value: string) => void
}

export const ImageThumnail = ({
  file,
}: {
  file: {
    url?: string
    file?: { name?: string }
  }
}) => {
  if (LIST_ACCPET_IMAGE_TYPE.includes(file.url.split('.').pop()))
    return (
      <img
        alt=""
        className="w-full h-full border-round"
        style={{ objectFit: 'cover' }}
        src={file.url}
      />
    )
  return (
    <>
      <i className="isax-folder mb-1"></i>
      <div className="text-fs-14 text-center text-grey-800 w-full  overflow-hidden text-overflow-ellipsis white-space-nowrap px-3">
        {file.file.name}
      </div>
    </>
  )
}

const DraggableItem = (props: DraggableItemProps) => {
  const {
    onRemove,
    onDrag,
    index,
    file,
    className,

    onUpdateUploadStatus,
  } = props

  const ref = useRef()
  const [error, setError] = useState(
    file.size > MAX_UPLOAD_SIZE
      ? t(`Over`, { max: `${MAX_UPLOAD_SIZE / (1024 * 1024)}MB` })
      : file.size === 0
        ? 'Error'
        : null
  )
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor: any) => {
      const { index: dragIndex } = monitor.getItem() || {}
      if (dragIndex === index) {
        return {}
      }
      return {
        isOver: monitor.isOver(),
        dropClassName:
          dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      }
    },
    drop: (item: any) => {
      onDrag(item.index, index)
    },
  })
  const [, drag] = useDrag({
    type,
    item: { index },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })
  const [progress, setProgress] = useState<number>(0)
  drop(drag(ref))

  const uploadRef = useRef(new AbortController())
  const updateStatusRef = useRef((_data: any) => {})
  const onRemoveRef = useRef((_data?: any) => {})

  const handleUpload = useCallback(async () => {
    try {
      const response = await uploadImage(
        file.file,
        (progress) => {
          setProgress(progress)
        },
        uploadRef.current.signal
      )
      if (response)
        if (response[0].width < 300 || response[0].height < 300) {
          updateStatusRef.current({
            _id: file._id,
            status: FileUploadStatus.ERROR,
            url: response[0].url,

            s3Key: response[0].s3Key,
            mimeType: file.mimeType,
          })
          setError('Kích thước quá nhỏ')
        } else
          updateStatusRef.current({
            _id: file._id,
            status: FileUploadStatus.UPLOADED,
            url: response[0].url,

            mimeType: file.mimeType,
          })
    } catch (error) {
      if (axios.isCancel(error))
        onRemoveRef.current && onRemoveRef.current({ _id: file._id })
      else {
        updateStatusRef.current({
          _id: file._id,
          status: FileUploadStatus.ERROR,
        })
        setError(t('Upload error'))
      }
    }
  }, [file.file, file._id, file.mimeType])

  useEffect(() => {
    updateStatusRef.current = onUpdateUploadStatus
  }, [onUpdateUploadStatus])

  useEffect(() => {
    onRemoveRef.current = onRemove
  }, [onRemove])

  useEffect(() => {
    if (file.status === FileUploadStatus.UPLOADING) {
      handleUpload()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file.status])

  return (
    <div
      // @ts-ignore
      ref={ref}
      className={clsx(
        '   h-6rem border-round overflow-hidden',
        className,
        isOver ? dropClassName : null
      )}
      style={{ cursor: 'move', flex: '0 0 10rem' }}
    >
      <div
        className={clsx(
          'w-full h-full relative border-round  flex align-items-center justify-content-center flex-column bg-gray-100 border-1  border-transparent  duration-300 ',
          file.status !== FileUploadStatus.UPLOADED ? 'px-3' : '',
          {
            'border-red-500': file.status === FileUploadStatus.ERROR,
          }
        )}
        key={index}
      >
        {file.status === FileUploadStatus.UPLOADED ? (
          <ImageThumnail file={file} />
        ) : null}
        {file.status === FileUploadStatus.PENDING ? (
          <>
            <div className="mb-1 text-fs-12 w-full  overflow-hidden text-overflow-ellipsis white-space-nowrap">
              {file.file?.name}
            </div>
            <ProgressSpinner className="w-2rem h-2rem" />
          </>
        ) : null}
        {file.status === FileUploadStatus.ERROR ? (
          <>
            <i className="pi-warning-b pi text-fs-20 mb-1 text-red-500"></i>
            <div className="mb-1 text-fs-12 w-full overflow-hidden text-overflow-ellipsis white-space-nowrap text-center">
              {file.file?.name}
            </div>
            <p className="my-0 text-red-500">{error}</p>
          </>
        ) : null}
        {file.status === FileUploadStatus.UPLOADING ? (
          <>
            <div className="mb-1 text-sm text-center w-full overflow-hidden text-overflow-ellipsis white-space-nowrap">
              {file.file?.name}
            </div>
            <ProgressBar
              style={{ height: '12px' }}
              className="w-full"
              value={progress}
            />
          </>
        ) : null}
        <div
          className="border-round bg-gray-50 rounded-full flex align-items-center justify-content-center 
           absolute 
       cursor-pointer
          "
          style={{
            top: '0',
            right: ' 0',
            width: '24px',
            height: '24px',
            zIndex: 200,
          }}
          onClick={() => {
            if (file.status === FileUploadStatus.UPLOADING)
              uploadRef.current.abort()
            else onRemoveRef.current && onRemoveRef.current({ _id: file._id })
          }}
        >
          <i className="isax isax-close-01  text-xs" />
        </div>
      </div>
    </div>
  )
}

export default DraggableItem
