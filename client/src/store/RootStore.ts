import { BrowserHistory } from 'history'
import AuthStore from './AuthStore'
import CustomerManagementStore from './BranchGroup/CustomerManagementStore'
import DayBoardingStore from './BranchGroup/DayBoardingStore'
import EmailTemplateStore from './BranchGroup/EmailTemplateStore'
import EventManagementStore from './BranchGroup/EventManagementStore'
import EventRegistrationStore from './BranchGroup/EventRegistrationStore'
import AdminManagementStore from './HeadQuarterGroup/AdminManagementStore'
import BranchManagementStore from './HeadQuarterGroup/BranchManagementStore'
import ContactManagementStore from './HeadQuarterGroup/ContactManagementStore'
import HeadQuaterInfoStore from './HeadQuarterGroup/HeadQuaterInfoStore'

class RootStore {
  history: BrowserHistory
  authStore: AuthStore
  adminManagementStore: AdminManagementStore
  branchManagementStore: BranchManagementStore
  headQuarterInfoStore: HeadQuaterInfoStore
  contactStore: ContactManagementStore
  //branch
  eventManamentStore: EventManagementStore
  eventRegistrationStore: EventRegistrationStore
  emailTemplateStore: EmailTemplateStore
  custormerManagementStore: CustomerManagementStore
  dayBoardingStore: DayBoardingStore

  constructor(history) {
    this.history = history
    this.authStore = new AuthStore(this)

    this.branchManagementStore = new BranchManagementStore(this)
    this.adminManagementStore = new AdminManagementStore(this)
    this.headQuarterInfoStore = new HeadQuaterInfoStore(this)
    this.contactStore = new ContactManagementStore(this)

    //branch
    this.eventManamentStore = new EventManagementStore(this)
    this.eventRegistrationStore = new EventRegistrationStore(this)
    this.emailTemplateStore = new EmailTemplateStore(this)
    this.custormerManagementStore = new CustomerManagementStore(this)
    this.dayBoardingStore = new DayBoardingStore(this)

    //common
  }
}

export default RootStore
