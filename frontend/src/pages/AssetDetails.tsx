import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { ChevronLeft } from 'lucide-react'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Pagination,
} from '@/components'
import { EmptyState, Error, LoadingSpinner } from '@/components/Loading'
import { useAsset, useAssetInspections } from '@/hooks/useAssets'
import { useAssetForecasts } from '@/hooks/useForecast'
import { AnalysisStatus, AssetType, ValidationStatus } from '@/types/enums'
import { formatLabel } from '@/lib/badges'

const getAssetTypeLabel = (type: AssetType): string => {
  const labels: Record<AssetType, string> = {
    [AssetType.TRANSMISSION_TOWER]: 'Transmission Tower',
    [AssetType.OHE_RAIL]: 'OHE Rail',
    [AssetType.DISTRIBUTION_POLE]: 'Distribution Pole',
  }
  return labels[type]
}

const validationVariant = (status: ValidationStatus) => {
  const map: Record<ValidationStatus, 'success' | 'critical' | 'warning'> = {
    [ValidationStatus.PENDING]: 'warning',
    [ValidationStatus.PASSED]: 'success',
    [ValidationStatus.FAILED]: 'critical',
  }
  return map[status]
}

const analysisVariant = (status: AnalysisStatus) => {
  const map: Record<AnalysisStatus, 'success' | 'critical' | 'warning' | 'neutral'> = {
    [AnalysisStatus.PENDING]: 'warning',
    [AnalysisStatus.PROCESSING]: 'neutral',
    [AnalysisStatus.COMPLETED]: 'success',
    [AnalysisStatus.FAILED]: 'critical',
  }
  return map[status]
}

const AssetDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [forecastPage, setForecastPage] = useState(1)
  const [inspectionPage, setInspectionPage] = useState(1)
  const pageSize = 5
  const {
    data: asset,
    isLoading: assetLoading,
    error: assetError,
    refetch: refetchAsset,
  } = useAsset(id)
  const {
    data: inspections,
    isLoading: inspectionsLoading,
    error: inspectionsError,
    refetch: refetchInspections,
  } = useAssetInspections(id, inspectionPage, pageSize)
  const {
    data: forecasts,
    isLoading: forecastsLoading,
    error: forecastsError,
    refetch: refetchForecasts,
  } = useAssetForecasts(id, forecastPage, pageSize)

  if (assetLoading) return <LoadingSpinner />

  if (assetError) {
    return <Error message="Failed to load asset" onRetry={() => refetchAsset()} />
  }

  if (!asset) return <Error message="Asset not found" />

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            to="/assets"
            className="mb-4 flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-primary"
          >
            <ChevronLeft size={16} />
            Back to assets
          </Link>
          <h1 className="text-page-title text-primary">{asset.name}</h1>
          <p className="mt-2 text-base text-text-secondary">
            {getAssetTypeLabel(asset.asset_type)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={`/assets/${asset.id}/forecast`}>
            <Button>Generate Forecast</Button>
          </Link>
          <Link to={`/inspection/upload?asset=${asset.id}`}>
            <Button>Upload Inspection</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Asset Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { label: 'Zone', value: asset.zone },
              { label: 'Installed Year', value: asset.installed_year },
              { label: 'Latitude', value: asset.latitude.toFixed(4) },
              { label: 'Longitude', value: asset.longitude.toFixed(4) },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
                  {item.label}
                </p>
                <p className="mt-2 text-base font-medium text-text-primary">{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Forecasts</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {forecastsLoading ? (
            <div className="p-6">
              <LoadingSpinner />
            </div>
          ) : forecastsError ? (
            <div className="p-6">
              <Error message="Failed to load forecasts" onRetry={() => refetchForecasts()} />
            </div>
          ) : !forecasts || forecasts.items.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No forecasts found"
                description="Generate an AI forecast for this asset to see it here"
                action={
                  <Link to={`/assets/${asset.id}/forecast`}>
                    <Button>Generate Forecast</Button>
                  </Link>
                }
              />
            </div>
          ) : (
            <>
              <Table>
                <TableHead>
                <TableRow index={0}>
                  <TableHeader>ID</TableHeader>
                  <TableHeader>30 Day Risk</TableHeader>
                  <TableHeader>60 Day Risk</TableHeader>
                  <TableHeader>90 Day Risk</TableHeader>
                  <TableHeader>At Risk Component</TableHeader>
                  <TableHeader className="text-right">Action</TableHeader>
                </TableRow>
                </TableHead>
                <TableBody>
                {forecasts.items.map((forecast, idx) => (
                  <TableRow key={forecast.id} index={idx + 1}>
                    <TableCell className="font-mono text-xs">
                      <Link
                        to={`/assets/${asset.id}/forecast/${forecast.id}`}
                        className="text-text-primary transition-colors hover:text-primary"
                      >
                        {forecast.id.slice(0, 8)}
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium">{Math.round(forecast.risk_30_days)}%</TableCell>
                    <TableCell className="font-medium">{Math.round(forecast.risk_60_days)}%</TableCell>
                    <TableCell className="font-medium text-critical">
                      {Math.round(forecast.risk_90_days)}%
                    </TableCell>
                    <TableCell className="capitalize">{forecast.at_risk_component}</TableCell>
                    <TableCell className="text-right">
                      <Link to={`/assets/${asset.id}/forecast/${forecast.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
                </TableBody>
              </Table>
              <Pagination
                page={forecasts.page}
                totalPages={forecasts.total_pages}
                totalItems={forecasts.total}
                pageSize={forecasts.page_size}
                onPageChange={setForecastPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inspections</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {inspectionsLoading ? (
            <div className="p-6">
              <LoadingSpinner />
            </div>
          ) : inspectionsError ? (
            <div className="p-6">
              <Error message="Failed to load inspections" onRetry={() => refetchInspections()} />
            </div>
          ) : !inspections || inspections.items.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No inspections found"
                description="Upload an inspection for this asset to see it here"
                action={
                  <Link to={`/inspection/upload?asset=${asset.id}`}>
                    <Button>Upload Inspection</Button>
                  </Link>
                }
              />
            </div>
          ) : (
            <>
              <Table>
                <TableHead>
                <TableRow index={0}>
                  <TableHeader>ID</TableHeader>
                  <TableHeader>Pilot</TableHeader>
                  <TableHeader>Captured</TableHeader>
                  <TableHeader>Validation</TableHeader>
                  <TableHeader>Analysis</TableHeader>
                  <TableHeader>Health</TableHeader>
                  <TableHeader className="text-right">Action</TableHeader>
                </TableRow>
                </TableHead>
                <TableBody>
                {inspections.items.map((inspection, idx) => (
                  <TableRow key={inspection.inspection_id} index={idx + 1}>
                    <TableCell className="font-mono text-xs">
                      <Link
                        to={`/inspection/${inspection.inspection_id}`}
                        className="text-text-primary transition-colors hover:text-primary"
                      >
                        {inspection.inspection_id.slice(0, 8)}
                      </Link>
                    </TableCell>
                    <TableCell>{inspection.pilot_id}</TableCell>
                    <TableCell className="text-text-secondary">
                      {format(new Date(inspection.capture_date), 'MMM d, yyyy, h:mm a')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={validationVariant(inspection.validation_status)}>
                        {formatLabel(inspection.validation_status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={analysisVariant(inspection.analysis_status)}>
                        {formatLabel(inspection.analysis_status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {inspection.health_score === null ? (
                        <span className="text-text-secondary">—</span>
                      ) : (
                        <span className="font-medium">{inspection.health_score}%</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/inspection/${inspection.inspection_id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
                </TableBody>
              </Table>
              <Pagination
                page={inspections.page}
                totalPages={inspections.total_pages}
                totalItems={inspections.total}
                pageSize={inspections.page_size}
                onPageChange={setInspectionPage}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AssetDetails
