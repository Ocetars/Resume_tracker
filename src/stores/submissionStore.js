import { defineStore } from 'pinia'

export const useSubmissionStore = defineStore('submission', {
  state: () => ({
    submissions: []
  }),
  actions: {
    addSubmission(submission) {
      this.submissions.push({
        ...submission,
        interviewType: '',
        appointmentDate: submission.appointmentDate || ''
      })
    },
    removeSubmission(index) {
      this.submissions.splice(index, 1)
    }
  },
  getters: {
    getSubmissions: (state) => state.submissions
  },
  persist: {
    key: 'job-submissions',
    storage: localStorage,
    paths: ['submissions']
  }
})