import { draftMode } from 'next/headers'
import { createClient, generateSeo } from '@/lib/contento'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import CategoryPage from '@/components/pages/CategoryPage'
import { ContentAPIResponse, ContentData } from '@gocontento/client'

const client = createClient()

type Props = {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return await client
    .getContentByType({
      contentType: 'article_category',
      limit: 100,
    })
    .then((response: ContentAPIResponse) => {
      return response.content.map((content) => ({
        slug: content.slug,
      }))
    })
    .catch(() => {
      return []
    })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return await client
    .getContentBySlug(params.slug, 'article_category')
    .then((content: ContentData) => {
      return generateSeo(content)
    })
    .catch(() => {
      return {}
    })
}

export default async function page({ params }: Props) {
  const content = await createClient(draftMode().isEnabled)
    .getContentBySlug(params.slug, 'article_category')
    .catch(() => {
      notFound()
    })

  const postsResponse = await client.getContent({
    params: {
      content_type: 'article',
      limit: '100',
      'fields[content_links][category][slug]': params.slug,
    },
  })

  const posts = postsResponse.content

  return <CategoryPage initialContent={content} posts={posts} />
}
