import clsx from 'clsx'
import Quill, { StringMap } from 'quill'
import { forwardRef } from 'react'
import ReactQuill from 'react-quill'
import { ReactQuillProps } from 'react-quill/lib'
const Block = Quill.import('blots/block')
class DivBlock extends Block {
  static tagName = 'div'
}
Quill.register(DivBlock, true)
// const Clipboard = Quill.import('modules/clipboard')
// const Delta = Quill.import('delta')
// class PlainClipboard extends Clipboard {
//   onPaste(e: any) {
//     e.preventDefault()
//     const range = this.quill.getSelection()
//     const text = e.clipboardData.getData('text/plain')
//     const delta = new Delta()
//       .retain(range.index)
//       .delete(range.length)
//       .insert(text)
//     const index = text.length + range.index
//     const length = 0
//     this.quill.updateContents(delta, 'silent')
//     this.quill.setSelection(index, length, 'silent')
//     this.quill.scrollIntoView()
//   }
// }
// Quill.register('modules/clipboard', PlainClipboard, true)

export interface IReactQuillEditor extends ReactQuillProps {}
interface ICustomEditor extends IReactQuillEditor {
  error?: any
}

/****Loading*****/
/*********Module********/
const moduleEditors: StringMap = {
  toolbar: [
    // [{header: '1'}, {header: '2'}, {font: []}],
    // [{size: []}],n
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

    ['link'],
    ['clean'],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: true,
  },
}
/*********Formats********/
const formatEditors = [
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
  // 'image',
  // 'video',
]

const ReactQuillEditor = forwardRef((props: ICustomEditor, ref: any) => {
  const {
    modules = moduleEditors,
    formats = formatEditors,
    theme = 'snow',
    style,
  } = props || {}
  return (
    <ReactQuill
      className={clsx('customize-quill', props.className)}
      ref={ref}
      modules={modules}
      formats={formats}
      theme={theme}
      preserveWhitespace={false}
      style={style}
      {...props}
    />
  )
})

export default ReactQuillEditor
