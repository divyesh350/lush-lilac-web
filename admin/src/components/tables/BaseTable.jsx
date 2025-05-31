import { useState } from 'react';
import { motion } from 'framer-motion';
import { RiArrowUpLine, RiArrowDownLine, RiCheckboxBlankLine, RiCheckboxLine } from 'react-icons/ri';

const BaseTable = ({
  columns,
  data,
  onSort,
  onSelect,
  onSelectAll,
  selectedRows = [],
  className = '',
  emptyMessage = 'No data available',
  loading = false,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    onSort?.(key, direction);
  };

  const handleSelectAll = (e) => {
    onSelectAll?.(e.target.checked);
  };

  const handleSelect = (id) => {
    onSelect?.(id);
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            {onSelect && (
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedRows.length === data.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-3 text-left text-sm font-medium text-gray-600 ${
                  column.sortable ? 'cursor-pointer hover:text-primary' : ''
                }`}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {column.sortable && sortConfig.key === column.key && (
                    <span className="text-primary">
                      {sortConfig.direction === 'asc' ? (
                        <RiArrowUpLine />
                      ) : (
                        <RiArrowDownLine />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td
                colSpan={columns.length + (onSelect ? 1 : 0)}
                className="px-4 py-8 text-center text-gray-500"
              >
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (onSelect ? 1 : 0)}
                className="px-4 py-8 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <motion.tr
                key={row.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50"
              >
                {onSelect && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleSelect(row.id)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-sm text-gray-700">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BaseTable; 