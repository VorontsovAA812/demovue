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
        >
      
      </textarea>
      </div>

      <button class="submit-button"
              @click.stop ="saveDocument()"
      >
        Скомпилировать(сохранить) документ
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue'
const documentTitle = ref('Новый документ')

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
  try{
    const response = await $fetch(`/api-proxy/documents/${documentId}`,{
         method: "GET"
    });
    content.value = response.content;
    documentTitle.value = response.title
  }
  catch(error)
  {
    console.error('Ошибка при загрузке документа:', error);

  }

  
  
}


async function saveDocument(){
  
  try {
    const response = await $fetch(`/api-proxy/documents/${documentId}`,{
      method: "PATCH",
      body: {
        title: documentTitle.value,
        content: content.value
      }
    });
    
    // Показываем алерт при успешном сохранении
    alert('Документ успешно сохранен!');
    
    return response;
  } catch (error) {
    // Опционально: обработка ошибок
    console.error('Ошибка при сохранении документа:', error);
    alert('Произошла ошибка при сохранении документа');
  }
}






const goToDocuments = () => {
  router.push('/documents');
};

onMounted(fetchDocumentContent)

</script>

<style scoped>
@import url("~/assets/css/editor.css");

</style>