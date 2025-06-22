import clsx from 'clsx'
import TimeRangeSelect from 'components/TimeRangeSelect'
import dayjs from 'dayjs'

import { t } from 'i18next'
import InputNumberCustom from 'components/InputNumberCustom'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { FORMAT_TIME } from 'utils/constants/datetime'
import { useParams } from 'react-router'

function TimeSlot({ disabled }: { disabled?: boolean }) {
  const { control, watch } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: 'timeslots', // unique name for your Field Array
  })
  const { id } = useParams()
  const disabledAll = !!id
  const timeslots = watch('timeslots')

  // console.log(startTimeEvent, timeslots)
  return (
    <div className="mb-4">
      <p className="font-semibold mb-0 text-lg mb-3">{t('Time slot')}</p>
      <div className="grid gap-4 px-2  h-full">
        {/* <div>Time Slot - 1</div> */}

        {fields.map((field: any, index) => {
          return (
            <Controller
              key={field.id}
              control={control}
              name={`timeslots.${index}`}
              rules={{
                validate: ({ timeRange, maxRegistrations }) => {
                  if (!timeRange?.from || !timeRange?.to)
                    return t('required', { field: t('Time slot') })

                  if (
                    dayjs(timeRange.to, FORMAT_TIME).toDate().getTime() <
                    dayjs(timeRange.from, FORMAT_TIME).toDate().getTime() +
                      600000
                  )
                    return t(
                      'The end time must be greater than the start time at least 10 minutes'
                    )

                  if (
                    timeslots[index - 1] &&
                    dayjs(timeslots[index - 1].timeRange.to, FORMAT_TIME)
                      .toDate()
                      .getTime() >
                      dayjs(timeRange.from, FORMAT_TIME).toDate().getTime()
                  )
                    return t(
                      'The start time of the next time slot must be after the end time of the previous one'
                    )

                  if (maxRegistrations <= 0)
                    return t('Max Registrations must be > 0')
                  return maxRegistrations <= 3000
                    ? null
                    : t('Max Registrations is 3000')
                  // return null
                },
              }}
              render={({ field: f, fieldState }) => (
                <div>
                  <div
                    className={clsx(
                      'flex  flex-column gap-2 p-4 relative border-round-xl relative',
                      fieldState.error?.message ? 'shadow-error ' : ' shadow-2'
                    )}
                    ref={f.ref}
                    tabIndex={index + 2}
                    style={{
                      width: '422px',
                      background: '#FCFCFD',
                    }}
                  >
                    {fields.length > 1 && !disabledAll ? (
                      <div
                        className="w-2rem absolute
                        cursor-pointer
                        h-2rem border-circle flex justify-content-center align-items-center  bg-white shadow-2 "
                        style={{
                          top: '-4px',
                          right: '-8px',
                        }}
                        onClick={() => remove(index)}
                      >
                        <i className="isax isax-close-01"></i>
                      </div>
                    ) : null}

                    <div className="flex  align-items-center  gap-2">
                      <i className="isax-clock"> </i>{' '}
                      <div className="flex flex-1 justify-content-between gap-6">
                        <label
                          htmlFor=""
                          className="align-items-center flex gap-2"
                        >
                          {t('Time slot')} {index + 1}
                        </label>

                        <TimeRangeSelect
                          value={f.value.timeRange}
                          disabled={disabledAll}
                          onChange={(value) =>
                            f.onChange({ ...f.value, timeRange: value })
                          }
                          className="border-bottom-1 border-gray-300 w-10rem"
                        />
                      </div>
                    </div>

                    <div className="flex align-items-center  justify-content-between gap-6 ml-4 pb-1">
                      <label
                        htmlFor=""
                        className="white-space-nowrap align-items-center flex gap-2 "
                      >
                        {t('Max Registrations')}
                      </label>

                      <div className="">
                        {' '}
                        <InputNumberCustom
                          disabled={disabled}
                          ref={f.ref}
                          // className="min-w-0  border-none w-10rem outline-none  border-bottom-1 border-gray-300"
                          placeholder={t('Input')}
                          className="border-none w-10rem outline-none
                            border-noround p-0 px-1  py-1
                            focus:shadow-none
                            border-bottom-1 border-gray-300"
                          min={0}
                          value={f.value.maxRegistrations}
                          style={{
                            marginLeft: '2px',
                          }}
                          onChange={(e) =>
                            f.onChange({
                              ...f.value,
                              maxRegistrations: e.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-red-600 my-2 px-2 text-sm">
                    {fieldState.error?.message as string}
                  </p>
                </div>
              )}
            />
          )
        })}
        {disabledAll ? null : (
          <div
            style={{ width: 422, height: 128, background: '#FCFCFD' }}
            onClick={() =>
              append({
                timeRange: {
                  from: null,
                  to: null,
                },
                maxRegistrations: null,
              })
            }
            className=" flex cursor-pointer flex-column align-items-center justify-content-center gap-2 p-4 bg-white shadow-2 relative border-round-xl "
          >
            {
              <div>
                <i className="isax isax-add mr-2"></i>
                {t('Add new', {
                  item: t('Time slot'),
                })}
              </div>
            }
          </div>
        )}
      </div>
    </div>
  )
}

export default TimeSlot
