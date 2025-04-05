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
            class="d-flex justify-content-between align-items-center larger-item">

            <NuxtLink :to="`/editor/${document.id}`" class="flex-grow-1">
              {{ document.title }}
            </NuxtLink>

            <BButton 
            variant="danger" 
            size="sm" 
            @click.stop="deleteDocument(document.id)">
              Удалить
            </BButton>

          </ListGroupItem>
        </ListGroup>
        <CardFooter>Ваши документы</CardFooter>
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

function deleteDocument(documentId) {
  documents.value = documents.value.filter(doc => doc.id !== documentId)
}

async function loadDocuments() {
  const data = await $fetch('/api-proxy/documents/documentList')
  documents.value = data
}




async function createDocument() {
  router.push('/editor/new')

  

  const response = await $fetch('/api-proxy/documents',{
  method: "POST",
  body:{ title: "Новый документ",
      content: ""
  }
});

}
  


onMounted(loadDocuments)
</script>

<style scoped>

</style>