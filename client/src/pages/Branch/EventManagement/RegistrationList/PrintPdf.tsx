import {
  Document,
  Font,
  PDFViewer,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'
import { BaseDataListResponse } from 'Base'
import { RegistrationEventData } from 'Models'
import axiosInstant from 'api/baseRequest'
import dayjs from 'dayjs'
import { observer } from 'mobx-react'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { DATE_TIME_FORMAT } from 'utils/constants/datetime'
import { formatPhone } from 'utils/helper/common-helpers'

//@ts-ignore
// Create styles
const breaklineString = (str: string, maxLength = 9) => {
  const result = []
  let startIndex = 0
  while (startIndex < str.length) {
    const chunk = str.substring(startIndex, startIndex + maxLength)
    result.push(chunk)
    startIndex += maxLength
  }

  return result.join('\n')
}

Font.register({
  family: 'Meiryo',
  fonts: [
    {
      src: '/fonts/Meiryo.ttf',
    },
  ],
})
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    fontFamily: 'Meiryo',
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
})

// Create Document Component
const PrintPdf = ({
  currentEvent,
  filterData,
  currentTimeSlot,
}: {
  currentEvent: any
  filterData: any
  currentTimeSlot?: any
}) => {
  const { t } = useTranslation()
  const columns = [
    {
      key: 'index',
      header: t('No.'),
      width: '20px',
      body: (_data, index) => (
        <Text
          style={{
            fontSize: '10px',
            fontWeight: 600,

            width: '20px',
          }}
        >{`${index + 1}`}</Text>
      ),
    },
    {
      key: 'name',
      dataIndex: 'name',
      header: t('Name'),
      width: '15%',
      truncate: 9,
    },
    {
      key: 'furigana',
      header: t('Furigana'),
      width: '15%',
      truncate: 9,
    },
    {
      key: 'email',
      header: t('Email'),
      width: '20%',
      truncate: null,
    },
    {
      key: 'phoneNumber',
      header: t('Phone number'),
      width: '14%',
      truncate: 10,
      body: (data) => (
        <Text
          style={{
            fontSize: '10px',
            fontWeight: 600,

            width: '14%',
          }}
        >{`${formatPhone(data.phoneNumber)}`}</Text>
      ),
    },

    {
      key: 'guest',
      header: t('Guest'),
      width: '40px',
    },
    {
      key: 'note',
      header: t('Note'),
      width: '15%',
      truncate: 8,
    },
  ]

  const [data, setData] = useState<RegistrationEventData[]>(null)
  const [event, setEvent] = useState<any>(null)
  const { id } = useParams()

  const total = useMemo(() => {
    let total = 0
    data?.forEach((e) => (total += e.guest))
    return total
  }, [data])
  const getData = useCallback(async () => {
    try {
      const { data } = await axiosInstant.request<
        BaseDataListResponse<RegistrationEventData> & {
          event: any
        }
      >({
        url: `/api/v1/reservation/event/${id}`,
        params: {
          ...filterData,
          page: 1,
          perPage: 2000,
        },
      })
      setData(data.data)
      setEvent(data.event)
    } catch (error) {
      setData([])
    }
  }, [filterData, id])
  useEffect(() => {
    if (id) getData()
  }, [getData, id])

  return data ? (
    <PDFViewer className="w-full h-full">
      <Document>
        <Page size="A4" style={styles.page} orientation="landscape">
          <View
            style={{
              flexDirection: 'column',
              width: '100%',
              padding: '16px',
            }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'flex-start',
                paddingTop: '8px',
                paddingBottom: '12px',
                paddingRight: '16px',
                paddingLeft: '16px',
                gap: '8px',
              }}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',

                  alignItems: 'center',

                  gap: '16px',
                  flexGrow: 1,
                }}
              >
                <Text style={{ fontSize: '18px', fontWeight: 700 }}>
                  {t('Registrations List')} ({currentEvent.title})
                </Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  width: '100%',
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: '14px',
                      textAlign: 'left',
                      fontWeight: 700,
                    }}
                  >
                    {t('Total')}: {total}人
                  </Text>
                </View>
                <View
                  style={{
                    width: '50%',
                  }}
                >
                  <Text
                    style={{
                      fontSize: '14px',
                      textAlign: 'right',
                      fontWeight: 700,
                    }}
                  >
                    {currentTimeSlot
                      ? `${t('Time slot')}: ${dayjs(currentTimeSlot.startTime).format(DATE_TIME_FORMAT.DAY_ONLY)} (${dayjs(currentTimeSlot.startTime).format(DATE_TIME_FORMAT.HOUR)} ~ ${dayjs(currentTimeSlot.endTime).format(DATE_TIME_FORMAT.HOUR)})`
                      : ''}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                alignItems: 'center',
                paddingLeft: '4px',
                paddingRight: '4px',
                height: '28px',
                backgroundColor: '#e2e8f0',
                justifyContent: 'space-between',
                borderBottom: '1px solid #64748b',
              }}
            >
              {columns.map((col) => {
                return (
                  <Text
                    key={col.key}
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      width: col.width,
                    }}
                  >
                    {col.header}
                  </Text>
                )
              })}
            </View>
            <View>
              {data.map((row, index) => {
                return (
                  <View
                    key={row._id}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      width: '100%',
                      alignItems: 'center',
                      paddingTop: '0px',
                      paddingBottom: '0px',
                      paddingRight: '4px',
                      paddingLeft: '4px',

                      borderBottom: '1px solid #64748b',
                      justifyContent: 'space-between',
                    }}
                  >
                    {columns.map((col) => {
                      return col.body ? (
                        <Fragment key={col.key}>
                          {col.body(row, index)}
                        </Fragment>
                      ) : (
                        <Text
                          key={col.key}
                          style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            width: col.width,

                            textOverflow: 'ellipsis',
                          }}
                        >
                          {col.truncate
                            ? breaklineString(
                                row[col.dataIndex ?? col.key],
                                col.truncate
                              )
                            : row[col.dataIndex ?? col.key]}
                        </Text>
                      )
                    })}
                  </View>
                )
              })}
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  ) : (
    <div className="flex w-full h-full justify-content-center align-items-center">
      <ProgressSpinner />
    </div>
  )
}
export default observer(PrintPdf)
