<template>
  <div v-if="news.length > 0" class="modula-news-carousel mx-4 mt-2 h-full">
    <v-carousel
      height="100%"
      hide-delimiter-background
      show-arrows-on-hover
      cycle
      :interval="6000"
      class="news-carousel no-drag rounded-xl overflow-hidden shadow-2xl"
    >
      <v-carousel-item
        v-for="(entry, entryIndex) in news"
        :key="entry.id + entryIndex"
      >
        <div class="carousel-content relative h-full group cursor-pointer" @click="openLink(entry.readMoreLink)">
          <v-img
            :src="entry.playPageImage?.url || entry.newsPageImage?.url"
            height="100%"
            class="transition-transform duration-700 group-hover:scale-105"
            gradient="to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.9) 100%"
            cover
          >
            <template #placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="primary" />
              </v-row>
            </template>
          </v-img>

          <div class="absolute inset-x-0 bottom-0 p-10 pb-12">
            <transition name="slide-y-transition" appear>
              <div>
                <div class="flex items-center gap-3 mb-4">
                  <v-chip
                    v-if="entry.tag"
                    x-small
                    color="primary"
                    class="font-weight-bold px-3 py-1"
                    label
                  >
                    {{ entry.tag }}
                  </v-chip>
                  <span class="text-caption text-white/60 backdrop-blur-md bg-white/5 px-2 py-0.5 rounded border border-white/10">
                    <v-icon x-small color="white/60" class="mr-1">calendar_today</v-icon>
                    {{ entry.date }}
                  </span>
                </div>

                <h2 class="text-4xl font-black text-white mb-3 leading-tight tracking-tight drop-shadow-lg">
                  {{ entry.title }}
                </h2>

                <p class="text-lg text-white/80 line-clamp-2 mb-6 max-w-3xl leading-relaxed font-medium">
                  {{ entry.text }}
                </p>

                <div class="flex items-center gap-4">
                  <v-btn
                    color="primary"
                    class="font-weight-bold btn-modern px-6"
                    rounded
                    elevation="10"
                    @click.stop="openLink(entry.readMoreLink)"
                  >
                    LEARN MORE
                    <v-icon right small>arrow_forward</v-icon>
                  </v-btn>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script lang="ts" setup>
import { useMojangNews } from '@/composables/mojangNews'

const { news } = useMojangNews()

const openLink = (url: string) => {
  if (url) window.open(url, '_blank')
}
</script>

<style scoped>
.modula-news-carousel {
  position: relative;
  z-index: 2;
}

.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.news-content-overlay {
  background: linear-gradient(90deg, rgba(0,0,0,0.6) 0%, transparent 100%);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 40px !important;
}

.opacity-80 {
  opacity: 0.8;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

:deep(.v-carousel__controls) {
    bottom: 10px;
}
</style>
