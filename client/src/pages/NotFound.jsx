import { Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <PageContainer>
      <section className="scanner-card not-found">
        <h1>404</h1>
        <p>The page you are looking for does not exist.</p>
        <Button as={Link} to="/" variant="primary">
          Return home
        </Button>
      </section>
    </PageContainer>
  )
}
