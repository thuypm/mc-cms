declare module 'Params' {
  export interface BaseParams {
    page?: number
    limit?: number
    sort?: string
    [key: string]: any
  }

  export interface FilterParams extends BaseParams {
    keyword?: string
    sortBy?: string
  }

  export interface FilterParamsDataWarehouse extends FilterParams {
    project?: string
    parent?: string
    keyword?: string
  }

  export interface FilterParamsSalePolicy extends FilterParams {
    project?: string
  }

  export interface FilterParamsPaymentProgress extends FilterParams {
    project?: string
    salesPolicy?: string
  }

  export interface FilterParamsPriceSlip extends FilterParams {
    project?: string
    projectType?: string
  }

  export interface FilterParamsCustomer extends FilterParams {
    
  }
}
