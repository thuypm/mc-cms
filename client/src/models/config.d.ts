import { ImageS3 } from 'Models'

declare module 'Base' {
  export interface SortingConfig {
    DESC: string
    ASC: string
  }

  export interface RealEstateStatusConfig {
    RESERVATION: number
    READY_TO_TRADE: number
    NOT_READY_TO_TRADE: number
    DEPOSIT: number
    TRANSACTED: number
    SOLD: number
    TRANSFERRED: number
    INTERNAL_HANDOVER: number
    PARTIAL_HANDOVER: number
    WHOLE_HANDOVER: number
    NOT_COLLECTED_RECORDS: number
    COLLECT_MISSING_RECORDS: number
    COLLECT_ENOUGH_RECORDS: number
    UNSIGNED_LIQUIDATION_RECORDS: number
    SIGNED_LIQUIDATION_RECORDS: number
    DEPOSIT_DURING_CONTRACT: number
  }
  export interface DoorDirectionConfig {
    EAST: number
    WEST: number
    SOUTH: number
    NORTH: number
    SOUTHEAST: number
    NORTHEAST: number
    SOUTHWEST: number
    NORTHWEST: number
  }

  export interface PaymentScheduleTimeTypeEnum {
    EQUAL: number
    SCHEDULE: number
  }

  export interface BackendEnumConstant {
    sorting: SortingConfig
    realEstateStatus: RealEstateStatusConfig
    paymentScheduleTimeType: PaymentScheduleTimeTypeEnum
    doorDirections: DoorDirectionConfig
    promotionType: {
      VOUCHER: number
      DISCOUNT: number
      GIFT: number
    }
    projectTypeEnum: {
      LOW_RISE: string
      HIGH_RISE: string
      [key: string]: string
    }
    [key: string]: any
  }

  export interface BackendOptionsConstant {
    expiredAtRealEstate: number
    expiredAtTransactionDeposit: number
    limitLockRealEstate: number
    limitTransactionDeposit: number
  }
  export interface BackendConfigConstant {
    realEstateStatuses: (LabeledValue & {
      color?: {
        tagStyle?: string
        fill?: string
        stroke?: string
      }
    })[]
    doorDirections: LabeledValue[]
    headerFieldImportLowRises: LabeledValue[]
    totalFacadeConstant: LabeledValue[]
    areaConstants: LabeledValue[]
    priceConstants: LabeledValue[]
    totalBedroomConstants: LabeledValue[]
    totalBathroomConstants: LabeledValue[]
    promotionTypes: LabeledValue[]
    projectTypeArray: LabeledValue[]
    headerFiledImportHighRises: LabeledValue[]
    headerFieldImportLowRises: LabeledValue[]
    [key: string]: any
  }

  export interface BackendOptionConstant {
    limitLockRealEstate: number
    expiredAtRealEstate: number
    limitTransactionDeposit: number
    expiredAtTransactionDeposit: number
  }

  export interface IAppConfig {
    _id: string
    logo: { image: ImageS3; platform: number }[]
    background: { image: ImageS3; platform: number }[]
    name: string
  }
}
