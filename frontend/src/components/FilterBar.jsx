"use client";

import { Filter, Download, Sparkles } from 'lucide-react';

export default function FilterBar({
  filter,
  setFilter,
  sortBy,
  setSortBy,
  tasks,
  ariaLabel
}) {
  // Logic to export tasks to CSV as seen in Figma design
  const exportToCSV = () => {
    const headers = ['Task Name', 'Description', 'Status', 'Priority', 'Due Date'];
    const rows = tasks.map(task => [
      task.title,
      task.description,
      task.status,
      task.priority,
      task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tasks_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <section 
      className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 mb-8"
      aria-label={ariaLabel || "Filter and organize tasks"}
      role="region"
    >
      <div className="flex items-center gap-3 mb-6">
        <div 
          className="p-2 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl shadow-lg"
          aria-hidden="true"
        >
          <Filter className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Filter & Organize</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <fieldset>
          <legend className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
            <span 
              className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
              aria-hidden="true"
            ></span>
            Filter by Status
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {['all', 'pending', 'in-progress', 'completed'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  filter === s
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-pressed={filter === s}
                aria-label={`Filter tasks by ${s} status`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Sort By - Figma Design Pattern */}
        <div>
          <label 
            htmlFor="sort-select"
            className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3"
          >
            <span 
              className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
              aria-hidden="true"
            ></span>
            Sort By
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-800 font-medium"
            aria-label="Sort tasks by"
          >
            <option value="createdAt">Date Created</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
          </select>
        </div>

        {/* Export Data - Figma Design Pattern */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
            <span 
              className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
              aria-hidden="true"
            ></span>
            Export Data
          </label>
          <button
            onClick={exportToCSV}
            className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-xl transition-all transform hover:scale-105 font-semibold flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            aria-label="Download tasks as CSV file"
          >
            <Download className="w-5 h-5" aria-hidden="true" />
            Download CSV
          </button>
        </div>
      </div>

      {/* Active Filter Indicators */}
      {(filter !== 'all' || sortBy !== 'createdAt') && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div 
            className="flex items-center gap-2 flex-wrap text-gray-600"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <Sparkles className="w-4 h-4 text-indigo-500" aria-hidden="true" />
            <span className="text-sm font-semibold">Active filters:</span>
            {filter !== 'all' && (
              <span 
                className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold border border-indigo-200"
                role="img"
                aria-label={`Status filter: ${filter}`}
              >
                Status: {filter}
              </span>
            )}
            {sortBy !== 'createdAt' && (
              <span 
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold border border-blue-200"
                role="img"
                aria-label={`Sort by: ${sortBy}`}
              >
                Sort: {sortBy}
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  );
}