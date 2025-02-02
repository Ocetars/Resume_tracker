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
  }
})