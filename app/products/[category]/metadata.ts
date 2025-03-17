import type { Metadata } from "next"

interface CategoryPageProps {
  params: {
    category: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.category)

  if (!category) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found",
    }
  }

  return {
    title: category.name,
    description: category.description || `Browse our collection of ${category.name}`,
  }
}
