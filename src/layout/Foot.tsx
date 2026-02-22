import { useEffect, useRef, type ReactNode } from "react"
import style from "../assets/css/main.module.css"

const getRandomEmojis = (): string[] => {
  const emojis = ["♥️", "🖥️", "🧠", "🐳", "🐘", "🐍", "🐧", "🌽", "⚛️"]
      
  let count = 1
  while ((Math.random() > (19 / 20)) && count < emojis.length) count += 1

  const outEmojis: string[] = []
  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * emojis.length)
    outEmojis.push(emojis[index])
    emojis.splice(index, 1)
  }

  return outEmojis
}

const writeEmojis = (emojis: string[], node: HTMLElement) => {
  emojis.forEach((emoji, index) => {
    const delay = 500 + Math.random() * 500
    setTimeout(() => {
      node.appendChild(document.createTextNode(emoji))
    }, index * 500 + delay)
  })
}

const eraseEmojis = (node: HTMLElement) => {
  const delay = 100 + Math.random() * 150
  Array.from(node.childNodes).reverse().forEach((child, i) => {
    setTimeout(() => {
      child.remove()
    }, i * delay)
  })
}

const emojisInLoop = (emojiRef: React.RefObject<HTMLSpanElement | null>) => {
  if (!emojiRef.current) return
  
  const emojis = getRandomEmojis()
  writeEmojis(emojis, emojiRef.current)
  
  setTimeout(() => {
    if (!emojiRef.current) return
    eraseEmojis(emojiRef.current)
    
    setTimeout(() => {
      emojisInLoop(emojiRef)
    }, Math.random() * 500)
  }, (emojis.length * 500 + 1000) + 2000 / emojis.length)
}

type FooterProps = {
  children?: ReactNode,
}
export default function Foot({children}: FooterProps) {
  const emojiRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {emojisInLoop(emojiRef)}, [])

  const content = children && <>
    <hr className="my-4 border-secondary" />
      <div className="d-flex">
        <div className="m-auto d-flex gap-4">
          {children}
        </div>
      </div>
    <hr className="my-4 border-secondary" />
  </>

  return <footer className="bg-dark text-white py-4 border-top">
    <div className="container">
      {content}
      <div className="d-flex">
        <small className="text-light opacity-75 m-auto">
          Made with <span ref={emojiRef} /><span className={style["cursor-blink"]} /> by SynaCore
        </small>
      </div>
    </div>
  </footer>
}
