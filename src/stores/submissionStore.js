import { defineStore } from 'pinia'

export const useSubmissionStore = defineStore('submission', {
  state: () => ({
    submissions: []
  }),
  actions: {
    addSubmission(submission) {
      this.submissions.unshift(submission)
    }
  }
})