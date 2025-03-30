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
            <NuxtLink :to="`/editor/${document.id}`" class="flex-grow-1">
              {{ document.title }}
            </NuxtLink>
            <BButton variant="danger" size="sm" @click.stop="deleteDocument(document.id)">
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
        @click="handlePrimaryClick"
        size="lg"
        color="primary-subtle" 
      >
      Cоздать новый документ

   </BButton>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const documents = ref([])

const router = useRouter()


function deleteDocument(documentId) {
  documents.value = documents.value.filter(doc => doc.id !== documentId)
}

async function loadDocuments() {
  const data = await $fetch('/api-proxy/documents/documentList')
  documents.value = data
}






function handlePrimaryClick() {
  console.log('Primary button clicked')
  
  
  router.push('/editor')
  
  // Добавьте здесь нужную логику
}

onMounted(loadDocuments)
</script>

<style scoped>
a {
  text-decoration: none !important;
  transition: all 0.2s ease;
  color:black;
}
.page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.content-wrapper {
  position: relative;
  width: 100%;
  max-width: 700px; /* Увеличим общую ширину */
}

.documents-card {
  width: 100%;
}

.primary-button {
  position: absolute;
  top: 0;
  right: -320px; /* Выносим кнопку за пределы карточки */
  width: 280px;
  text-decoration: none !important; /* Убираем подчеркивание */

}

/* Адаптация для мобильных устройств */
@media (max-width: 768px) {
  .content-wrapper {
    max-width: 100%;
  }
  
  .primary-button {
    position: static;
    margin-top: 20px;
    width: 100%;
    right: auto;
  }
}
</style>