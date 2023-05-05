import '@/styles/globals.css'
import "bootstrap/dist/css/bootstrap.min.css"
import { AuthProvider } from './contexts/AuthContext'

export default function App({ Component, pageProps }) {

    return <AuthProvider> <Component {...pageProps} /> </AuthProvider>
}
