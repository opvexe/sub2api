<template>
  <Teleport to="body">
    <Transition name="popup-fade">
      <div
        v-if="displayedAnnouncement"
        class="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm sm:p-6"
        role="dialog"
        aria-modal="true"
        :aria-label="displayedAnnouncement.title"
      >
        <div
          class="popup-card flex max-h-[min(80vh,700px)] w-full max-w-[600px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-900/5 dark:bg-dark-800 dark:ring-white/10"
          @click.stop
        >
          <!-- Header -->
          <header class="flex items-start gap-3 border-b border-gray-100 px-5 py-4 dark:border-dark-700 sm:px-6 sm:py-5">
            <div class="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
              <Icon name="bell" size="md" />
            </div>

            <div class="min-w-0 flex-1">
              <h2 class="text-base font-semibold leading-6 text-gray-900 dark:text-white sm:text-lg">
                {{ displayedAnnouncement.title }}
              </h2>
              <div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                <time>{{ formatRelativeWithDateTime(displayedAnnouncement.created_at) }}</time>
                <span v-if="!preview" class="inline-flex items-center rounded-full bg-primary-50 px-2 py-0.5 font-medium text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                  {{ t('announcements.unread') }}
                </span>
              </div>
            </div>

            <button
              @click="handleDismiss"
              type="button"
              data-testid="announcement-popup-close"
              class="-mr-1 -mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-dark-700 dark:hover:text-gray-300"
              :aria-label="t('common.close')"
            >
              <Icon name="x" size="sm" />
            </button>
          </header>

          <!-- Body -->
          <div class="popup-body flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            <div
              class="markdown-body prose prose-sm max-w-none dark:prose-invert"
              v-html="renderedContent"
            ></div>
          </div>

          <!-- Footer -->
          <footer class="flex items-center justify-end border-t border-gray-100 bg-gray-50/60 px-5 py-3.5 dark:border-dark-700 dark:bg-dark-900/30 sm:px-6">
            <button
              @click="handleDismiss"
              type="button"
              data-testid="announcement-popup-dismiss"
              class="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-800"
            >
              <Icon :name="preview ? 'x' : 'check'" size="sm" />
              {{ preview ? t('common.close') : t('announcements.markRead') }}
            </button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import Icon from '@/components/icons/Icon.vue'
import { useAnnouncementStore } from '@/stores/announcements'
import { formatRelativeWithDateTime } from '@/utils/format'
import type { Announcement, UserAnnouncement } from '@/types'
import '@/styles/announcement-markdown.css'

type PreviewAnnouncement = Pick<Announcement | UserAnnouncement, 'title' | 'content' | 'created_at'>

const props = withDefaults(defineProps<{
  announcement?: PreviewAnnouncement | null
  preview?: boolean
}>(), {
  announcement: null,
  preview: false,
})

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()
const announcementStore = useAnnouncementStore()
const displayedAnnouncement = computed(() => (
  props.preview ? props.announcement : announcementStore.currentPopup
))

marked.setOptions({
  breaks: true,
  gfm: true,
})

const renderedContent = computed(() => {
  const content = displayedAnnouncement.value?.content
  if (!content) return ''
  const html = marked.parse(content) as string
  return DOMPurify.sanitize(html)
})

function handleDismiss() {
  if (props.preview) {
    emit('close')
    return
  }
  announcementStore.dismissPopup()
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    handleDismiss()
  }
}

// Manage body overflow — only set, never unset (bell component handles restore)
watch(
  displayedAnnouncement,
  (popup) => {
    if (popup) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleKeydown)
    } else {
      document.removeEventListener('keydown', handleKeydown)
      if (props.preview) {
        document.body.style.overflow = ''
      }
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  if (props.preview) {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.popup-fade-enter-active,
.popup-fade-leave-active {
  transition: opacity 0.2s ease;
}

.popup-fade-enter-active .popup-card {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
}

.popup-fade-leave-active .popup-card {
  transition: transform 0.15s ease-in, opacity 0.15s ease-in;
}

.popup-fade-enter-from,
.popup-fade-leave-to {
  opacity: 0;
}

.popup-fade-enter-from .popup-card,
.popup-fade-leave-to .popup-card {
  transform: scale(0.97) translateY(8px);
  opacity: 0;
}

/* Scrollbar — thin and unobtrusive, only inside the scrolling body */
.popup-body {
  scrollbar-width: thin;
  scrollbar-color: theme('colors.gray.300') transparent;
}

.popup-body::-webkit-scrollbar {
  width: 6px;
}

.popup-body::-webkit-scrollbar-track {
  background: transparent;
}

.popup-body::-webkit-scrollbar-thumb {
  background-color: theme('colors.gray.300');
  border-radius: 999px;
}

.popup-body::-webkit-scrollbar-thumb:hover {
  background-color: theme('colors.gray.400');
}

:global(.dark) .popup-body {
  scrollbar-color: theme('colors.dark.600') transparent;
}

:global(.dark) .popup-body::-webkit-scrollbar-thumb {
  background-color: theme('colors.dark.600');
}

:global(.dark) .popup-body::-webkit-scrollbar-thumb:hover {
  background-color: theme('colors.dark.500');
}
</style>
