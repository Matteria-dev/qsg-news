import type { CollectionConfig } from 'payload'

import
  {
    FixedToolbarFeature,
    InlineToolbarFeature,
    lexicalEditor,
  } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  hooks: {
    afterRead: [
      (doc) =>
      {
        // Properly type check if doc has a file field with URL
        if (doc &&
          typeof doc === 'object' &&
          doc.filename &&
          doc.mimeType &&
          typeof doc.mimeType === 'string' &&
          doc.mimeType.includes('video/')) {

          // For Vercel Blob Storage, we need to correctly construct the URL
          // that Next.js expects for video files
          if (doc.url) {
            const filename = doc.filename

            // Check if the URL needs transformation
            // Only transform URLs that don't already use the API pattern
            if (!doc.url.includes('/api/media/file/')) {
              // Store the original URL (if needed for debugging)
              doc.originalUrl = doc.url

              // Transform to use the consistent API pattern
              doc.url = `/api/media/file/${filename}`
            }
          }
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      //required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) =>
        {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    // Store media files in Payload's default location
    // Remove the staticDir to use Payload's internal storage
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
    // Add mimeTypes configuration for videos
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'video/mp4',
      'video/webm'
    ],
  },
}
