import { draftMode } from 'next/headers'
import {
  createClient,
  generateSeo,
  getArticleCategoryLinks,
} from '@/lib/contento'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { ContentAPIResponse, ContentData } from '@gocontento/client'
import AuthorPage from '@/components/pages/AuthorPage'

const client = createClient()

type Props = {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return await client
    .getContentByType({
      contentType: 'authors',
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
    .getContentBySlug(params.slug, 'authors')
    .then((content: ContentData) => {
      const nameParts = content.fields.name.text.split(' ')

      return generateSeo(content, {
        type: 'profile',
        firstName: nameParts.length ? nameParts[0] : content.fields.name.text,
        lastName: nameParts.length >= 2 ? nameParts[1] : null,
      })
    })
    .catch(() => {
      return {}
    })
}

export default async function page({ params }: Props) {
  const content = await createClient(draftMode().isEnabled)
    .getContentBySlug(params.slug, 'authors')
    .catch(() => {
      notFound()
    })

  const postsResponse = await client.getContent({
    params: {
      content_type: 'article',
      limit: '100',
      'fields[content_links][author][slug]': params.slug,
    },
  })

  const posts = postsResponse.content
  const categoryLinks = await getArticleCategoryLinks()

  return (
    <AuthorPage
      initialContent={content}
      posts={posts}
      categoryLinks={categoryLinks}
    />
  )
}
