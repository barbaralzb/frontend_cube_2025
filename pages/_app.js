import Layout from '@/components/Layout'
import SEO from '@/components/SEO'
import '@/styles/globals.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }) {

  return (
    <Layout>
      <SEO 
        title={process.env.siteTitle}
      />
      <Component {...pageProps} />
      <ToastContainer />
    </Layout>
  )
}

export default MyApp
