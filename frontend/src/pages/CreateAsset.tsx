import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateAsset } from '@/hooks/useAssets'
import { Button, Card, CardContent, FormGroup, Label, Input, Select } from '@/components'
import { Alert } from '@/components/Loading'
import { CreateAssetRequest } from '@/types'
import { AssetType } from '@/types/enums'

const CreateAsset: React.FC = () => {
  const navigate = useNavigate()
  const { mutate: createAsset, isPending } = useCreateAsset()
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState<CreateAssetRequest>({
    name: '',
    asset_type: AssetType.TRANSMISSION_TOWER,
    latitude: 0,
    longitude: 0,
    zone: '',
    installed_year: new Date().getFullYear(),
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'latitude' || name === 'longitude' || name === 'installed_year'
          ? parseFloat(value) || 0
          : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createAsset(formData, {
      onSuccess: () => {
        setShowSuccess(true)
        setTimeout(() => navigate('/assets'), 2000)
      },
    })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-page-title text-primary">Create Asset</h1>
        <p className="mt-2 text-base text-text-secondary">
          Register a new infrastructure asset in the system
        </p>
      </div>

      {showSuccess && (
        <Alert
          type="success"
          message="Asset created successfully! Redirecting..."
          onClose={() => setShowSuccess(false)}
        />
      )}

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormGroup>
              <Label htmlFor="name">Asset Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Tower A-01"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="asset_type">Asset Type *</Label>
              <Select
                id="asset_type"
                name="asset_type"
                value={formData.asset_type}
                onChange={handleChange}
              >
                <option value={AssetType.TRANSMISSION_TOWER}>Transmission Tower</option>
                <option value={AssetType.OHE_RAIL}>OHE Rail</option>
                <option value={AssetType.DISTRIBUTION_POLE}>Distribution Pole</option>
              </Select>
            </FormGroup>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormGroup>
                <Label htmlFor="latitude">Latitude *</Label>
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  placeholder="0.0000"
                  step="0.0001"
                  value={formData.latitude}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="longitude">Longitude *</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  placeholder="0.0000"
                  step="0.0001"
                  value={formData.longitude}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormGroup>
                <Label htmlFor="zone">Zone *</Label>
                <Input
                  id="zone"
                  name="zone"
                  placeholder="e.g., North Region"
                  value={formData.zone}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="installed_year">Installed Year *</Label>
                <Input
                  id="installed_year"
                  name="installed_year"
                  type="number"
                  placeholder="2024"
                  value={formData.installed_year}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </div>

            <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row">
              <Button type="submit" isLoading={isPending}>
                Create Asset
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

export default CreateAsset
