import { MessageData } from 'Models'
import axios from 'axios'
import dayjs from 'dayjs'
import { observer } from 'mobx-react'
import { Divider } from 'primereact/divider'
import { useTranslation } from 'react-i18next'
import { DATE_TIME_FORMAT } from 'utils/constants/datetime'
import { checkNullDeleteItem } from 'utils/helper/common-helpers'

const MessageItem = ({ data }: { data?: MessageData }) => {
  const { t } = useTranslation()
  return (
    <div className="card bg-white w-full py-3 px-4 py-3 mb-4 border-round ">
      <h2 className="my-2">
        {data.sendFrom
          ? checkNullDeleteItem(data.sendFrom, 'name', t('Branch'))
          : t('Headquarter')}
      </h2>
      <div className="flex   align-items-center justify-content-between  gap-4">
        <p className="my-0 flex overflow-hidden">
          <b className=" text-overflow-ellipsis overflow-hidden  text-overflow-ellipsis  white-space-nowrap flex-1">
            {data.createdBy
              ? checkNullDeleteItem(data.createdBy, 'fullName', t('Admin'))
              : t('Headquarter')}
          </b>
          &nbsp;
          <span>
            {data.createdBy?.email ? `(${data.createdBy?.email})` : ''}
          </span>
        </p>
        <p className="my-0 flex-shirnk-0 white-space-nowrap">
          {dayjs(data.createdAt).format(DATE_TIME_FORMAT.FULL_SECOND)}
        </p>
      </div>
      {data.attachments?.length ? (
        <div className="flex gap-2 flex-wrap pt-4">
          {data.attachments?.map((item, index) => {
            const fileFolder = decodeURIComponent(item.replace(`/`, ''))
            const fileName = fileFolder.replace(/^(.*?)_/, '')
            const fileStringArray = fileName.split('.')
            const originalName = fileStringArray
              .slice(0, fileStringArray.length - 1)
              .join('')
            const fileShowName =
              originalName.slice(0, 20) +
              (originalName.length > 20 ? '...' : '') +
              ' .' +
              fileStringArray.pop()

            return (
              <div
                // to={item}
                // target="_blank"
                onClick={async () => {
                  try {
                    const { data } = await axios.request({
                      url: item,
                      baseURL: '',
                      responseType: 'blob',
                    })
                    const href = URL.createObjectURL(data)
                    const link = document.createElement('a')
                    link.href = href
                    link.download = fileName

                    document.body.appendChild(link)
                    link.click()

                    document.body.removeChild(link)
                  } catch (error) {}
                }}
                className="text-primary-700 gap-2 relative border-round  flex align-items-center justify-content-center bg-gray-100  cursor-pointer"
                key={index}
                style={{ flex: '0 0 auto', padding: '2px 8px' }}
              >
                <i className="isax-folder"></i>
                {fileShowName}
              </div>
            )
          })}
        </div>
      ) : null}

      <Divider />
      <div
        className="ql-editor p-0"
        dangerouslySetInnerHTML={{ __html: data.content }}
      ></div>
    </div>
  )
}

export default observer(MessageItem)
