import { useStore } from 'context/store'
import { observer } from 'mobx-react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload'
import { InputTextarea } from 'primereact/inputtextarea'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as XLSX from 'xlsx'

import { exportStudentCardsPdf } from './createHelper'

const ModalCreateStudentInfo = () => {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)
  const [mcidText, setMcidText] = useState('')
  const [loading, setLoading] = useState(false)
  const {
    studentManagementStore: { fetchDetailIds },
  } = useStore()

  const handleFileSelect = async (e: FileUploadSelectEvent) => {
    // Hỗ trợ chọn nhiều file một lúc (nếu cần)
    for (const file of e.files) {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 })

      const mcids = rows
        .map((row) => String(row[0] || '').trim())
        .filter((val) => /^\d{6}$/.test(val))

      setMcidText((prev) => {
        // nối thêm với dữ liệu cũ, tránh trùng lặp
        const current = prev ? prev.split(',').map((s) => s.trim()) : []
        const merged = Array.from(new Set([...current, ...mcids]))
        return merged.join(', ')
      })
    }
  }

  const handleSubmit = async () => {
    const mcidArray = mcidText
      .split(/[\n,]+/) // tách bởi dấu xuống dòng hoặc dấu phẩy
      .map((s) => s.trim()) // loại bỏ khoảng trắng dư
      .filter((s) => s) // bỏ phần rỗng

    try {
      setLoading(true)
      const data = await fetchDetailIds(mcidArray)
      await exportStudentCardsPdf(data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
    // handleFilterDataChange('mcidList', mcidArray)
    // setShowModal(false)
  }

  return (
    <>
      <Button
        icon="pi pi-id-card"
        label="In thẻ"
        onClick={() => setShowModal(true)}
      />
      <Dialog
        onHide={() => setShowModal(false)}
        headerClassName="pt-4"
        header={t('Import CSV File')}
        visible={showModal}
        style={{ width: '70vw' }}
        contentClassName="flex flex-column gap-3 overflow-auto"
      >
        <InputTextarea
          value={mcidText}
          onChange={(e) => setMcidText(e.target.value)}
          rows={5}
        />

        <FileUpload
          name="excel[]"
          accept=".xlsx,.xls"
          maxFileSize={1000000}
          onSelect={handleFileSelect} // đọc file ngay khi chọn hoặc kéo thả
          emptyTemplate={
            <p className="m-0">
              Kéo và thả file Excel vào đây hoặc bấm chọn file.
            </p>
          }
        />

        <Button
          label="Submit"
          icon="pi pi-check"
          onClick={handleSubmit}
          className="mt-3"
          loading={loading}
        />
      </Dialog>
    </>
  )
}

export default observer(ModalCreateStudentInfo)
