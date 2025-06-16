<template>
  <div class="page-container">
    <div class="content-wrapper">

      <!-- 👋 Приветствие + кнопка под ним -->
      <Card class="documents-card mb-4 p-3">
        <!-- Приветствие -->
        <div class="welcome-banner mb-2">
          <span v-if="currentUsername" class="text-muted fs-5">
            👋 Добро пожаловать, {{ currentUsername }}!
          </span>
        </div>

        <!-- Кнопка справа -->
        <div class="d-flex justify-content-end">
          <BButton 
            class="primary-button"
            variant="success"
            @click="createDocument"
            size="lg"
            color="primary-subtle">
            Создать новый документ
          </BButton>
        </div>
      </Card>

      <!-- 📄 Список документов -->
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
    </div>
  </div>
</template>

<script setup>
import '~/assets/css/documents.css'
import { onMounted, ref } from 'vue'

const documents = ref([])
const currentUsername = ref(null)
const router = useRouter()

// Загрузка документов
async function loadDocuments() {
  try {
    const data = await $fetch('/api-proxy/documents/documentList')
    documents.value = data
    console.log(documents.value)
  } catch (e) {
    console.error('Ошибка при загрузке документов', e)
  }
}

// Удаление документа
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

// Создание нового документа
async function createDocument() {
  router.push('/editor/new')
}

// Получение текущего пользователя
async function loadCurrentUser() {
  try {
    const user = await $fetch('/api-proxy/usr/currentname')
    currentUsername.value = user.username
  } catch (e) {
    console.error('Не удалось загрузить текущего пользователя', e)
  }
}

// Инициализация при загрузке
onMounted(async () => {
  await loadDocuments()
  await loadCurrentUser()
})
</script>

<style scoped>
.welcome-banner {
  font-weight: 500;
  text-align: left;
  width: fit-content;
}
</style>
