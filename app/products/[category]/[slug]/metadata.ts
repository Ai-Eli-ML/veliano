import { Metadata } from "next"; export async function generateMetadata({ params }: { params: { category: string; slug: string } }): Promise<Metadata> { const productName = params.slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "); return { title: `${productName} | Veliano Luxury Jewelry`, description: `Discover our exquisite ${productName} from our ${params.category} collection.`, openGraph: { title: `${productName} | Veliano Luxury Jewelry`, description: `Discover our exquisite ${productName} from our ${params.category} collection.`, type: "website" } }; }
