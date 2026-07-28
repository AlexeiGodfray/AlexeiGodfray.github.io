import './index.css'
import { useEffect, useState } from 'react'
import meImage from './assets/Me.JPG'
import resumePDF from './assets/Resume.pdf'
import { MatterBall } from './components/MatterBall'
import { Blog } from './components/Blog'

function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash)

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const path = hash.replace(/^#\/?/, '')
  if (path.startsWith('blog/')) {
    return { view: 'post' as const, slug: path.slice('blog/'.length) }
  }
  if (path === 'blog') {
    return { view: 'blog' as const, slug: undefined }
  }
  return { view: 'home' as const, slug: undefined }
}

function Home() {
  const [isWorkOpen, setIsWorkOpen] = useState(false)

  return (
    <section className="min-h-screen flex flex-col items-center justify-center">
      <div>
        <div className="pb-8">
          <div className="relative inline-block group">
            <h1 className="text-3xl">Godfray</h1>
            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition duration-200 ease-out">
              <img
                src={meImage}
                alt="Hover preview"
                className="w-50 h-auto max-w-none rounded-lg shadow-lg border border-white/20 object-contain"
              />
            </div>
          </div>
          <p>Designer and Software Engineer based in San Francisco, California.</p>
        </div>

        <h2
          className="text-3xl cursor-pointer"
          style={{ cursor: 'pointer' }}
          onClick={() => setIsWorkOpen((prev) => !prev)}
          aria-expanded={isWorkOpen}
        >
          Work {isWorkOpen ? '-' : '+'}
        </h2>
        <div
          className={`transition-all duration-300 ease-out overflow-hidden ${
            isWorkOpen ? 'max-h-125 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'
          }`}
        >
          <div>
            <div className="pb-4">
              <h3>GoodLeap</h3>
              <p>Machine Learning Engineer</p>
              <p>Applied ML and agentic workflows.</p>
            </div>
            <div className="pb-4">
              <h3>Public Employment Relations Board</h3>
              <p>IT Developer</p>
              <p>Web applications and network projects for the State of California.</p>
            </div>
            <div>
              <h3>NASA L'Space Program</h3>
              <p>Computer Engineer</p>
              <p>Space exploration tooling and engineering projects.</p>
            </div>
          </div>
        </div>
        <div className="pt-8 w-full flex justify-between flex-wrap">
          <a className="cursor-pointer" href={resumePDF} target="_blank" rel="noreferrer">
            Resume
          </a>
          <a
            className="cursor-pointer"
            href="https://www.linkedin.com/in/alexei-godfray"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <a
            className="cursor-pointer"
            href="https://github.com/AlexeiGodfray"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a className="cursor-pointer" href="mailto:alexeigodfray@outlook.com">
            Email
          </a>
          <a
            className="cursor-pointer"
            href="https://www.instagram.com/alexeigodfray/"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
          <a
            className="cursor-pointer"
            href="https://www.pinterest.com/alexeigodfray/"
            target="_blank"
            rel="noreferrer"
          >
            Pinterest
          </a>
          <a className="cursor-pointer" href="#/blog">
            Blog
          </a>
        </div>
      </div>
      <MatterBall />
    </section>
  )
}

export default function App() {
  const route = useHashRoute()
  const onBlog = route.view === 'blog' || route.view === 'post'

  useEffect(() => {
    document.body.style.background = onBlog ? '#fff' : ''
    document.body.style.color = onBlog ? '#111' : ''
    return () => {
      document.body.style.background = ''
      document.body.style.color = ''
    }
  }, [onBlog])

  return (
    <>
      {route.view === 'home' && <Home />}
      {route.view === 'blog' && <Blog />}
      {route.view === 'post' && <Blog slug={route.slug} />}
    </>
  )
}
