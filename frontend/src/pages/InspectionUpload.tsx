import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Upload, CheckCircle2 } from 'lucide-react'
import { useUploadInspection } from '@/hooks/useInspection'
import { useAssets } from '@/hooks/useAssets'
import { Button, Card, CardHeader, CardTitle, CardContent, FormGroup, Label, Input, Select } from '@/components'
import { Alert, EmptyState } from '@/components/Loading'

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

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles((prev) => [...prev, ...droppedFiles])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...selectedFiles])
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
          setTimeout(() => {
            navigate(`/inspection/${data.inspection_id}`)
          }, 3000)
        },
      }
    )
  }

  if (uploadSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl"
      >
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <CheckCircle2 className="h-12 w-12 text-green-600 mb-4" />
            </motion.div>
            <h2 className="text-2xl font-bold text-accent-cyan mb-2">Upload Successful!</h2>
            <p className="text-white mb-6">Your inspection has been uploaded and is being processed.</p>
            <p className="text-sm text-white mb-6">Inspection ID: {uploadedInspectionId}</p>
            <p className="text-sm text-white">Redirecting to inspection details...</p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-100 to-accent-cyan bg-clip-text text-transparent">Upload Inspection</h1>
        <p className="mt-2 text-white">Upload images for drone inspection analysis</p>
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
              <motion.div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative rounded-lg border-2 border-dashed px-6 py-12 transition-colors ${
                  isDragging
                    ? 'border-primary-500 bg-dark-800'
                    : 'border-gray-300 bg-dark-800 hover:border-gray-400'
                }`}
              >
                <div className="text-center">
                  <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <p className="text-lg font-medium text-white">Drag and drop images here</p>
                  <p className="text-sm text-white">or</p>
                  <label className="text-primary-600 hover:text-primary-700 cursor-pointer font-medium">
                    select files
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              </motion.div>
            </FormGroup>

            {files.length > 0 && (
              <FormGroup>
                <Label>Selected Files ({files.length})</Label>
                <div className="space-y-2">
                  {files.map((file, idx) => (
                    <motion.div
                      key={`${file.name}-${idx}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between rounded bg-dark-800 p-3"
                    >
                      <span className="text-sm text-white">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="text-xs text-red-600 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </motion.div>
                  ))}
                </div>
              </FormGroup>
            )}

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={!assetId || !pilotId || files.length === 0}
                isLoading={isPending}
              >
                Upload Inspection
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/assets')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default InspectionUpload
