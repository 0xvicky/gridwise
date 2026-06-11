import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, CheckCircle2, X, FileImage } from 'lucide-react'
import { useUploadInspection } from '@/hooks/useInspection'
import { useAssets } from '@/hooks/useAssets'
import { Button, Card, CardContent, FormGroup, Label, Input, Select } from '@/components'

const InspectionUpload: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { data: assets } = useAssets()
  const { mutate: uploadInspection, isPending } = useUploadInspection()

  const [assetId, setAssetId] = useState(searchParams.get('asset') || '')
  const [pilotId, setPilotId] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadedInspectionId, setUploadedInspectionId] = useState<string>('')

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!assetId || !pilotId || files.length === 0) return

    uploadInspection(
      { assetId, pilotId, files },
      {
        onSuccess: (data) => {
          setUploadSuccess(true)
          setUploadedInspectionId(data.inspection_id)
          setTimeout(() => navigate(`/inspection/${data.inspection_id}`), 3000)
        },
      }
    )
  }

  if (uploadSuccess) {
    return (
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-light">
                <CheckCircle2 className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-text-primary">Upload Successful</h2>
              <p className="mt-2 text-sm text-text-secondary">
                Your inspection has been uploaded and is being processed.
              </p>
              <p className="mt-4 font-mono text-xs text-text-secondary">
                {uploadedInspectionId}
              </p>
              <p className="mt-6 text-xs text-text-secondary">
                Redirecting to inspection details...
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-page-title text-text-primary">Upload Inspection</h1>
        <p className="mt-2 text-base text-text-secondary">
          Upload drone imagery for AI-powered defect analysis
        </p>
      </div>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormGroup>
              <Label htmlFor="asset">Asset *</Label>
              <Select
                id="asset"
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                required
              >
                <option value="">Select an asset</option>
                {assets?.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} ({asset.zone})
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="pilot">Pilot ID *</Label>
              <Input
                id="pilot"
                placeholder="Enter pilot identifier"
                value={pilotId}
                onChange={(e) => setPilotId(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Images *</Label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative rounded-card border-2 border-dashed px-6 py-14 transition-all duration-300 ${
                  isDragging
                    ? 'border-primary/40 bg-primary-light/50'
                    : 'border-border bg-surface/50 hover:border-primary/20'
                }`}
              >
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-text-primary">
                    Drag and drop images here
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">or</p>
                  <label className="mt-2 inline-block cursor-pointer text-sm font-medium text-primary hover:text-primary-dark">
                    browse files
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </FormGroup>

            <AnimatePresence>
              {files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <FormGroup>
                    <Label>Selected Files ({files.length})</Label>
                    <div className="space-y-2">
                      {files.map((file, idx) => (
                        <div
                          key={`${file.name}-${idx}`}
                          className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2.5"
                        >
                          <div className="flex items-center gap-2">
                            <FileImage size={14} className="text-text-secondary" />
                            <span className="text-sm text-text-primary">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(idx)}
                            className="text-text-secondary transition-colors hover:text-critical"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </FormGroup>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3 border-t border-border pt-6">
              <Button
                type="submit"
                disabled={!assetId || !pilotId || files.length === 0}
                isLoading={isPending}
              >
                Upload Inspection
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate('/assets')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default InspectionUpload
