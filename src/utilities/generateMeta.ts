import type { Metadata } from 'next'
import type { Media, Page, Post, Config } from '../payload-types'
import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getMediaURL = (media?: Media | Config['db']['defaultIDType'] | null) =>
{
  const serverUrl = getServerSideURL()

  if (!media) return serverUrl + '/website-template-OG.webp'

  if (typeof media === 'object' && media && 'mimeType' in media && media.mimeType) {
    const { mimeType, sizes } = media // Use const for mimeType
    let { url } = media

    if (url && !url.includes('/api')) { // Check if url is not null/undefined
      url = url.replace('/media', '/api/media')
    }

    if (mimeType.startsWith('image/')) {
      const ogUrl = sizes?.og?.url
      return ogUrl ? serverUrl + ogUrl : serverUrl + (url || '') // Handle url potentially being null
    } else if (mimeType.startsWith('video/')) {
      return serverUrl + '/website-template-OG.webp'
    }
  }

  return serverUrl + '/website-template-OG.webp'
};

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post>
}): Promise<Metadata> =>
{
  const { doc } = args || {}

  const ogMedia = getMediaURL(doc?.meta?.image) 

  const title = doc?.meta?.title
    ? doc?.meta?.title + ' | Quicksilver Group News'
    : 'Quicksilver Group News'

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogMedia 
        ? [
          {
            url: ogMedia, 
          },
        ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  }
}
