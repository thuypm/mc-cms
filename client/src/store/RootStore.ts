import { BrowserHistory } from 'history'
import AuthStore from './AuthStore'
import BranchManagementStore from './HeadQuarterGroup/BranchManagementStore'
import AdminManagementStore from './HeadQuarterGroup/AdminManagementStore'
import HeadQuaterInfoStore from './HeadQuarterGroup/HeadQuaterInfoStore'
import EventManagementStore from './BranchGroup/EventManagementStore'
import EventRegistrationStore from './BranchGroup/EventRegistrationStore'
import EmailTemplateStore from './BranchGroup/EmailTemplateStore'
import CustomerManagementStore from './BranchGroup/CustomerManagementStore'
import EnewLetterStore from './BranchGroup/EnewLetterStore'
import ContactManagementStore from './HeadQuarterGroup/ContactManagementStore'
import MessageStore from './HeadQuarterGroup/MessageStore'

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
  enewLetterStore: EnewLetterStore
  messageStore: MessageStore

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
    this.enewLetterStore = new EnewLetterStore(this)

    //common
    this.messageStore = new MessageStore(this)
  }
}

export default RootStore
