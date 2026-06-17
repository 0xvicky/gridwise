import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Brain, ChevronLeft, Component, Sparkles, TrendingDown } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, CardContent, CardHeader, CardTitle, PageHeader } from '@/components'
import { Alert, Error as ErrorState, LoadingSpinner } from '@/components/Loading'
import { RiskCard } from '@/components/forecast/RiskCard'
import { RiskChart } from '@/components/forecast/RiskChart'
import { useAsset } from '@/hooks/useAssets'
import { useForecast, useGenerateForecast } from '@/hooks/useForecast'

const ForecastAsset = () => {
  const { assetId, forecastId } = useParams<{ assetId: string; forecastId: string }>()
  const navigate = useNavigate()
  const { data: asset } = useAsset(assetId)
  const {
    data: savedForecast,
    isLoading: forecastLoading,
    error: forecastLoadError,
    refetch: refetchForecast,
  } = useForecast(assetId, forecastId)
  const { mutate: generateForecast, data: generatedForecast, isPending, error, reset } =
    useGenerateForecast()
  const forecast = savedForecast ?? generatedForecast

  useEffect(() => {
    if (!assetId || !generatedForecast || forecastId === generatedForecast.id) return
    navigate(`/assets/${assetId}/forecast/${generatedForecast.id}`, { replace: true })
  }, [assetId, forecastId, generatedForecast, navigate])

  const handleGenerate = () => {
    if (!assetId) return
    reset()
    generateForecast(assetId)
  }

  const degradationPercent = forecast
    ? forecast.degradation_rate <= 1
      ? forecast.degradation_rate * 100
      : forecast.degradation_rate
    : 0

  if (forecastId && forecastLoading) return <LoadingSpinner />

  const generationErrorMessage =
    error && typeof error === 'object' && 'message' in error
      ? String(error.message)
      : 'Forecast generation failed. Please try again.'

  if (forecastId && forecastLoadError) {
    return <ErrorState message="Failed to load forecast" onRetry={() => refetchForecast()} />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      <PageHeader
        title="AI Asset Forecast"
        description="Predictive maintenance insights generated from historical inspection and defect data."
        back={
          <button
            onClick={() => navigate(assetId ? `/assets/${assetId}` : '/assets')}
            className="mb-4 flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-primary"
          >
            <ChevronLeft size={16} />
            Back to asset
          </button>
        }
      />

      {error && (
        <Alert
          type="error"
          message={generationErrorMessage}
          onClose={reset}
        />
      )}

      {!forecastId && (
        <Card className="overflow-hidden border-primary/15 bg-primary-light/45">
          <CardContent className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                <Sparkles size={21} />
              </div>
              <div>
                <h2 className="text-section-title text-primary">Generate Forecast</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
                  Analyze {asset?.name ? `${asset.name}'s` : "this asset's"} latest inspections and
                  detected defects to calculate near-term maintenance risk.
                </p>
              </div>
            </div>
            <Button size="lg" onClick={handleGenerate} isLoading={isPending} disabled={!assetId}>
              <Brain className="mr-2 h-4 w-4" />
              Generate AI Forecast
            </Button>
          </CardContent>
        </Card>
      )}

      {forecast && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          <section>
            <div className="mb-5">
              <h2 className="text-section-title text-primary">Risk Overview</h2>
              <p className="mt-1 text-sm text-text-secondary">
                Projected likelihood of asset failure by time horizon
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <RiskCard label="30 Day Risk" value={forecast.risk_30_days} index={0} />
              <RiskCard
                label="60 Day Risk"
                value={forecast.risk_60_days}
                trend={forecast.risk_60_days - forecast.risk_30_days}
                index={1}
              />
              <RiskCard
                label="90 Day Risk"
                value={forecast.risk_90_days}
                trend={forecast.risk_90_days - forecast.risk_60_days}
                index={2}
              />
            </div>
          </section>

          <RiskChart forecast={forecast} />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Card hover>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 text-warning">
                  <TrendingDown size={18} />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Degradation Rate</p>
                  <p className="mt-1 text-2xl font-semibold text-text-primary">
                    {degradationPercent.toFixed(0)}%
                  </p>
                </div>
              </div>
            </Card>

            <Card hover>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-critical/10 text-critical">
                  <Component size={18} />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">At Risk Component</p>
                  <p className="mt-1 text-lg font-semibold capitalize text-text-primary">
                    {forecast.at_risk_component}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="border-accent/25 bg-accent-light">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white">
                <AlertTriangle size={18} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-accent-dark">
                  Recommended Action
                </p>
                <p className="mt-2 text-xl font-semibold text-primary">
                  {forecast.recommended_action}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light text-primary">
                  <Brain size={17} />
                </div>
                <CardTitle>AI Reasoning</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="max-w-4xl text-base leading-7 text-text-primary">
                {forecast.reasoning}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}

export default ForecastAsset
