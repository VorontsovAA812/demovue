<template>
  <div class="latex-container">
    <!-- Кнопка "Назад" слева -->
    <button class="back-button" @click="goToDocuments">
      ← Назад
    </button>

    <div class="editor-content">
      <div class="latex-input">
        <textarea 
          v-model="content"
          class="form-control rounded-3 shadow-sm p-3"
          rows="20"
          placeholder="Введите LaTeX-код здесь..."
          style="font-family: 'Courier New', monospace; font-size: 16px;"
        >
      
      </textarea>
      </div>

      <button class="submit-button">
        Скомпилировать LaTeX
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue'

const content = ref()

const router = useRouter();

// На странице редактора (/editor/[id].vue)
const route = useRoute();
const documentId = route.params.id;

const isNewPage = ref(documentId ==='new')

async function fetchDocumentContent() {
  if (isNewPage.value){
  content.value='';
    return;
  }


  
    const response = await $fetch(`/api-proxy/documents/findById/${documentId}`);
    console.log("Получен ответ:", response);
    
      content.value = response.content;
  
}
const goToDocuments = () => {
  router.push('/documents');
};

onMounted(fetchDocumentContent)

</script>

<style scoped>
.latex-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  position: relative;
}

.back-button {
  position: absolute;
  left: 20px;
  top: 20px;
  padding: 8px 20px;
  background-color: #f8f9fa;
  color: #212529;
  border: 1px solid #dee2e6;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  z-index: 1;
}

.back-button:hover {
  background-color: #e9ecef;
  transform: translateX(-3px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.editor-content {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  margin-top: 15px; /* Добавляем отступ сверху */
}

.latex-input {
  margin-bottom: 20px;
  width: 100%;
}

.latex-input textarea {
  width: 100%;
  resize: none; /* Запрещаем пользователю изменять размер */
}

.submit-button {
  width: 100%;
  padding: 12px;
  background-color: #0d6efd;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #0b5ed7;
}

/* Адаптивность */
@media (max-width: 768px) {
  .latex-container {
    padding-top: 70px;
  }
  
  .back-button {
    left: 50%;
    top: 15px;
    transform: translateX(-50%);
    width: max-content;
  }
}
</style>