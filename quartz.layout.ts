import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        //{ Component: Component.Darkmode() },
        //{ Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      folderDefaultState: "collapsed",
      sortFn: (a, b) => {
        // Define the specific order you want (MUST match the visible title exactly)
        const order = ["Technical Projects", "Notes", "Writing"]

        // Get the index using displayName
        let idxA = order.indexOf(a.displayName)
        let idxB = order.indexOf(b.displayName)

        // If the item isn't in your list, assign it a high number (push to bottom)
        if (idxA === -1) idxA = 999
        if (idxB === -1) idxB = 999

        // Sort by the custom index first
        if (idxA !== idxB) return idxA - idxB

        // Default to alphabetical sort for everything else
        return a.displayName.localeCompare(b.displayName, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      },
    }),
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Graph(),
    //Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        //{ Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      sortFn: (a, b) => {
        // Define the specific order you want (MUST match the visible title exactly)
        const order = ["Technical Projects", "Notes", "Writing"]

        // Get the index using displayName
        let idxA = order.indexOf(a.displayName)
        let idxB = order.indexOf(b.displayName)

        // If the item isn't in your list, assign it a high number (push to bottom)
        if (idxA === -1) idxA = 999
        if (idxB === -1) idxB = 999

        // Sort by the custom index first
        if (idxA !== idxB) return idxA - idxB

        // Default to alphabetical sort for everything else
        return a.displayName.localeCompare(b.displayName, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      },
    }),
  ],
  right: [],
}