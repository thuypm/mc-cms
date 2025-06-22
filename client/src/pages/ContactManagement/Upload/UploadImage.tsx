import { DndProvider } from 'react-dnd'

// import { Donut } from '@/components/Commons/Loading'
import { MAX_COUNT_UPLOAD, MAX_UPLOAD_SIZE } from 'utils/constants/file'
import { ObjectId } from 'utils/helper/object'
// import { showModal } from '@/utils/showModal'
import clsx from 'clsx'
import isEqual from 'lodash.isequal'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import React, {
  LegacyRef,
  forwardRef,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { FieldError } from 'react-hook-form'
import DraggableItem from './DragableItem'
import UploadBtn from './UploadBtn'
import { FileUploadStatus } from './enum'
import { FileView } from './interface'

interface UploadImageProps {
  value?: FileView[]
  error?: FieldError
  onChange?: (value: FileView[]) => void
}
const UploadImage = forwardRef(
  (props: UploadImageProps, ref: LegacyRef<HTMLDivElement>) => {
    const { value, onChange, error } = props
    const [items, setItems] = useState<Array<FileView>>([])
    useEffect(() => {
      if (Array.isArray(value) && !isEqual(value, items)) {
        setItems(
          value?.map((e) =>
            e._id
              ? { ...e, caption: e.caption ?? '' }
              : { ...e, _id: ObjectId(), caption: e.caption ?? '' }
          )
        )
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items.length, value])

    useEffect(() => {
      const fistPendingItem = items.find(
        (e) => e.status === FileUploadStatus.PENDING
      )
      const uploadingItem = items.find(
        (e) => e.status === FileUploadStatus.UPLOADING
      )
      if (!uploadingItem && fistPendingItem) {
        const newArrray = items.map((e) =>
          e._id === fistPendingItem._id
            ? { ...e, status: FileUploadStatus.UPLOADING }
            : e
        )
        onChange ? onChange(newArrray) : setItems(newArrray)
      }
    }, [items, onChange, value])

    const onRemove = (file: FileView) => {
      onChange
        ? onChange(items.filter((e) => e._id !== file._id))
        : setItems(items.filter((e) => e._id !== file._id))
    }

    const onDrag = useCallback(
      (dragIndex: number, hoverIndex: number) => {
        const newList = [...items]
        newList[hoverIndex] = newList.splice(
          dragIndex,
          1,
          newList[hoverIndex]
        )[0]
        onChange ? onChange(newList) : setItems(newList)
      },
      [items, onChange]
    )
    const onChangeFile = (fileList: FileList) => {
      const newArrayFile = Array.from(fileList).map((file) => ({
        file: file,
        _id: ObjectId(),
        mimeType: file.type,
        size: file.size,

        status: FileUploadStatus.PENDING,
      }))

      const validateFiles = newArrayFile
        .slice(0, MAX_COUNT_UPLOAD - items.length)
        .map((f) => {
          if (f.size > MAX_UPLOAD_SIZE || f.size === 0)
            return {
              ...f,
              status: FileUploadStatus.ERROR,
            }
          return f
        })
      if (newArrayFile.length + items.length > MAX_COUNT_UPLOAD)
        confirmDialog({
          header: 'エラー',
          footer: (opt) => {
            return <Button label={'はい'} onClick={opt.accept}></Button>
          },
          // message: `${newArrayFile.length - validateFiles.length} files cannot be uploaded due to exceeding the allowed number (5 files)`,
          message: `アップロードできるファイル数は 5 です。そのため、 ${newArrayFile.length - validateFiles.length} ファイルがアップロードできません`,
        })
      onChange
        ? onChange([...validateFiles, ...items])
        : setItems([...validateFiles, ...items])
    }
    const onUpload = (fileChange: any) => {
      const newList = items.map((e) =>
        e._id === fileChange._id ? { ...e, ...fileChange } : e
      )

      onChange ? onChange(newList) : setItems(newList)
    }

    return (
      <div
        className={clsx(
          'flex flex-wrap gap-4  rounded-lg outline-none',
          error ? 'border-red-600' : 'border-grey-300'
        )}
        ref={ref}
        tabIndex={0}
      >
        <UploadBtn files={items} accept={`*`} onChange={onChangeFile} />

        {items && items.length > 0
          ? items.map((file, index) => {
              return (
                <DraggableItem
                  file={file}
                  index={index}
                  onUpdateUploadStatus={onUpload}
                  onRemove={onRemove}
                  onDrag={onDrag}
                  key={file._id}
                />
              )
            })
          : null}
      </div>
    )
  }
)

const UploadImageComponent = forwardRef((props: UploadImageProps, ref: any) => {
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <UploadImage {...props} ref={ref} />
      </DndProvider>
      {props.error ? (
        <div className="text-error-600 text-fs-12 mt-1">
          {props.error?.message}
        </div>
      ) : null}
    </>
  )
})

export default React.memo(UploadImageComponent)
