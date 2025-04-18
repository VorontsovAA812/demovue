<template>
  <div class="latex-container">
    <!-- Кнопка "Назад" слева -->
    <button class="back-button" @click="goToDocuments">
      ← Назад
    </button>

    <div class="editor-content">
      <div class="document-title-input mb-3">
        <input 
          v-model="documentTitle" 
          type="text" 
          class="form-control" 
          placeholder="Название документа"
        >
      </div>

      <div class="latex-input">
        <textarea 
          v-model="content"
          class="form-control rounded-3 shadow-sm p-3"
          rows="20"
          placeholder="Введите LaTeX-код здесь..."
          style="font-family: 'Courier New', monospace; font-size: 16px;"
        ></textarea>
      </div>

      <div class="buttons-container">
        <button class="submit-button" @click.stop="saveDocument()">
          Сохранить документ
        </button>
        <button class="compile-button" @click.stop="compileDocument()" :disabled="isCompiling">
          {{ isCompiling ? 'Компиляция...' : 'Скомпилировать и просмотреть' }}
        </button>
      </div>
      
      <!-- PDF Preview Section -->
      <div class="pdf-preview-section" v-if="showPreview">
        <h3 class="preview-title">Предпросмотр документа</h3>
        <div class="pdf-container" v-if="pdfUrl">
          <iframe :src="pdfUrl" class="pdf-frame"></iframe>
        </div>
        <div class="no-preview" v-else>
          <p>Нажмите "Скомпилировать и просмотреть" для отображения документа</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';

const documentTitle = ref('Новый документ');
const content = ref('');
const pdfUrl = ref('');
const showPreview = ref(false);
const isCompiling = ref(false);

const router = useRouter();
const route = useRoute();
const documentId = route.params.id;

const isNewPage = ref(documentId === 'new');

async function fetchDocumentContent() {
  if (isNewPage.value) {
    content.value = '';
    return;
  }
  try {
    const response = await $fetch(`/api-proxy/documents/${documentId}`, {
      method: "GET"
    });
    content.value = response.content;
    documentTitle.value = response.title;
  } catch (error) {
    console.error('Ошибка при загрузке документа:', error);
  }
}

async function saveDocument() {
  if (isNewPage.value) {
    try {
      const response = await $fetch('/api-proxy/documents', {
        method: "POST",
        body: { 
          title: documentTitle.value,
          content: content.value
        }
      });
      const newDocumentId = response.documentId;
      await router.push(`/editor/${newDocumentId}`);
      isNewPage.value = false;
      alert('Документ успешно создан!');
    } catch (error) {
      console.error('Ошибка создания:', error);
      alert('Ошибка при создании документа');
    }
    return;
  }

  try {
    const response = await $fetch(`/api-proxy/documents/${documentId}`, {
      method: "PATCH",
      body: {
        title: documentTitle.value,
        content: content.value
      }
    });
    
    alert('Документ успешно сохранен!');
    return response;
  } catch (error) {
    console.error('Ошибка при сохранении документа:', error);
    alert('Произошла ошибка при сохранении документа');
  }
}

async function compileDocument() {
  if (isNewPage.value) {
    alert('Пожалуйста, сохраните документ перед компиляцией');
    return;
  }
  
  isCompiling.value = true;
  
  try {
    // Создаем объект запроса для компиляции
    const compileRequest = {
      id: parseInt(documentId),
      title: documentTitle.value,
      content: content.value
    };
    
    // Отправляем запрос на компиляцию
    const response = await $fetch('/api-proxy/documents/compile', {
      method: 'POST',
      body: compileRequest,
      responseType: 'blob'
    });
    
    // Создаем URL для отображения PDF
    const pdfBlob = new Blob([response], { type: 'application/pdf' });
    const pdfObjectUrl = URL.createObjectURL(pdfBlob);
    
    pdfUrl.value = pdfObjectUrl;
    showPreview.value = true;
    
  } catch (error) {
    console.error('Ошибка при компиляции LaTeX:', error);
    alert('Произошла ошибка при компиляции документа');
  } finally {
    isCompiling.value = false;
  }
}

const goToDocuments = () => {
  router.push('/documents');
};

onMounted(fetchDocumentContent);
</script>

<style scoped>
@import url("~/assets/css/editor.css");

/* стили для предпросмотра */
.buttons-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.compile-button {
  flex: 1;
  padding: 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.compile-button:hover {
  background-color: #218838;
}

.compile-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.submit-button {
  flex: 1;
}

.pdf-preview-section {
  width: 100%;
  margin-top: 20px;
  border-top: 1px solid #dee2e6;
  padding-top: 20px;
}

.preview-title {
  font-size: 1.5rem;
  margin-bottom: 15px;
}

.pdf-container {
  width: 100%;
  height: 600px;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  overflow: hidden;
}

.pdf-frame {
  width: 100%;
  height: 100%;
  border: none;
}

.no-preview {
  width: 100%;
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  color: #6c757d;
}
</style>