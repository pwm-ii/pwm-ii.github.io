// quartz/components/Cusdis.tsx
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

export default (() => {
  function Cusdis(props: QuartzComponentProps) {
    // Check if comments are disabled in frontmatter
    const commentsEnabled = props.fileData.frontmatter?.comments !== false
    if (!commentsEnabled) return null

    const slug = props.fileData.slug
    return (
      <div class="cusdis-container">
        <h3>Comments</h3>
        <div id="cusdis_thread"
          data-host="https://cusdis.com"
          data-app-id="ef2b06bc-a85c-440f-bb7d-3c8ccda5f722"
          data-page-id={slug}
          data-page-url={`https://pwm-ii.github.io/${slug}`}
          data-page-title={props.fileData.title}
          data-theme="auto"
        ></div>
        <script async defer src="https://cusdis.com/js/cusdis.es.js"></script>
      </div>
    )
  }

  Cusdis.afterDOMLoaded = `
    const script = document.createElement('script')
    script.src = "https://cusdis.com/js/cusdis.es.js"
    script.async = true
    script.defer = true
    document.body.appendChild(script)
  `

  return Cusdis
}) satisfies QuartzComponentConstructor