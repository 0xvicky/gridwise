import React from 'react'
import clsx from 'clsx'

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode
}

export const Table: React.FC<TableProps> = ({ className, children, ...props }) => (
  <div className="overflow-x-auto rounded-lg border border-dark-600 border-opacity-50">
    <table className={clsx('w-full text-sm', className)} {...props}>
      {children}
    </table>
  </div>
)

interface TableHeadProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode
}

export const TableHead: React.FC<TableHeadProps> = ({ children, ...props }) => (
  <thead className="border-b border-dark-600 border-opacity-50 bg-dark-800 bg-opacity-50" {...props}>
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
        'px-6 py-3 text-left text-xs font-medium text-accent-cyan',
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
  <tbody {...props}>{children}</tbody>
)

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode
}

export const TableRow: React.FC<TableRowProps> = ({ className, children, ...props }) => (
  <tr
    className={clsx(
      'border-b border-dark-600 border-opacity-30 transition-all hover:bg-dark-700 hover:bg-opacity-40 hover:border-accent-cyan hover:border-opacity-50',
      className
    )}
    {...props}
  >
    {children}
  </tr>
)

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableDataCellElement> {
  children: React.ReactNode
}

export const TableCell = React.forwardRef<HTMLTableDataCellElement, TableCellProps>(
  ({ className, children, ...props }, ref) => (
    <td
      ref={ref}
      className={clsx('px-6 py-4 text-white', className)}
      {...props}
    >
      {children}
    </td>
  )
)

TableCell.displayName = 'TableCell'
