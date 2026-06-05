import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Search } from 'lucide-react'
import { useAssets } from '@/hooks/useAssets'
import { Button, Card, CardHeader, CardTitle, CardContent, Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '@/components'
import { LoadingSpinner, Error, EmptyState } from '@/components/Loading'
import { AssetType } from '@/types/enums'

const Assets: React.FC = () => {
  const { data: assets, isLoading, error, refetch } = useAssets()
  const [search, setSearch] = useState('')

  const filteredAssets = assets?.filter(
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-100 to-accent-cyan bg-clip-text text-transparent">Assets</h1>
          <p className="mt-2 text-white">Manage your infrastructure assets</p>
        </div>
        <Link to="/assets/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Asset
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 rounded-lg border border-dark-600 bg-dark-800 px-4 py-2">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-500"
            />
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <Error message="Failed to load assets" onRetry={() => refetch()} />
          ) : filteredAssets.length === 0 ? (
            <EmptyState
              title="No assets found"
              description={search ? 'Try adjusting your search' : 'Create your first asset to get started'}
              action={!search && <Link to="/assets/new"><Button>Create Asset</Button></Link>}
            />
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Type</TableHeader>
                  <TableHeader>Zone</TableHeader>
                  <TableHeader>Installed Year</TableHeader>
                  <TableHeader>Coordinates</TableHeader>
                  <TableHeader className="text-right">Action</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAssets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.name}</TableCell>
                    <TableCell>{getAssetTypeLabel(asset.asset_type)}</TableCell>
                    <TableCell>{asset.zone}</TableCell>
                    <TableCell>{asset.installed_year}</TableCell>
                    <TableCell className="text-sm text-white">
                      {asset.latitude.toFixed(4)}, {asset.longitude.toFixed(4)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/inspection/upload?asset=${asset.id}`}>
                        <Button variant="secondary" size="sm">
                          Inspect
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default Assets
