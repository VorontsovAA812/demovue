<template>
  <div class="latex-container">
    <!-- ВЕРХНЯЯ ПАНЕЛЬ -->
    <div class="editor-header-full">
      <button class="back-button" @click="goToDocuments">← Назад к документам</button>

      <h1 class="editor-title">Редактор документов</h1>

      <div class="invite-floating">
        <input
          v-model="inviteUsername"
          placeholder="Имя пользователя"
          class="invite-input-fixed"
        />
        <button class="invite-btn-fixed" @click="inviteUser">Пригласить</button>
      </div>
    </div>

    <!-- ОСНОВНОЙ КОНТЕНТ -->
    <div class="editor-content">
      <!-- Левая часть -->
      <div class="editor-left">
        <div class="document-title-input mb-3">
          <input
            v-model="documentTitle"
            type="text"
            class="form-control"
            placeholder="Название документа"
          />
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

        <!-- БЛОК ПРОСМОТРА PDF -->
        <div v-if="showPreview && pdfUrl" class="pdf-preview mt-4">
          <h5>Предпросмотр PDF</h5>
          <iframe
            :src="pdfUrl"
            width="100%"
            height="600px"
            style="border: 1px solid #ccc; border-radius: 8px;"
          ></iframe>

          <a
            :href="pdfUrl"
            download="compiled.pdf"
            class="btn btn-outline-success mt-2"
          >
            ⬇ Скачать PDF
          </a>
        </div>
      </div>

      <!-- Правая часть -->
      <div class="commits-panel">
        <h4>История версий</h4>
        <ul>
          <li v-for="commit in commits" :key="commit.id" class="commit-item">
            <div><strong>{{ commit.author }}</strong></div>
            <div class="small">{{ commit.date}}</div>
            <div class="small">{{ commit.message }}</div>
            <button class="btn btn-sm btn-outline-primary mt-1" @click="restoreCommit(commit.id)">
              ⟳ Вернуться
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>


<script setup>
definePageMeta({
  layout: false
})

import { onMounted } from 'vue'
import { useEditor } from '@/composables/useEditor'
import { useCommits } from '@/composables/useCommits'

// Работа с коммитами
const { commits, fetchCommits, restoreCommit } = useCommits()
// Редактирование документа
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
  inviteUsername
} = useEditor({ fetchCommits })



onMounted(() => {
  fetchDocumentContent()
  fetchCommits() // ID внутри useCommits
})


</script>

<style>
@import url("~/assets/css/editor.css");
@import url("~/assets/css/preview.css");
@import url("~/assets/css/commits.css");
@import url("~/assets/css/inviteButton.css");
@import url("~/assets/css/panel.css");



</style>