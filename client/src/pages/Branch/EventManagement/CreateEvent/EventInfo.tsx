import { clsx } from 'clsx'
import DateTimePicker from 'components/DateTimePicker'
import FormField from 'components/FormField'
import ReactQuillEditor from 'components/QuillEditor'
import { useStore } from 'context/store'
import { observer } from 'mobx-react'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { countCharactersEditor } from 'utils/constants/regex'
import RegistorInformation from './RegistorInformation'
import TimeSlot from './TimeSlot'
import { getEventStatusTag } from 'utils/helper/table'
import { useObjectSearchParams } from 'utils/hooks/useObjectSearchParams'
import { Divider } from 'primereact/divider'
import { useParams } from 'react-router'

const EventInfo = ({ disabled }: { disabled?: boolean }) => {
  const { t } = useTranslation()
  const {
    eventManamentStore: { selectedItem },
  } = useStore()
  const { control } = useFormContext()
  const {
    searchObject: { cloneId },
  } = useObjectSearchParams()
  const { id } = useParams()
  const disabledAll = !!id

  return (
    <>
      <div className="flex gap-4 align-items-center">
        <h1 className="text-3xl m-0 uppercase">
          {selectedItem
            ? cloneId
              ? t('Event clone from', { event: selectedItem.title })
              : t('Edit item', { item: t('Event') })
            : t('Add new', { item: t('Event') })}
        </h1>
        {cloneId ? null : getEventStatusTag(selectedItem?.status)}
      </div>
      <Divider />

      <h2 className="text-xl">{t('Event Information')}</h2>
      <FormField
        control={control}
        name="title"
        rules={{
          required: t('required', {
            field: t('Event Title'),
          }),
        }}
        className="w-full"
        render={({ field, fieldState }) => {
          return (
            <InputText
              {...field}
              autoComplete="off"
              disabled={disabledAll}
              maxLength={255}
              placeholder={t('Event Title')}
              className={clsx({
                'p-invalid': fieldState.invalid,
              })}
            />
          )
        }}
        label={t('Event Title')}
      />
      <FormField
        control={control}
        name="location"
        rules={{
          required: t('required', { field: t('Event Location') }),
        }}
        render={({ field, fieldState }) => {
          return (
            <InputText
              autoComplete="off"
              {...field}
              disabled={disabledAll}
              maxLength={255}
              placeholder={t('Event Location')}
              className={clsx({
                'p-invalid': fieldState.invalid,
              })}
            />
          )
        }}
        label={t('Event Location')}
      />
      <div className="w-6 pr-2">
        <FormField
          control={control}
          name="startTimeEvent"
          className="w-full"
          rules={{
            required: t('required', {
              field: t('Event Time'),
            }),
          }}
          render={({ field, fieldState }) => {
            return (
              <DateTimePicker
                {...field}
                tabIndex={0}
                minDate={new Date()}
                onChange={(value) => {
                  field.onChange(value)
                }}
                disabled={disabledAll}
                showTime={false}
                placeholder={t('Select')}
                className={clsx('', {
                  'p-invalid': fieldState.invalid,
                })}
              />
            )
          }}
          label={t('Event Time')}
        />
      </div>
      <TimeSlot disabled={disabled} />

      <RegistorInformation disabled={disabled} />

      <FormField
        control={control}
        name="description"
        rules={{
          required: t('required', {
            field: t('Event Description'),
          }),
          validate: (value) => {
            const count = countCharactersEditor(value)
            if (count > 5000) return t('Please input < 5000 charators')
            if (count === 0)
              return t('required', {
                field: t('Event Description'),
              })
            return null
          },
        }}
        render={({ field, fieldState }) => {
          return (
            <ReactQuillEditor
              {...field}
              placeholder={t('Event Description')}
              className={clsx({
                'p-invalid': fieldState.invalid,
              })}
              // onChange={(v, _, __, editor) => {
              //   console.log(editor.getText(), editor.getText().trim().length)
              //   field.onChange(v)
              // }}
            />
          )
        }}
        label={t('Event Description')}
      />

      <div className="field">
        <label htmlFor="name" className={clsx('font-semibold mb-0')}>
          {t('Event invitation email’s Note')}
        </label>
        <p className="text-red-500 mt-0 mb-2 text-xs">
          {t('This note will only use in Event invitation email.')}
        </p>
        <Controller
          name={'note'}
          render={({ field, fieldState }) => {
            return (
              <InputTextarea
                {...field}
                autoComplete="off"
                placeholder={t('Note')}
                maxLength={500}
                className={clsx({
                  'p-invalid': fieldState.invalid,
                })}
              />
            )
          }}
        />
      </div>
    </>
  )
}
export default observer(EventInfo)
