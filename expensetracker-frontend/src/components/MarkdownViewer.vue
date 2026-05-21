<!-- src/components/MarkdownViewer.vue -->
<template>
    <div>
      <div v-if="props.markdown" v-html="renderedMarkdown" class="markdown-content"></div>
      <div v-else class="markdown-placeholder">
        <v-icon icon="mdi-file-document-outline" size="large" color="grey" class="mb-2"></v-icon>
        <p>No hay contenido para mostrar</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, watch } from 'vue'
  import MarkdownIt from 'markdown-it'
  
  // Recibimos el markdown como prop
  const props = defineProps({
    markdown: {
      type: String,
      default: ''
    }
  })
  
  // Instanciamos Markdown-It con algunas opciones adicionales
  const md = new MarkdownIt({
    html: true,          // Habilitar HTML en el markdown
    linkify: true,       // Autodetectar URLs y convertirlas en enlaces
    typographer: true,   // Habilitar sustituciones tipográficas
    breaks: true         // Convertir saltos de línea en <br>
  })
  
  // Añadir plugins o configuraciones adicionales si se necesitan
  // Por ejemplo, podríamos agregar soporte para resaltado de sintaxis, etc.
  
  // Convertimos el markdown a HTML con detección de cambios
  const renderedMarkdown = computed(() => {
    if (!props.markdown) return ''
    try {
      return md.render(props.markdown)
    } catch (error) {
      console.error('Error al renderizar markdown:', error)
      return '<p class="text-error">Error al renderizar el contenido</p>'
    }
  })
  
  // Observar cambios para debug
  watch(() => props.markdown, (newVal) => {
    console.log('Markdown actualizado:', newVal?.substring(0, 50) + (newVal?.length > 50 ? '...' : ''))
  })
  </script>
  
  <style>
  /* Estilos para el contenido Markdown renderizado */
  .markdown-content {
    font-family: var(--expense-body-font);
    line-height: 1.6;
    color: var(--expense-text);
  }
  
  .markdown-content h1 {
    font-size: 1.8rem;
    margin-top: 1.2rem;
    margin-bottom: 1rem;
    font-weight: 600;
    color: var(--expense-primary-dark);
  }
  
  .markdown-content h2 {
    font-size: 1.5rem;
    margin-top: 1rem;
    margin-bottom: 0.8rem;
    font-weight: 500;
    color: var(--expense-primary);
  }
  
  .markdown-content h3, .markdown-content h4 {
    margin-top: 0.8rem;
    margin-bottom: 0.6rem;
    font-weight: 500;
  }
  
  .markdown-content p {
    margin-bottom: 1rem;
  }
  
  .markdown-content ul, .markdown-content ol {
    padding-left: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .markdown-content li {
    margin-bottom: 0.5rem;
  }
  
  .markdown-content a {
    color: var(--expense-primary);
    text-decoration: none;
  }
  
  .markdown-content a:hover {
    text-decoration: underline;
  }
  
  .markdown-content blockquote {
    border-left: 4px solid var(--expense-primary);
    padding-left: 1rem;
    margin-left: 0;
    margin-right: 0;
    font-style: italic;
    color: var(--expense-muted);
  }
  
  .markdown-content pre {
    background-color: #eef4f9;
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
  }
  
  .markdown-content code {
    background-color: #eef4f9;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: 'Roboto Mono', monospace;
    font-size: 0.9em;
  }
  
  .markdown-content hr {
    border: 0;
    height: 1px;
    background-color: #d9e4ee;
    margin: 1.5rem 0;
  }
  
  .markdown-content img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
  }
  
  .markdown-content table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 1rem;
  }
  
  .markdown-content th, .markdown-content td {
    border: 1px solid #d9e4ee;
    padding: 0.5rem;
  }
  
  .markdown-content th {
    background-color: #eef4f9;
    font-weight: 500;
  }
  
  /* Placeholder cuando no hay markdown */
  .markdown-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    color: var(--expense-muted);
    background-color: #eef4f9;
    border-radius: 4px;
    text-align: center;
  }
  </style>
