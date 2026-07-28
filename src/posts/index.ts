const modules = import.meta.glob('./*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export type Post = {
  slug: string
  title: string
  content: string
}

function titleFromMarkdown(content: string, fallback: string) {
  const match = content.match(/^#\s+(.+)$/m)
  return match?.[1]?.trim() ?? fallback
}

export const posts: Post[] = Object.entries(modules)
  .map(([path, content]) => {
    const slug = path.replace(/^\.\//, '').replace(/\.md$/, '')
    return {
      slug,
      title: titleFromMarkdown(content, slug),
      content,
    }
  })
  .sort((a, b) => a.title.localeCompare(b.title))

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug)
}
