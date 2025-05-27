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
   async function fetchDocumentContent() {
      if (isNewPage.value) {
        content.value = '';
        return;
      }
      try {
        const response = await $fetch(`/api-proxy/documents/${documentId}`);
        content.value = response.content;
        documentTitle.value = response.title;
      } catch (error) {
        console.error('Ошибка при загрузке документа:', error);
      }
    }

  const restoreCommit = async (commitId) => {
  try {
    await $fetch(`/api-proxy/git/${documentId}/restore`, {
      method: 'POST',
      body: { commitId } // передаём конкретный ID
    })
      await fetchCommits()
      await fetchDocumentContent()
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
