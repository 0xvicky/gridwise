import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Download, FileText, Zap } from 'lucide-react'
import { format } from 'date-fns'
import { useInspectionSummary, useInspectionDefects, useGenerateReport, useDownloadReport, useGenerateTickets } from '@/hooks/useInspection'
import { useInspectionTickets } from '@/hooks/useTickets'
import { Button, Card, CardHeader, CardTitle, CardContent, Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '@/components'
import { LoadingSpinner, Error, Alert } from '@/components/Loading'
import { Severity } from '@/types/enums'

const InspectionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const { data: inspection, isLoading: inspectionLoading, error: inspectionError } = useInspectionSummary(id)
  const { data: defectData, isLoading: defectLoading } = useInspectionDefects(id)
  const { data: ticketData } = useInspectionTickets(id)
  const { mutate: generateReport, isPending: reportPending } = useGenerateReport()
  const { mutate: downloadReport, isPending: downloadPending } = useDownloadReport()
  const { mutate: generateTickets, isPending: ticketsPending } = useGenerateTickets()

  const handleGenerateReport = () => {
    if (!id) return
    generateReport(id, {
      onSuccess: () => {
        setSuccessMessage('Report generated successfully!')
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      },
    })
  }

  const handleDownloadReport = () => {
    if (!id) return
    downloadReport(id, {
      onSuccess: (blob) => {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `inspection_report_${id}.pdf`
        link.click()
        window.URL.revokeObjectURL(url)
      },
    })
  }

  const handleGenerateTickets = () => {
    if (!id) return
    generateTickets(id, {
      onSuccess: () => {
        setSuccessMessage('Tickets generated successfully!')
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      },
    })
  }

  const getSeverityColor = (severity: Severity) => {
    const colors: Record<Severity, string> = {
      [Severity.CRITICAL]: 'text-red-600 bg-red-50',
      [Severity.MAJOR]: 'text-orange-600 bg-orange-50',
      [Severity.MINOR]: 'text-yellow-600 bg-yellow-50',
    }
    return colors[severity]
  }

  if (inspectionLoading) return <LoadingSpinner />
  if (inspectionError) return <Error message="Failed to load inspection details" />

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {showSuccess && (
        <Alert
          type="success"
          message={successMessage}
          onClose={() => setShowSuccess(false)}
        />
      )}

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-primary-600 hover:text-primary-700 mb-2"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-100 to-accent-cyan bg-clip-text text-transparent">Inspection Details</h1>
          <p className="mt-2 text-white">ID: {id}</p>
        </div>
      </div>

      {inspection && (
        <>
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-sm text-white">Pilot ID</p>
                  <p className="mt-2 text-lg font-medium text-white">{inspection.pilot_id}</p>
                </div>
                <div>
                  <p className="text-sm text-white">Capture Date</p>
                  <p className="mt-2 text-lg font-medium text-white">
                    {format(new Date(inspection.capture_date), 'MMM d, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-white">Validation Status</p>
                  <p className={`mt-2 inline-block rounded px-3 py-1 text-sm font-medium ${
                    inspection.validation_status === 'passed' ? 'bg-green-100 text-green-700' :
                    inspection.validation_status === 'failed' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {inspection.validation_status.charAt(0).toUpperCase() + inspection.validation_status.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-white">Analysis Status</p>
                  <p className={`mt-2 inline-block rounded px-3 py-1 text-sm font-medium ${
                    inspection.analysis_status === 'completed' ? 'bg-green-100 text-green-700' :
                    inspection.analysis_status === 'processing' ? 'bg-blue-100 text-blue-700' :
                    'bg-dark-700 text-white'
                  }`}>
                    {inspection.analysis_status.charAt(0).toUpperCase() + inspection.analysis_status.slice(1)}
                  </p>
                </div>
                {inspection.health_score !== null && (
                  <div>
                    <p className="text-sm text-white">Health Score</p>
                    <p className="mt-2 text-lg font-medium text-white">{inspection.health_score}%</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleGenerateReport}
                  isLoading={reportPending}
                  variant="secondary"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
                <Button
                  onClick={handleDownloadReport}
                  isLoading={downloadPending}
                  variant="secondary"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
                <Button
                  onClick={handleGenerateTickets}
                  isLoading={ticketsPending}
                  variant="secondary"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Generate Tickets
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Defects */}
          {defectData && defectData.defects.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Detected Defects ({defectData.defects.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader>Type</TableHeader>
                      <TableHeader>Severity</TableHeader>
                      <TableHeader>Location</TableHeader>
                      <TableHeader>Confidence</TableHeader>
                      <TableHeader>Reasoning</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {defectData.defects.map((defect, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">
                          {defect.defect_type.replace(/_/g, ' ').charAt(0).toUpperCase() + defect.defect_type.slice(1)}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-block rounded px-2 py-1 text-xs font-medium ${getSeverityColor(defect.severity)}`}>
                            {defect.severity.charAt(0).toUpperCase() + defect.severity.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">{defect.location_description}</TableCell>
                        <TableCell className="text-sm">{(defect.confidence_score * 100).toFixed(0)}%</TableCell>
                        <TableCell className="max-w-xs truncate text-sm text-white">{defect.ai_reasoning}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Tickets */}
          {ticketData && ticketData.tickets.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Tickets ({ticketData.tickets.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader>Priority</TableHeader>
                      <TableHeader>Status</TableHeader>
                      <TableHeader>Title</TableHeader>
                      <TableHeader>Team</TableHeader>
                      <TableHeader>Due Date</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ticketData.tickets.map((ticket) => (
                      <TableRow key={ticket.ticket_id || ticket.id}>
                        <TableCell>
                          <span className="inline-block rounded bg-dark-700 px-2 py-1 text-xs font-medium text-white">
                            {ticket.priority}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-block rounded px-2 py-1 text-xs font-medium ${
                            ticket.status === 'open' ? 'bg-red-100 text-red-700' :
                            ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {ticket.status.replace(/_/g, ' ').charAt(0).toUpperCase() + ticket.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">{ticket.title}</TableCell>
                        <TableCell>{ticket.assigned_team || '-'}</TableCell>
                        <TableCell>{format(new Date(ticket.due_date), 'MMM d, yyyy')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </motion.div>
  )
}

export default InspectionDetails
