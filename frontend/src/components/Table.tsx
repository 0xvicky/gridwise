import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode
}

export const Table: React.FC<TableProps> = ({ className, children, ...props }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    className="overflow-x-auto rounded-card border border-border"
  >
    <table className={clsx('w-full text-sm', className)} {...props}>
      {children}
    </table>
  </motion.div>
)

interface TableHeadProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode
}

export const TableHead: React.FC<TableHeadProps> = ({ children, ...props }) => (
  <thead className="border-b border-border bg-surface/80" {...props}>
    {children}
  </thead>
)

interface TableHeaderProps extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {
  children: React.ReactNode
}

export const TableHeader = React.forwardRef<HTMLTableHeaderCellElement, TableHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <th
      ref={ref}
      className={clsx(
        'px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary',
        className
      )}
      {...props}
    >
      {children}
    </th>
  )
)

TableHeader.displayName = 'TableHeader'

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode
}

export const TableBody: React.FC<TableBodyProps> = ({ children, ...props }) => (
  <tbody className="divide-y divide-border bg-background" {...props}>
    {children}
  </tbody>
)

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode
  index?: number
}

export const TableRow: React.FC<TableRowProps> = ({
  className,
  children,
  index = 0,
  ...props
}) => (
  <motion.tr
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: index * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    className={clsx('transition-colors hover:bg-surface/60', className)}
    {...(props as object)}
  >
    {children}
  </motion.tr>
)

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableDataCellElement> {
  children: React.ReactNode
}

export const TableCell = React.forwardRef<HTMLTableDataCellElement, TableCellProps>(
  ({ className, children, ...props }, ref) => (
    <td
      ref={ref}
      className={clsx('px-5 py-4 text-text-primary', className)}
      {...props}
    >
      {children}
    </td>
  )
)

TableCell.displayName = 'TableCell'
