import { defineStore } from 'pinia'

export const useSubmissionStore = defineStore('submission', {
  state: () => ({
    submissions: []
  }),
  actions: {
    async addSubmission(submission) {
      await new Promise(resolve => setTimeout(resolve, 100)) // 小延迟使动画更流畅
      this.submissions.push({
        ...submission,
        interviewType: '',
        appointmentDate: submission.appointmentDate || ''
      })
    },
    async removeSubmission(index) {
      await new Promise(resolve => setTimeout(resolve, 100))
      this.submissions.splice(index, 1)
    },
    async updateSubmission(index, newData) {
      await new Promise(resolve => setTimeout(resolve, 100))
      this.submissions[index] = { ...this.submissions[index], ...newData }
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