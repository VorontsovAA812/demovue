import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export function useEditor() {
  const documentTitle = ref('Новый документ');
  const content = ref('');
  const pdfUrl = ref('');
  const showPreview = ref(false);
  const isCompiling = ref(false);
  const inviteUsername = ref('');

  const router = useRouter();
  const route = useRoute();
  const documentId = route.params.id;
  const isNewPage = ref(documentId === 'new');

  const goToDocuments = () => {
    router.push('/documents');
  };

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

  async function saveDocument() {
    try {
      if (isNewPage.value) {
        const response = await $fetch('/api-proxy/documents', {
          method: "POST",
          body: { title: documentTitle.value, content: content.value }
        });
        const newId = response.documentId;
        await router.push(`/editor/${newId}`);
        isNewPage.value = false;
        alert('Документ успешно создан!');
        return;
      }

      await $fetch(`/api-proxy/documents/${documentId}`, {
        method: "PATCH",
        body: { title: documentTitle.value, content: content.value }
      });

      alert('Документ успешно сохранен!');
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
      const compileRequest = {
        id: parseInt(documentId),
        title: documentTitle.value,
        content: content.value
      };

      const response = await $fetch('/api-proxy/documents/compile', {
        method: 'POST',
        body: compileRequest,
        responseType: 'blob'
      });

      const pdfBlob = new Blob([response], { type: 'application/pdf' });
      pdfUrl.value = URL.createObjectURL(pdfBlob);
      showPreview.value = true;
    } catch (error) {
      console.error('Ошибка при компиляции LaTeX:', error);
      alert('Произошла ошибка при компиляции документа');
    } finally {
      isCompiling.value = false;
    }
  }
async function inviteUser() {
  if (!inviteUsername.value.trim()) return alert('Введите имя пользователя');
  try {
    await $fetch(`/api-proxy/documents/${documentId}/invite/${inviteUsername.value}`, {
      method: 'POST'
    });
    alert(`Пользователь ${inviteUsername.value} приглашён`);
    inviteUsername.value = '';
  } catch (e) {
    console.error(e);
    alert('Ошибка при приглашении пользователя');
  }
}
  

  return {
    documentTitle,
    content,
    pdfUrl,
    showPreview,
    inviteUsername,
    isCompiling,
    isNewPage,
    goToDocuments,
    fetchDocumentContent,
    saveDocument,
    compileDocument,
    inviteUser
  };
}
