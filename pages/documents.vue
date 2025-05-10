<template>
  <div class="page-container">
    <!-- Обёртка для карточки и кнопки -->
    <div class="content-wrapper">
      <!-- Карточка с документами -->
      <Card class="documents-card">
        <ListGroup flush>
          <ListGroupItem
  v-for="document in documents"
  :key="document.id"
  class="d-flex justify-content-between align-items-center larger-item"
>
  <div class="flex-grow-1">
    <NuxtLink :to="`/editor/${document.id}`">
      {{ document.title }}
    </NuxtLink>
    <div class="text-muted small mt-1">
  <span v-if="document.owner">Автор: вы</span>
  <span v-else>Автор: {{ document.author }}</span>
</div>

  </div>

  <BButton 
    variant="danger" 
    size="sm" 
    @click.stop="deleteDocument(document.id)">
    Удалить
  </BButton>
</ListGroupItem>

        </ListGroup>
        <CardFooter>Доступные документы</CardFooter>
      </Card>

      <!-- Кнопка Primary справа -->
      <BButton 
        class="primary-button"
        variant="success"
        @click="createDocument"
        size="lg"
        color="primary-subtle" 
      >
      Cоздать новый документ

   </BButton>
    </div>
  </div>
</template>

<script setup>
import '~/assets/css/documents.css'

import { onMounted, ref } from 'vue'

const documents = ref([])

const router = useRouter()
console.log("client:" + import.meta.client, "server:"+ import.meta.server)

async function deleteDocument(documentId) {
  try {
    await $fetch(`/api-proxy/documents/${documentId}`, {
      method: 'DELETE'
    })
    documents.value = documents.value.filter(doc => doc.id !== documentId)
  } catch (error) {
    alert('Ошибка при удалении документа: ' + (error?.data?.message || error.message))
  }
}


async function loadDocuments() {
  const data = await $fetch('/api-proxy/documents/documentList')
  documents.value = data
  console.log(documents.value)
}




async function createDocument() {
  router.push('/editor/new')

  

}



onMounted(async () => {
  await loadDocuments()
})
 

</script>

<style scoped>

</style>