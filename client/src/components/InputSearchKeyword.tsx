import { t } from 'i18next'
import { InputText } from 'primereact/inputtext'
import { useRef, useEffect } from 'react'
import { useObjectSearchParams } from 'utils/hooks/useObjectSearchParams'
import { InputIcon } from 'primereact/inputicon'
import { IconField } from 'primereact/iconfield'
const InputSearchKeyword = ({ placeholder }: { placeholder?: string }) => {
  const { searchObject, setRestSearchObject } = useObjectSearchParams()
  const inputRef = useRef(null)
  const timeoutRef = useRef(null)
  useEffect(() => {
    if (searchObject?.keyword) inputRef.current.value = searchObject.keyword
  }, [searchObject])
  return (
    <IconField iconPosition="left" className="flex-1">
      <InputIcon className="isax isax-search-normal-1"> </InputIcon>
      <InputText
        style={{
          minWidth: 0,
          width: '100%',
        }}
        ref={inputRef}
        maxLength={50}
        className=""
        onKeyDown={(e: any) => {
          if (e.key === 'Enter') {
            clearTimeout(timeoutRef.current)
            setRestSearchObject({
              keyword: e.target.value.trim(),
            })
          }
        }}
        onChange={(e) => {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = setTimeout(() => {
            setRestSearchObject({
              keyword: e.target.value.trim(),
            })
          }, 1000)
        }}
        placeholder={placeholder ?? t('Search')}
      />
    </IconField>
  )
}
export default InputSearchKeyword
