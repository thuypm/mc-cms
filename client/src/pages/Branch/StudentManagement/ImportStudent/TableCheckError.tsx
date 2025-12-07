import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { useTranslation } from 'react-i18next'

export default function TableCheckError({ data }) {
  const { t } = useTranslation()
  return data ? (
    <div className="overflow-auto flex-1 flex flex-column">
      <DataTable value={data} className="overflow-auto">
        <Column
          field="row"
          header={t('Row')}
          style={{
            width: '80px',
          }}
        ></Column>
        <Column field="email" header={t('Email')}></Column>
        <Column field="name" header={t('Name')}></Column>
        <Column field="furigana" header={t('Furigana')}></Column>
        <Column field="phoneNumber" header={t('Phone number')}></Column>
        <Column
          field="error"
          header={t('Error')}
          style={{ width: '35%' }}
        ></Column>
      </DataTable>
    </div>
  ) : null
}
