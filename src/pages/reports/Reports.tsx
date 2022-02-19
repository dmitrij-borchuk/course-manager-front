import { PdfRenderer } from '../../components/pdf/PdfRenderer'
import './styles.css'

export const Reports = () => {
  return (
    <div className="report-page-wrapper flex flex-col">
      Reports
      <PdfRenderer />
    </div>
  )
}

export default Reports
