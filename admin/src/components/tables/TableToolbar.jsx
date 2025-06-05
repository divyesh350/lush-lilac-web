import { RiSearchLine, RiFilterLine } from 'react-icons/ri';

const TableToolbar = ({
  searchQuery = '',
  onSearch,
  onFilter,
  actions = [],
  selectedCount = 0,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 ${className}`}>
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-none">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search..."
            className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        {onFilter && (
          <button
            onClick={onFilter}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <RiFilterLine />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        {selectedCount > 0 && (
          <span className="text-sm text-gray-600">
            {selectedCount} selected
          </span>
        )}
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            disabled={action.disabled}
            className={`px-4 py-2 rounded-lg ${
              action.variant === 'secondary'
                ? 'border border-gray-200 hover:bg-gray-50'
                : 'bg-primary text-white hover:bg-primary-dark'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {action.icon && <span className="mr-2">{action.icon}</span>}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TableToolbar; 