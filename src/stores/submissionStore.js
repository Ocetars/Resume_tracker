import { defineStore } from 'pinia'

export const useSubmissionStore = defineStore('submission', {
  state: () => ({
    submissions: []
  }),
  actions: {
    addSubmission(submission) {
      this.submissions.unshift(submission)
    },
    removeSubmission(index) {
      this.submissions.splice(index, 1)
    }
  }
})