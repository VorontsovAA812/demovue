import { ref } from 'vue'
import { useRoute } from 'vue-router'

export function useCommits() {
  const commits = ref([])
  const route = useRoute()
  const documentId = route.params.id

  const fetchCommits = async () => {
    try {
      const data = await $fetch(`/api-proxy/git/${documentId}/commits`, {
        method: 'GET'
      })
      commits.value = data
    } catch (error) {
      console.error('Ошибка при загрузке истории коммитов:', error)
    }
  }

  const restoreCommit = async (commitId) => {
    try {
      await $fetch(`/api-proxy/git/${documentId}/restore`, {
        method: 'POST',
        body: { commitId } // username убран, он задаётся на сервере
      })
      await fetchCommits()
    } catch (error) {
      console.error('Ошибка при откате к коммиту:', error)
    }
  }

  return {
    commits,
    fetchCommits,
    restoreCommit
  }
}
