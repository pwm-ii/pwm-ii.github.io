import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"
import { version } from "../../package.json"
import { i18n } from "../i18n"

interface Options {
  links: Record<string, string>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const links = opts?.links ?? []
    return (
  <footer class={`${displayClass ?? ""}`}>
    <p>
    Last updated: April 30, 2026. © Paul Mola.
    </p>
  </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
