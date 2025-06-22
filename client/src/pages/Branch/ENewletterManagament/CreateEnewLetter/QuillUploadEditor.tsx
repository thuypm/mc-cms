import clsx from 'clsx'
import ReactQuillEditor from 'components/QuillEditor'
import { observer } from 'mobx-react'
import { uploadImage } from 'pages/ContactManagement/Upload/requestUpload'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Quill } from 'react-quill'
const Clipboard = Quill.import('modules/clipboard')

class CustomClipboard extends Clipboard {
  onPaste(e) {
    if (e.clipboardData && e.clipboardData.items.length > 0) {
      const item = e.clipboardData.items[0]
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault()
        // toast({
        //   severity: 'error',
        //   detail: i18n.t("You can not paste image"),
        //   summary: i18n.t('Error'),
        // })
        // alert('Bạn không thể dán hình ảnh trực tiếp!')
      } else {
        super.onPaste(e)
      }
    } else {
      super.onPaste(e)
    }
  }
}

Quill.register('modules/clipboard', CustomClipboard, true)
const QuillUploadEditor = forwardRef(
  ({ className = '', ...otherProps }: any, ref) => {
    const { t } = useTranslation()
    const [loadingUpload, setLoadingUpload] = useState(false)

    const reactQuillRef = useRef(null)
    const imageHandler = useCallback(async () => {
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.setAttribute('accept', 'image/*')
      input.click()
      input.onchange = async () => {
        if (input !== null && input.files !== null) {
          const file = input.files[0]
          setLoadingUpload(true)
          const response = await uploadImage(file)

          const quill = reactQuillRef.current
          if (quill && response?.[0]) {
            const range = quill.getEditorSelection()

            range &&
              quill
                .getEditor()
                .insertEmbed(range.index, 'image', response[0]?.url)
            let allImage = quill
              .getEditor()
              .container.getElementsByTagName('img')
            for (var img of allImage) {
              img.style = 'max-width: 600px'
            }
            //  props
          }

          setLoadingUpload(false)
        }
      }
    }, [])
    useImperativeHandle(ref, () => reactQuillRef.current, [])

    useEffect(() => {})
    return (
      <ReactQuillEditor
        ref={reactQuillRef}
        modules={{
          toolbar: {
            container: [
              // [{ font: [] }],
              [{ size: ['small', false, 'large', 'huge'] }],
              ['bold', 'italic', 'strike', 'underline'],
              ['blockquote', 'code-block'],
              [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
              ],
              [{ direction: 'rtl' }],
              // custom dropdown
              [{ header: [1, 2, 3, 4, 5, 6, false] }],

              [{ color: [] }, { background: [] }], // dropdown with defaults from theme
              [{ align: [] }],
              ['link', 'image'],

              ['clean'],
            ],
            handlers: {
              image: imageHandler, // <-
            },
          },
          // imageCompress: {
          //   quality: 0.7, // default
          //   maxWidth: 1000, // default
          //   maxHeight: 1000, // default
          //   imageType: 'image/jpeg', // default
          //   debug: true, // default
          // },
        }}
        formats={[
          'header',
          // 'font',
          'size',
          'bold',
          'italic',
          'underline',
          'strike',
          'blockquote',
          'list',
          'bullet',
          'indent',
          'link',
          // 'image',
          // 'video',
          'color',
          'background',
          'link',
          'image',
          // 'video',
        ]}
        readOnly={loadingUpload}
        placeholder={t('Content')}
        className={clsx('resize-quill', className)}
        {...otherProps}
      />
    )
  }
)
export default observer(QuillUploadEditor)
