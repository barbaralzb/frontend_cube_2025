import StoreHeading from '@/components/StoreHeading'
import ProductListings from '@/components/ProductListings'
import { getProductSlugs } from '@/lib/api'

function IndexPage({ products }) {

  return (
    <div className="mx-auto max-w-6xl">
      <StoreHeading />
      <ProductListings products={products} />      
    </div>
  )
}

export async function getStaticProps() {
  const products = await getProductSlugs()

  return {
    props: {
      products
    },
  }
}

export default IndexPage
