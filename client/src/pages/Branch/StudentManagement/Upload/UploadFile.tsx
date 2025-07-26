import { DndProvider } from 'react-dnd'

import clsx from 'clsx'
import React, { LegacyRef, forwardRef, useState } from 'react'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { FieldError } from 'react-hook-form'
import UploadBtn from './UploadBtn'

import axiosInstant from 'api/baseRequest'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { ProgressBar } from 'primereact/progressbar'
import { useTranslation } from 'react-i18next'
import { toast } from 'utils/toast'
import TableCheckError from './TableCheckError'
var allowedExtensions = /(\.csv|\.xls|\.xlsx)$/i
interface UploadFileProps {
  value?: File[]
  error?: FieldError
  onClose?: () => void
  fetchData?: () => void
}
const UploadFile = forwardRef(
  (props: UploadFileProps, ref: LegacyRef<HTMLDivElement>) => {
    const [item, setItem] = useState<File>(null)
    const { t } = useTranslation()
    const onChangeFile = (file) => {
      if (!allowedExtensions.test(file.name))
        confirmDialog({
          message: t('Please select CSV file only'),
          header: t('File invalid'),

          footer: () => {
            return <> </>
          },
          acceptLabel: t('Ok'),
          rejectLabel: t('No'),
        })
      else if (file.size > 5242880)
        confirmDialog({
          message: t('Maximum size is 5MB'),
          header: t('File invalid'),

          footer: () => {
            return <> </>
          },
          acceptLabel: t('Ok'),
          rejectLabel: t('No'),
        })
      else setItem(file)
    }
    const [loading, setLoading] = useState(false)
    const [loaded, setLoaded] = useState(0)
    const [dataError, setDataError] = useState(null)
    return (
      <>
        <div className="flex-shrink-0">
          <div
            className={clsx(
              'flex flex-column overflow-hidden  border  border-dashed border-2 p-3 border-round-xl justify-content-center align-items-center',
              'border-primary-500'
            )}
            ref={ref}
            tabIndex={0}
          >
            <UploadBtn
              file={item}
              accept={`.csv`}
              onChange={onChangeFile}
              disabled={loading}
            />
            {item ? (
              <div className="flex  gap-1 py-2 align-items-center gap-2 overflow-hidden">
                <i className="isax-folder text-xl"></i>
                <div className="text-overflow-ellipsis overflow-hidden  text-overflow-ellipsis white-space-nowrap overflow-hidden ">
                  {item.name}
                </div>
                <div
                  className="w-2rem 
                flex-shrink-0
                cursor-pointer
                h-2rem border-circle flex justify-content-center align-items-center  bg-white shadow-2 "
                  style={{
                    top: '-4px',
                    right: '-8px',
                  }}
                  onClick={
                    loading
                      ? null
                      : () => {
                          setItem(null)
                          setDataError(null)
                        }
                  }
                >
                  <i className="isax isax-close-01"></i>
                </div>
              </div>
            ) : null}
          </div>

          {item ? (
            <div className="flex w-full justify-content-center mt-4">
              <Button
                label={t('Submit')}
                className="mx-auto"
                loading={loading}
                type="button"
                onClick={async () => {
                  setLoading(true)
                  setLoaded(0)
                  try {
                    const formData = new FormData()
                    formData.append('file', item)
                    const { data } = await axiosInstant.request({
                      data: formData,
                      method: 'POST',
                      headers: {
                        'Content-Type': 'multipart/form-data',
                      },
                      url: '/api/v1/customer/import',
                      onUploadProgress: (progressEvent) => {
                        setLoaded(
                          Math.floor(
                            (100 * progressEvent.loaded) / progressEvent.total
                          )
                        )
                      },
                    })
                    if (!data.data?.some((e) => e.error.length)) {
                      props.onClose()
                      toast({
                        severity: 'success',
                        detail: t('Imported data'),

                        summary: t('Success'),
                      })
                      // props.fetchData && props.fetchData()
                    } else {
                      setDataError(data)
                    }
                  } catch (error) {
                    console.log(error)
                    // toast({
                    //   severity: 'error',
                    //   detail: error?.response?.data?.message,
                    //   summary: t('Error'),
                    // })

                    // setDataError(error?.response?.data)
                  } finally {
                    setLoading(false)
                  }
                }}
              ></Button>
            </div>
          ) : null}
          {loading ? (
            <div className="my-4">
              <ProgressBar style={{ height: '12px' }} value={loaded} />
            </div>
          ) : null}
        </div>
        {dataError?.data?.length ? (
          <>
            <p className="text-red-500 my-0">
              {t(
                'There are {{rows}} lines with errors, for example the lines below, please check your file again',
                { rows: dataError?.totalErrors }
              )}
            </p>

            <TableCheckError data={dataError?.data} />
          </>
        ) : null}
      </>
    )
  }
)

const UploadFileComponent = forwardRef((props: UploadFileProps, ref: any) => {
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <UploadFile {...props} ref={ref} />
      </DndProvider>
    </>
  )
})

export default React.memo(UploadFileComponent)
