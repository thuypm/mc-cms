import { useStore } from 'context/store'
import dayjs from 'dayjs'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { DATE_TIME_FORMAT, FORMAT_TIME } from 'utils/constants/datetime'
import { useObjectSearchParams } from 'utils/hooks/useObjectSearchParams'
import EventInfo from './EventInfo'
import Question from './Question'
import { EventStatusEnum } from 'utils/constants/event'

const defaultValues = {
  title: '',
  description: '',
  location: '',
  timeslots: [
    {
      timeRange: {
        from: null,
        to: null,
      },
      maxRegistrations: null,
    },
  ],
  startTimeEvent: null,
  remindBefore: 24,
  endTime: null,
  receptionBefore: null,
  cancelBefore: null,
  applicationUnit: null,
  countdownAfter: null,
  questions: [],
}

const CreateEvent = () => {
  const { t } = useTranslation()

  const {
    eventManamentStore: {
      fetchDetail,
      selectedItem,
      loadingSubmit,
      setSelectedItem,
      update,
      create,
    },
  } = useStore()

  const { id } = useParams()
  const {
    searchObject: { cloneId },
  } = useObjectSearchParams()

  const form = useForm<any>({
    defaultValues,
  })

  const { handleSubmit, reset } = form
  useEffect(() => {
    reset(selectedItem)
  }, [reset, selectedItem])

  useEffect(() => {
    if (selectedItem)
      if (cloneId) {
        reset({
          ...selectedItem,
          timeslots: selectedItem.timeslots?.map((item) => ({
            maxRegistrations: item.maxRegistrations,
            timeRange: {
              from: dayjs(new Date(item.startTime).getTime()).format(
                FORMAT_TIME
              ),
              to: dayjs(new Date(item.endTime).getTime()).format(FORMAT_TIME),
            },
          })),
          // timeslots: [
          //   {
          //     timeRange: {
          //       from: null,
          //       to: null,
          //     },
          //     maxRegistrations: null,
          //   },
          // ],
          startTimeEvent: null,
          receptionBefore: null,
          cancelBefore: null,
        })
      } else
        reset({
          ...selectedItem,
          timeslots: selectedItem.timeslots?.map((item) => ({
            maxRegistrations: item.maxRegistrations,
            _id: item._id,
            timeRange: {
              from: dayjs(new Date(item.startTime).getTime()).format(
                FORMAT_TIME
              ),
              to: dayjs(new Date(item.endTime).getTime()).format(FORMAT_TIME),
            },
          })),
          startTimeEvent: new Date(selectedItem.startTimeEvent),
          receptionBefore: new Date(selectedItem.receptionBefore),
          cancelBefore: new Date(selectedItem.cancelBefore),
        })
    else reset(defaultValues)
  }, [cloneId, reset, selectedItem])

  useEffect(() => {
    if (cloneId) fetchDetail(cloneId)
    if (id) fetchDetail(id)

    return () => {
      setSelectedItem(null)
    }
  }, [fetchDetail, id, setSelectedItem, cloneId])

  const onSubmit = async (values: any) => {
    try {
      if (id)
        await update(id, {
          ...values,
          timeslots: values.timeslots?.map((item) => ({
            maxRegistrations: item.maxRegistrations,
            _id: item._id,
            startTime: dayjs(
              `${dayjs(values.startTimeEvent).format(DATE_TIME_FORMAT.DAY_ONLY)} ${item.timeRange.from}`,
              DATE_TIME_FORMAT.FULL_SECOND
            ).toISOString(),
            endTime: dayjs(
              `${dayjs(values.startTimeEvent).format(DATE_TIME_FORMAT.DAY_ONLY)} ${item.timeRange.to}`,
              DATE_TIME_FORMAT.FULL_SECOND
            ).toISOString(),
          })),
          questions: values.questions.map((e, index) => ({
            ...e,
            order: index,
          })),
        })
      else {
        await create({
          ...values,
          timeslots: values.timeslots?.map((item) => ({
            maxRegistrations: item.maxRegistrations,
            startTime: dayjs(
              `${dayjs(values.startTimeEvent).format(DATE_TIME_FORMAT.DAY_ONLY)} ${item.timeRange.from}`,
              DATE_TIME_FORMAT.FULL_SECOND
            ).toISOString(),
            endTime: dayjs(
              `${dayjs(values.startTimeEvent).format(DATE_TIME_FORMAT.DAY_ONLY)} ${item.timeRange.to}`,
              DATE_TIME_FORMAT.FULL_SECOND
            ).toISOString(),
          })),
          questions: values.questions.map((e, index) => ({
            ...e,
            order: index,
          })),
        })
      }
      navigate('/event-management')
    } catch (error) {
      console.log(error)
    }
  }
  const navigate = useNavigate()

  return (
    <div className="card bg-white border-round-xl px-3 py-5">
      <FormProvider {...form}>
        <form
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          className="p-fluid"
        >
          <EventInfo
            disabled={!!id && selectedItem?.status !== EventStatusEnum.Open}
          />

          <Divider className="border-dashed-divider" />

          <Question
            disabled={!!id && selectedItem?.status !== EventStatusEnum.Open}
          />
          <Divider />

          <div className="flex gap-4">
            <Button
              loading={loadingSubmit}
              type="submit"
              label={id ? t('Save') : t('Create')}
              className="w-max"
            ></Button>
            <Button
              label={t('Cancel')}
              type="button"
              onClick={() => navigate('/event-management')}
              severity="secondary"
              className="w-min"
            ></Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
export default observer(CreateEvent)
