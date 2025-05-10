<template>
  <div class="latex-container">
    <!-- Кнопка "Назад" слева -->
    <button class="back-button" @click="goToDocuments">
      ← Назад
    </button>

  <!-- Кнопка и поле справа вверху -->
<div class="invite-floating">
  <input
    v-model="inviteUsername"
    placeholder="Имя пользователя"
    class="invite-input-fixed"
  />
  <button class="invite-btn-fixed" @click="inviteUser">Пригласить</button>
</div>

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
import { onMounted } from 'vue';
import { useEditor } from '@/composables/useEditor';



const {
  documentTitle,
  content,
  pdfUrl,
  showPreview,
  isCompiling,
  isNewPage,
  goToDocuments,
  fetchDocumentContent,
  saveDocument,
  compileDocument,
  inviteUser,
  inviteUsername,
} = useEditor();

onMounted(fetchDocumentContent);



</script>

<style>
@import url("~/assets/css/editor.css");
@import url("~/assets/css/preview.css");
@import url("~/assets/css/inviteButton.css");






</style>