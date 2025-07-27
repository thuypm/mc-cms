import Tippy from '@tippyjs/react'
import clsx from 'clsx'
import { t } from 'i18next'
import { observer } from 'mobx-react'
import { FilterMatchMode } from 'primereact/api'
import { Button } from 'primereact/button'
import { Column, ColumnProps } from 'primereact/column'
import { ConfirmDialogProps, confirmDialog } from 'primereact/confirmdialog'
import {
  DataTable,
  DataTableFilterMetaData,
  DataTableStateEvent,
} from 'primereact/datatable'
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator'
import { Fragment, ReactNode, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useObjectSearchParams } from 'utils/hooks/useObjectSearchParams'

export interface ActionColumn {
  key?: string
  icon?: ReactNode
  showConfirm?: ConfirmDialogProps
  tooltip?: ReactNode
  href?: (data?: any) => string
  action?: (data?: any) => void
  disabled?: (data?: any) => boolean
  linkTarget?: string
}

export interface BaseManagemenColumnProps extends ColumnProps {
  dataIndex?: string
  key?: string
  filterKey?: string
  width?: any
}
export interface IBaseManagementComponentProps {
  filterComponent?: ReactNode
  columns?: BaseManagemenColumnProps[]
  dataSource?: any[]
  handleFilterDataChange?: (filter: any) => void
  pagination?: {
    page?: number
    totalPages?: number
    limit?: number
    total?: number
    onPageChange?(event: PaginatorPageChangeEvent): void
  }
  triggerFirstLoad?: boolean
  showActionColumn?: boolean
  actionWidth?: any
  rowClassName?: (data) => string
  sort?: {
    sortField?: string
    sortOrder?: any
    onSort?: (event: DataTableStateEvent) => void
  }
  actionColumns?: ActionColumn[]
  loading?: boolean
  title?: ReactNode
}
const BaseManagementComponent = ({
  filterComponent = <></>,
  columns = [],
  rowClassName,
  loading,
  sort,
  actionWidth,
  dataSource = [],
  actionColumns,
  handleFilterDataChange,
  triggerFirstLoad = true,
  pagination,
  showActionColumn = true,
}: IBaseManagementComponentProps) => {
  const { searchObject, setRestSearchObject } = useObjectSearchParams()

  const sortObject = useMemo<any>(() => {
    const sortArray = searchObject.sortBy ? searchObject.sortBy.split(':') : []
    if (sortArray.length)
      return {
        sortField: sortArray[0]?.replaceAll('"', ''),
        sortOrder: Number(sortArray[1]),
      }
    else return {}
  }, [searchObject])

  useEffect(() => {
    if (searchObject && triggerFirstLoad) {
      handleFilterDataChange && handleFilterDataChange(searchObject)
    }
  }, [handleFilterDataChange, searchObject, triggerFirstLoad])

  const filters = useMemo(() => {
    const obj: any = {}
    columns
      .filter((col) => col.filter)
      .forEach((col) => {
        obj[col.filterField ?? col.key] = {
          value: null,
          matchMode: FilterMatchMode.CUSTOM,
        }
      })
    Object.keys(searchObject).forEach((key) => {
      if (key !== 'page' && key !== 'limit' && key !== 'sortBy') {
        obj[key] = {
          value: searchObject[key],
          matchMode: FilterMatchMode.CUSTOM,
        }
      }
    })

    return obj
  }, [columns, searchObject])

  const tableRef = useRef(null)
  useEffect(() => {
    Array.from(tableRef.current.getTable().getElementsByTagName('td'))?.forEach(
      (td: HTMLElement) => {
        td.setAttribute('title', td.innerText || td.textContent)
      }
    )
  }, [dataSource])
  return (
    <div
      className={clsx('card bg-white border-round-xl p-3 pb-6 overflow-auto')}
      style={{
        minHeight: loading ? '480px' : '',
      }}
    >
      {filterComponent}
      <DataTable
        ref={tableRef}
        scrollable
        value={dataSource}
        className="mt-3"
        removableSort
        loading={loading}
        filters={filters}
        emptyMessage={t('No available options')}
        rowClassName={rowClassName}
        loadingIcon={
          <div className="absolute w-full h-full">
            <div className="skeleton-container">
              <div className="skeleton-placeholder skeleton-title"></div>
              <div className="skeleton-placeholder skeleton-content"></div>
              <div className="skeleton-placeholder skeleton-content"></div>
              <div className="skeleton-placeholder skeleton-content"></div>
              <div className="skeleton-placeholder skeleton-content"></div>
              <div className="skeleton-placeholder skeleton-content"></div>
            </div>
          </div>
        }
        onFilter={(e) => {
          const valueObject = {}

          Object.keys(e.filters).forEach((key) => {
            valueObject[key] = (
              e.filters[key] as DataTableFilterMetaData
            )?.value
          })

          setRestSearchObject(valueObject)
        }}
        lazy
        {...sortObject}
        onSort={(e) => {
          setRestSearchObject({
            sortBy: e.sortOrder ? `"${e.sortField}":${e.sortOrder}` : null,
          })
        }}

        // metaKeySelection={metaKey}
        // tableStyle={{ minWidth: '50rem' }}
      >
        {columns.map((col) => (
          <Column
            {...col}
            filterApply={(options) => {
              return (
                <Button
                  label={t('Apply')}
                  onClick={options.filterApplyCallback}
                ></Button>
              )
            }}
            filterClear={(options) => {
              return (
                <Button
                  outlined
                  label={t('Clear')}
                  onClick={options.filterClearCallback}
                ></Button>
              )
            }}
            field={col.dataIndex ?? col.key}
            key={col.key}
            style={col.width ? { width: col.width } : null}
          ></Column>
        ))}
        {showActionColumn ? (
          <Column
            header={t('Action')}
            field="action"
            style={{ width: actionWidth ?? '12%' }}
            body={(rowData) => {
              return (
                <div className="flex gap-2">
                  {actionColumns?.map((btn) => {
                    const btnContent =
                      btn.href && !btn.disabled?.(rowData) ? (
                        <Link
                          key={btn.key}
                          to={btn.href(rowData)}
                          onClick={btn.action}
                          target={btn.linkTarget}
                          className="flex justify-content-center align-items-center cursor-pointer text-gray-500 no-underline"
                          style={{ width: 20, height: 20 }}
                        >
                          {btn.icon}
                        </Link>
                      ) : (
                        <div
                          key={btn.key}
                          onClick={
                            btn.disabled && btn.disabled(rowData)
                              ? null
                              : () =>
                                  btn.showConfirm
                                    ? confirmDialog({
                                        message: t('doyouwant', {
                                          action: t('delele this record'),
                                        }),
                                        header: t('confirmation', {
                                          action: t('Delete'),
                                        }),

                                        defaultFocus: 'reject',
                                        acceptClassName: 'p-button-danger',
                                        accept: () => btn.action(rowData),
                                        acceptLabel: t('Yes'),
                                        rejectLabel: t('No'),
                                        ...btn.showConfirm,
                                      })
                                    : btn.action(rowData)
                          }
                          className={clsx(
                            'flex justify-content-center align-items-center cursor-pointer ',
                            btn.disabled && btn.disabled(rowData)
                              ? 'text-gray-200 '
                              : 'text-gray-900'
                          )}
                          style={{
                            width: 20,
                            height: 20,
                          }}
                        >
                          {btn.icon}
                        </div>
                      )
                    return btn.tooltip ? (
                      <Tippy key={btn.key} content={btn.tooltip}>
                        {btnContent}
                      </Tippy>
                    ) : (
                      <Fragment key={btn.key}>{btnContent}</Fragment>
                    )
                  })}
                </div>
              )
            }}
          ></Column>
        ) : null}
      </DataTable>
      {pagination && pagination.total && pagination.page ? (
        <Paginator
          first={(pagination.page - 1) * pagination.limit}
          rows={pagination.limit}
          totalRecords={pagination.total}
          template={{
            layout:
              'CurrentPageReport FirstPageLink PrevPageLink  PageLinks NextPageLink LastPageLink RowslimitDropdown',
            CurrentPageReport: (options) => {
              return (
                <span>
                  {isNaN(options.first) ? 0 : options.first} -{' '}
                  {isNaN(options.last) ? 0 : options.last ?? 0} of{' '}
                  {options.totalRecords ?? 0}
                </span>
              )
            },
          }}
          rowsPerPageOptions={[10, 20, 50]}
          onPageChange={(e) =>
            setRestSearchObject({
              page: e.page + 1,
              limit: e.rows,
            })
          }
          className="justify-content-center"
        />
      ) : null}
    </div>
  )
}
export default observer(BaseManagementComponent)
