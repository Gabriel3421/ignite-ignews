import { render, screen } from "@testing-library/react"
import Posts, { getStaticProps } from "../../pages/posts"
import { mocked } from "ts-jest/utils"
import { getPrismicClient } from "../../services/prismic"

const posts = [
  { slug: "my-new-post", title: "My new post", excerpt: "Post excerpt", updatedAt: "march 23" },
]

jest.mock("../../services/prismic")

describe("Home page", () => {
  it("should render correctly", () => {
    render(<Posts posts={posts} />)

    expect(screen.getByText("My new post")).toBeInTheDocument()
  })

  it("loads initial data", async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: "my-new-post",
            data: {
              title: [
                { type: "heading", text: "My new post" }
              ],
              content: [
                { type: "paragraph", text: "Post excerpt" }
              ],
            },
            last_publication_date: new Date(2021, 6, 13)
          }
        ]
      })
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            { slug: "my-new-post", title: "My new post", excerpt: "Post excerpt", updatedAt: "13 de julho de 2021" }
          ]
        }
      })
    )
  })
})
