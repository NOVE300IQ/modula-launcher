import useSWRV from 'swrv'
import { computed } from 'vue'
import { useSWRVConfig } from './swrvConfig'

export interface PlayPageImage {
  title: string
  url: string
}

export interface NewsPageImage {
  title: string
  url: string
  dimensions: {
    width: number
    height: number
  }

}
export interface NewsItem {
  title: string
  tag: string
  category: string
  date: string
  text: string
  playPageImage: PlayPageImage
  newsPageImage: NewsPageImage
  readMoreLink: string
  cardBorder: boolean
  newsType: string[]
  id: string
}
export function useMojangNews() {
  const { data, error, isValidating, mutate } = useSWRV('/news', async () => {
    try {
      const resp = await fetch('https://raw.githubusercontent.com/NOVE300IQ/modula-news/refs/heads/main/news.json')
      if (!resp.ok) return []
      
      const result: { version: number; entries: NewsItem[] } = await resp.json()
      if (result.version >= 1) {
        const entries = result.entries
        for (const e of entries) {
           try {
             e.newsPageImage.url = new URL(e.newsPageImage.url).toString()
             e.playPageImage.url = new URL(e.playPageImage.url).toString()
           } catch {
             // Fallback for relative URLs if any
           }
        }
        return entries
      }
      return []
    } catch (e) {
      console.error('Fail to fetch news', e)
      return []
    }
  }, {
    ...useSWRVConfig(),
    shouldRetryOnError: false,
    errorRetryCount: 1,
    revalidateOnFocus: true,
    dedupingInterval: 1000 * 60, // 1 minute deduping for news
  })
  const news = computed(() => {
    const list = data.value || [] as NewsItem[]
    if (list.length === 0) {
      // Fallback for debugging and premium feel if network is slow
      return [{
        id: 'fallback',
        title: 'Modula Launcher v1.4.0 is Live!',
        text: 'Welcome to the newest version of Modula. Check out our Discord for more info!',
        category: 'News',
        tag: 'Update',
        date: new Date().toISOString(),
        readMoreLink: 'https://discord.gg/gyjG6NjYcR',
        newsType: ['News'],
        cardBorder: true,
        playPageImage: { url: 'https://i.ibb.co/GQ831f59/modulanews2.png', title: 'Banner' },
        newsPageImage: { url: 'https://i.ibb.co/2YHJm6rT/modualanews.png', title: 'Banner', dimensions: { width: 1024, height: 512 } }
      }] as NewsItem[]
    }
    return list
  })
  return {
    news,
    isValidating,
    mutate,
    error,
  }
}
