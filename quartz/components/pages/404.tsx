import { i18n } from "../../i18n"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const NotFound: QuartzComponent = ({ cfg }: QuartzComponentProps) => {
  return (
    <article class="popover-hint">
      <h1>404</h1>
      <p>{i18n(cfg.locale).pages.error.notFound}</p>
      
      {/* UPDATED: Custom 404 Image */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
        <img 
          src="/static/teafrog.png" 
          alt="404 Tea Frog" 
          style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }} 
        />
      </div>
    </article>
  )
}

export default (() => NotFound) satisfies QuartzComponentConstructor