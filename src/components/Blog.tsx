import ReactMarkdown from 'react-markdown'
import { getPost, posts } from '../posts'

type BlogProps = {
  slug?: string
}

export function Blog({ slug }: BlogProps) {
  const post = slug ? getPost(slug) : undefined

  if (slug && !post) {
    return (
      <article className="blog">
        <p>
          <a href="#/">←</a>
        </p>
        <p>Post not found.</p>
      </article>
    )
  }

  if (post) {
    return (
      <article className="blog">
        <p className="blog-nav">
          <a href="#/blog">←</a>
        </p>
        <ReactMarkdown
          components={{
            a: ({ href, children }) => (
              <a href={href} target="_blank" rel="noreferrer">
                {children}
              </a>
            ),
          }}
        >
          {post.content}
        </ReactMarkdown>
      </article>
    )
  }

  return (
    <article className="blog">
      <p className="blog-nav">
        <a href="#/">←</a>
      </p>
      <ul className="blog-list">
        {posts.map((p) => (
          <li key={p.slug}>
            <a href={`#/blog/${p.slug}`}>{p.title}</a>
          </li>
        ))}
      </ul>
    </article>
  )
}
