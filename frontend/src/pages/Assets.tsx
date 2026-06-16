import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { useAssets } from '@/hooks/useAssets'
import {
  Button,
  Card,
  CardContent,
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  PageHeader,
} from '@/components'
import { LoadingSpinner, Error, EmptyState } from '@/components/Loading'
import { AssetType } from '@/types/enums'

const Assets: React.FC = () => {
  const { data: assets, isLoading, error, refetch } = useAssets()
  const [search, setSearch] = useState('')

  const filteredAssets =
    assets?.filter(
      (asset) =>
        asset.name.toLowerCase().includes(search.toLowerCase()) ||
        asset.zone.toLowerCase().includes(search.toLowerCase())
    ) || []

  const getAssetTypeLabel = (type: AssetType): string => {
    const labels: Record<AssetType, string> = {
      [AssetType.TRANSMISSION_TOWER]: 'Transmission Tower',
      [AssetType.OHE_RAIL]: 'OHE Rail',
      [AssetType.DISTRIBUTION_POLE]: 'Distribution Pole',
    }
    return labels[type]
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Assets"
        description="Manage and monitor your infrastructure assets"
        action={
          <Link to="/assets/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Asset
            </Button>
          </Link>
        }
      />

      <Card>
        <div className="border-b border-border px-6 py-4">
          <div className="relative max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
            />
            <input
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="field-control h-10 w-full bg-background pl-9 pr-4 text-sm"
            />
          </div>
        </div>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="p-6">
              <Error message="Failed to load assets" onRetry={() => refetch()} />
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No assets found"
                description={
                  search ? 'Try adjusting your search' : 'Create your first asset to get started'
                }
                action={
                  !search && (
                    <Link to="/assets/new">
                      <Button>Create Asset</Button>
                    </Link>
                  )
                }
              />
            </div>
          ) : (
            <Table>
              <TableHead>
                <TableRow index={0}>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Type</TableHeader>
                  <TableHeader>Zone</TableHeader>
                  <TableHeader>Installed</TableHeader>
                  <TableHeader>Coordinates</TableHeader>
                  <TableHeader className="text-right">Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAssets.map((asset, idx) => (
                  <TableRow key={asset.id} index={idx + 1}>
                    <TableCell className="font-medium">
                      <Link
                        to={`/assets/${asset.id}`}
                        className="text-primary transition-colors hover:text-accent"
                      >
                        {asset.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-text-secondary">
                      {getAssetTypeLabel(asset.asset_type)}
                    </TableCell>
                    <TableCell>{asset.zone}</TableCell>
                    <TableCell className="text-text-secondary">{asset.installed_year}</TableCell>
                    <TableCell className="font-mono text-xs text-text-secondary">
                      {asset.latitude.toFixed(4)}, {asset.longitude.toFixed(4)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/assets/${asset.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                        <Link to={`/inspection/upload?asset=${asset.id}`}>
                          <Button variant="outline" size="sm">
                            Inspect
                          </Button>
                        </Link>
                        <Link to={`/assets/${asset.id}/forecast`}>
                          <Button variant="outline" size="sm">
                            Forecast
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Assets
