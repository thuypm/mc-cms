import clsx from 'clsx'
import FormField from 'components/FormField'
import { useStore } from 'context/store'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputTextarea } from 'primereact/inputtextarea'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { EventStatusEnum } from 'utils/constants/event'

const ModalCancelEvent = () => {
  const { t } = useTranslation()
  const {
    eventManamentStore: {
      selectedItem,

      cancel,

      loadingSubmit,
    },
  } = useStore()

  const [visible, setVisible] = useState(false)
  const form = useForm({
    defaultValues: {
      cancelReason: '',
    },
  })

  const onSubmit = async (data) => {
    try {
      await cancel(selectedItem?._id, data)
      setVisible(false)
    } catch (error) {}
  }

  return (
    <>
      <Dialog
        header={t('Do you want to cancel this event?')}
        visible={visible}
        style={{ width: '50vw' }}
        onHide={() => {
          if (!visible) return
          setVisible(false)
        }}
      >
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            className="flex flex-column"
            name="cancelReason"
            rules={{
              required: t('required', {
                field: t('Cancel Reason'),
              }),
              validate(value) {
                return value.length <= 500
                  ? null
                  : t('Please input < 500 charators')
              },
            }}
            render={({ field, fieldState }) => {
              return (
                <InputTextarea
                  {...field}
                  maxLength={5000}
                  rows={5}
                  placeholder={t('Cancel Reason')}
                  className={clsx({
                    'p-invalid': fieldState.invalid,
                  })}
                />
              )
            }}
            label={t('Cancel Reason')}
          />
          <div className="flex gap-4 justify-content-center mt-4">
            <Button
              color="primary"
              type="submit"
              loading={loadingSubmit}
              label={t('Cancel item', { item: t('Event') })}
            ></Button>
            <Button
              severity="secondary"
              type="button"
              label={t('Back')}
              onClick={() => setVisible(false)}
            ></Button>
          </div>
        </form>
      </Dialog>
      {selectedItem.status === EventStatusEnum.Open ||
      selectedItem.status === EventStatusEnum.UpComming ? (
        <Button
          label={t('Cancel item', { item: t('Event') })}
          outlined
          onClick={() => {
            setVisible(true)
          }}
        ></Button>
      ) : null}
    </>
  )
}

export default observer(ModalCancelEvent)
