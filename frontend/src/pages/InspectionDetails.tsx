import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Download,
  FileText,
  Zap,
  ChevronLeft,
  Brain,
  Shield,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { format } from 'date-fns'
import {
  useInspectionSummary,
  useInspectionDefects,
  useGenerateReport,
  useDownloadReport,
  useCheckReport,
  useGenerateTickets,
} from '@/hooks/useInspection'
import { useInspectionTickets } from '@/hooks/useTickets'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  HealthScoreRing,
} from '@/components'
import { LoadingSpinner, Error, Alert } from '@/components/Loading'
import { Severity } from '@/types/enums'
import { priorityStyles, ticketStatusStyles, formatLabel } from '@/lib/badges'

const InspectionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  const navigate = useNavigate()
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [openDefectIndex, setOpenDefectIndex] = useState<number | null>(null)
  // const [isReportDownloaded, setIsReportDownloaded] = useState(false)

  const {
    data: inspection,
    isLoading: inspectionLoading,
    error: inspectionError,
  } = useInspectionSummary(id)
  const { data: defectData } = useInspectionDefects(id)
  const { data: ticketData } = useInspectionTickets(id)
  const { mutate: generateReport, isPending: reportPending } = useGenerateReport()
  const { mutate: downloadReport, isPending: downloadPending } = useDownloadReport()
  const { data: report } = useCheckReport(id)
  const isReportDownloaded = Boolean(id && report?.report_status)
  const [isReport, setIsReport] = useState(isReportDownloaded)

  const { mutate: generateTickets, isPending: ticketsPending } = useGenerateTickets()

  useEffect(() => {
    if (!id) return
    if (report && report?.report_status) {
      setIsReport(true)
    }
  }, [setShowSuccess, setSuccessMessage, report, id])

  const handleGenerateReport = () => {
    if (!id) return
    generateReport(id, {
      onSuccess: () => {
        setIsReport(true)
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

  const severityVariant = (severity: Severity) => {
    const map: Record<Severity, 'critical' | 'warning' | 'success'> = {
      [Severity.CRITICAL]: 'critical',
      [Severity.MAJOR]: 'warning',
      [Severity.MINOR]: 'success',
    }
    return map[severity]
  }

  const detailValue = (value: string | null | undefined) => value || 'Not provided'

  if (inspectionLoading) return <LoadingSpinner />
  if (inspectionError) return <Error message="Failed to load inspection details" />

  return (
    <div className="space-y-8">
      {showSuccess && (
        <Alert type="success" message={successMessage} onClose={() => setShowSuccess(false)} />
      )}

      <div>
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-primary"
        >
          <ChevronLeft size={16} />
          Back
        </button>
        <h1 className="text-page-title text-primary">Inspection Details</h1>
        <p className="mt-2 font-mono text-sm text-text-secondary">{id}</p>
      </div>

      {inspection && (
        <>
          {/* Summary + Health + AI Status */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Inspection Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
                      Pilot ID
                    </p>
                    <p className="mt-2 text-base font-medium text-text-primary">
                      {inspection.pilot_id}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
                      Capture Date
                    </p>
                    <p className="mt-2 text-base font-medium text-text-primary">
                      {format(new Date(inspection.capture_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
                      Validation
                    </p>
                    <div className="mt-2">
                      <Badge
                        variant={
                          inspection.validation_status === 'passed'
                            ? 'success'
                            : inspection.validation_status === 'failed'
                              ? 'critical'
                              : 'warning'
                        }
                      >
                        {formatLabel(inspection.validation_status)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
                      Analysis
                    </p>
                    <div className="mt-2">
                      <Badge
                        variant={
                          inspection.analysis_status === 'completed'
                            ? 'success'
                            : inspection.analysis_status === 'processing'
                              ? 'neutral'
                              : 'warning'
                        }
                      >
                        {formatLabel(inspection.analysis_status)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {inspection.health_score !== null && (
              <Card>
                <CardHeader>
                  <CardTitle>Health Score</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center py-2">
                  <HealthScoreRing score={inspection.health_score} />
                </CardContent>
              </Card>
            )}
          </div>

          {/* AI Analysis Status */}
          <Card>
            <CardContent className="flex flex-wrap items-center gap-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light">
                  <Brain size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">AI Analysis</p>
                  <p className="text-xs text-text-secondary">
                    {inspection.analysis_status === 'completed'
                      ? `${defectData?.defects.length ?? 0} defects detected`
                      : 'Processing inspection imagery...'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light">
                  <Shield size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">Validation</p>
                  <p className="text-xs text-text-secondary">
                    {formatLabel(inspection.validation_status)}
                  </p>
                </div>
              </div>
              <div className="ml-auto flex flex-wrap gap-2">
                {isReport ? (
                  <Button
                    onClick={handleDownloadReport}
                    isLoading={downloadPending}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                  </Button>
                ) : (
                  <Button onClick={handleGenerateReport} isLoading={reportPending} size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                )}

                <Button onClick={handleGenerateTickets} isLoading={ticketsPending} size="sm">
                  <Zap className="mr-2 h-4 w-4" />
                  Generate Tickets
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Defect Cards */}
          {defectData && defectData.defects.length > 0 && (
            <section>
              <h2 className="mb-5 text-section-title text-primary">
                Detected Defects ({defectData.defects.length})
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {defectData.defects.map((defect, idx) => {
                  const isOpen = openDefectIndex === idx

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06, duration: 0.35 }}
                    >
                      <Card
                        hover
                        role="button"
                        tabIndex={0}
                        aria-expanded={isOpen}
                        className="cursor-pointer"
                        onClick={() => setOpenDefectIndex(isOpen ? null : idx)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault()
                            setOpenDefectIndex(isOpen ? null : idx)
                          }
                        }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-base font-medium text-primary">
                              {formatLabel(defect.defect_type)}
                            </p>
                            <p className="mt-1 text-sm text-text-secondary">
                              {defect.location_description}
                            </p>
                          </div>
                          <Badge variant={severityVariant(defect.severity)}>
                            {formatLabel(defect.severity)}
                          </Badge>
                        </div>
                        <div className="mt-4 flex items-center gap-4 border-t border-border pt-4">
                          <div>
                            <p className="text-xs text-text-secondary">Confidence</p>
                            <p className="text-sm font-medium text-text-primary">
                              {(defect.confidence_score * 100).toFixed(0)}%
                            </p>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-text-secondary">AI Reasoning</p>
                            <p className="line-clamp-2 text-sm text-text-primary">
                              {defect.ai_reasoning}
                            </p>
                          </div>
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-text-secondary">
                            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </div>
                        {isOpen && (
                          <div className="mt-5 space-y-5 border-t border-border pt-5">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
                                  Defect Type
                                </p>
                                <p className="mt-2 text-sm font-medium text-text-primary">
                                  {formatLabel(defect.defect_type)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
                                  Severity
                                </p>
                                <div className="mt-2">
                                  <Badge variant={severityVariant(defect.severity)}>
                                    {formatLabel(defect.severity)}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
                                  Confidence Score
                                </p>
                                <p className="mt-2 text-sm font-medium text-text-primary">
                                  {(defect.confidence_score * 100).toFixed(0)}%
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
                                  Location
                                </p>
                                <p className="mt-2 text-sm font-medium text-text-primary">
                                  {detailValue(defect.location_description)}
                                </p>
                              </div>
                            </div>

                            <div>
                              <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
                                AI Reasoning
                              </p>
                              <div className="mt-3 rounded-lg border border-border bg-surface p-4">
                                <p className="whitespace-pre-wrap text-sm text-text-primary">
                                  {detailValue(defect.ai_reasoning)}
                                </p>
                              </div>
                            </div>

                            <div>
                              <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
                                AI Recommendation
                              </p>
                              <div className="mt-3 rounded-lg border border-border bg-surface p-4">
                                <p className="whitespace-pre-wrap text-sm text-text-primary">
                                  {detailValue(defect.ai_recommendation)}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Generated Tickets */}
          {ticketData && ticketData.tickets.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Tickets ({ticketData.tickets.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHead>
                    <TableRow index={0}>
                      <TableHeader>Priority</TableHeader>
                      <TableHeader>Status</TableHeader>
                      <TableHeader>Title</TableHeader>
                      <TableHeader>Team</TableHeader>
                      <TableHeader>Due Date</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ticketData.tickets.map((ticket, idx) => (
                      <TableRow key={ticket.id} index={idx + 1}>
                        <TableCell>
                          <span
                            className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${priorityStyles[ticket.priority]}`}
                          >
                            {ticket.priority}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${ticketStatusStyles[ticket.status]}`}
                          >
                            {formatLabel(ticket.status)}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">{ticket.title}</TableCell>
                        <TableCell className="text-text-secondary">
                          {ticket.assigned_team || '—'}
                        </TableCell>
                        <TableCell className="text-text-secondary">
                          {format(new Date(ticket.due_date), 'MMM d, yyyy')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

export default InspectionDetails
