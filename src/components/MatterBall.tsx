import { useEffect, useRef } from 'react'
import Matter from 'matter-js'

export function MatterBall() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const extraBallsRef = useRef<Matter.Body[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    const { Engine, Render, Runner, Bodies, Composite, Body, Events } = Matter
    const engine = Engine.create()
    const world = engine.world
    engine.gravity.y = 1

    const render = Render.create({
      element: containerRef.current,
      engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: 'transparent',
        pixelRatio: window.devicePixelRatio || 1,
      },
    })

    const runner = Runner.create()
    Render.run(render)
    Runner.run(runner, engine)

    const renderWidth = render.options.width ?? window.innerWidth
    const renderHeight = render.options.height ?? window.innerHeight
    const radius = 56
    const ball = Bodies.circle(renderWidth / 2, renderHeight / 2, radius, {
      restitution: 0.85,
      friction: 0.02,
      render: { fillStyle: 'red' },
    })
    Composite.add(world, ball)
    const addBall = (x: number, y: number) => {
      if (extraBallsRef.current.length >= 29) return
      const newBall = Bodies.circle(x, y, radius, {
        restitution: 0.85,
        friction: 0.02,
        render: { fillStyle: 'red' },
      })
      extraBallsRef.current.push(newBall)
      Composite.add(world, newBall)
    }

    // ===================
    // TUNABLE PARAMETERS
    // ===================
    const SPRING_STIFFNESS = 0.001  // How hard the ball pulls toward cursor (lower = more lag)
    const SPRING_DAMPING = 0.01      // Resistance to motion while following (higher = less oscillation)
    const IDLE_DELAY_MS = 1500       // How long after mouse stops before releasing the ball
    const WALL_THICKNESS = 80

    // ===================
    // WALL SETUP
    // ===================
    let walls: Matter.Body[] = []

    const buildWalls = () => {
      walls.forEach((w) => Composite.remove(world, w))
      const w = window.innerWidth
      const h = window.innerHeight
      walls = [
        Bodies.rectangle(w / 2, -WALL_THICKNESS / 2, w, WALL_THICKNESS, { isStatic: true }),
        Bodies.rectangle(w / 2, h + WALL_THICKNESS / 2, w, WALL_THICKNESS, { isStatic: true }),
        Bodies.rectangle(-WALL_THICKNESS / 2, h / 2, WALL_THICKNESS, h, { isStatic: true }),
        Bodies.rectangle(w + WALL_THICKNESS / 2, h / 2, WALL_THICKNESS, h, { isStatic: true }),
      ]
      Composite.add(world, walls)

      const scale = window.devicePixelRatio || 1
      render.canvas.width = w * scale
      render.canvas.height = h * scale
      render.options.width = w
      render.options.height = h
      render.canvas.style.width = `${w}px`
      render.canvas.style.height = `${h}px`
    }

    buildWalls()
    window.addEventListener('resize', buildWalls)

    // ===================
    // MOUSE FOLLOW LOGIC
    // ===================
    let isFollowing = false
    let mousePos = { x: renderWidth / 2, y: renderHeight / 2 }
    let followTimeout: number | null = null

    const startFollowing = () => {
      if (!isFollowing) {
        isFollowing = true
        engine.gravity.y = 0
      }
    }

    const stopFollowing = () => {
      isFollowing = false
      engine.gravity.y = 1
      // Ball keeps its current velocity naturally - no need to set it
    }

    const onMouseMove = (e: MouseEvent) => {
      mousePos = { x: e.clientX, y: e.clientY }
      startFollowing()

      // Reset the idle timer
      if (followTimeout) window.clearTimeout(followTimeout)
      followTimeout = window.setTimeout(stopFollowing, IDLE_DELAY_MS)
    }

    window.addEventListener('mousemove', onMouseMove)
    const onClick = (e: MouseEvent) => addBall(e.clientX, e.clientY)
    window.addEventListener('click', onClick)

    // ===================
    // PHYSICS UPDATE LOOP
    // ===================
    const applySpringForce = () => {
      if (!isFollowing) return

      const ballPos = ball.position
      const ballVel = ball.velocity

      // Spring force: pulls toward cursor
      const dx = mousePos.x - ballPos.x
      const dy = mousePos.y - ballPos.y
      const springForceX = dx * SPRING_STIFFNESS
      const springForceY = dy * SPRING_STIFFNESS

      // Damping force: resists current velocity
      const dampingForceX = -ballVel.x * SPRING_DAMPING
      const dampingForceY = -ballVel.y * SPRING_DAMPING

      // Apply combined force
      Body.applyForce(ball, ballPos, {
        x: springForceX + dampingForceX,
        y: springForceY + dampingForceY,
      })
    }

    // Hook into Matter's update cycle
    Events.on(engine, 'beforeUpdate', applySpringForce)

    return () => {
      window.removeEventListener('resize', buildWalls)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('click', onClick)
      extraBallsRef.current.forEach((b) => Composite.remove(world, b))
      extraBallsRef.current = []
      if (followTimeout) window.clearTimeout(followTimeout)
      Events.off(engine, 'beforeUpdate', applySpringForce)
      Render.stop(render)
      Runner.stop(runner)
      render.canvas.remove()
      Composite.clear(world, false)
      Engine.clear(engine)
    }
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none -z-10" />
  )
}