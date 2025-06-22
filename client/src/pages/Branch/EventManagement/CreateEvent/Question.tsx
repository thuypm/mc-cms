import clsx from 'clsx'
import { t } from 'i18next'
import { InputText } from 'primereact/inputtext'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'

function Question({ disabled }: { disabled?: boolean }) {
  const { control, getValues } = useFormContext()
  const { fields, append, remove, swap } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: 'questions', // unique name for your Field Array
  })

  return (
    <div>
      <h2 className="text-xl mb-0">{t('Question')}</h2>
      <p className="text-red-500 mt-0 text-sm">
        *{t('You can add a maximum 10 questions')}
      </p>
      <div className="flex flex-column gap-6">
        {fields.map((field, index) => (
          <div key={field.id} className="flex flex-column gap-2">
            <div className="flex w-full justify-content-between">
              <label className="font-semibold">
                {t('Question')} {index + 1}
              </label>
              {disabled ? null : (
                <div className="flex gap-4">
                  {index > 0 ? (
                    <i
                      className=" isax-arrow-up-3 text-xl cursor-pointer"
                      onClick={() => {
                        swap(index, index - 1)
                      }}
                    ></i>
                  ) : null}
                  {index < fields.length - 1 ? (
                    <i
                      className="isax-arrow-down text-xl cursor-pointer"
                      onClick={() => {
                        swap(index, index + 1)
                      }}
                    ></i>
                  ) : null}
                  {fields.length >= 10 ? null : (
                    <i
                      className=" isax-copy text-xl cursor-pointer"
                      onClick={() => {
                        append({
                          ...getValues().questions[index],
                        })
                      }}
                    ></i>
                  )}
                  {disabled ? null : (
                    <i
                      className="isax-trash text-xl  cursor-pointer"
                      onClick={() => remove(index)}
                    ></i>
                  )}
                </div>
              )}
            </div>

            <Controller
              control={control}
              name={`questions.${index}.question`}
              rules={{
                required: t('required', { field: t('Question') }),
              }}
              render={({ field, fieldState }) => {
                return (
                  <InputText
                    {...field}
                    disabled={disabled}
                    placeholder={t('Question')}
                    maxLength={255}
                    className={clsx({
                      'p-invalid': fieldState.invalid,
                    })}
                  />
                )
              }}
            ></Controller>
            <Controller
              control={control}
              name={`questions.${index}.answer`}
              rules={{
                required: t('required', { field: t('Answer') }),
              }}
              render={({ field, fieldState }) => {
                return (
                  <InputText
                    {...field}
                    maxLength={255}
                    disabled={disabled}
                    placeholder={t('Answer')}
                    className={clsx({
                      'p-invalid': fieldState.invalid,
                    })}
                  />
                )
              }}
            ></Controller>
          </div>
        ))}
      </div>
      <div
        className={clsx(
          'flex w-full justify-content-start mb-4',
          fields.length ? 'mt-4' : ''
        )}
      >
        {disabled ? null : (
          <button
            className="w-max flex align-items-center px-3 py-2 gap-2 bg-white 
          cursor-pointer
          hover:bg-gray-300
          transition-duration-100
          hover:text-white
           border-1 border-solid border-gray-300 border-round"
            type="button"
            onClick={() => append({ question: '', answer: '' })}
            disabled={fields.length >= 10}
          >
            <i className="isax isax-add"></i>
            {t('Add new', { item: t('Question') })}
          </button>
        )}{' '}
      </div>
    </div>
  )
}

export default Question
