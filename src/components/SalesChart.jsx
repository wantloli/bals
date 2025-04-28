import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";

function SalesChart({ salesData, isLoading, filter, setFilter }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-10 md:mb-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Sales Over Time</h2>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              filter === "weekly"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-transparent text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setFilter("weekly")}
          >
            Weekly
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              filter === "monthly"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-transparent text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setFilter("monthly")}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              filter === "yearly"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-transparent text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setFilter("yearly")}
          >
            Yearly
          </button>
        </div>
      </div>
      <div className="w-full h-72">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-gray-500">Loading sales data...</span>
          </div>
        ) : (
          <ResponsiveContainer>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(dateStr) => {
                  try {
                    const date = parseISO(dateStr);
                    return format(date, "MMMM dd, yyyy");
                  } catch {
                    return dateStr;
                  }
                }}
              />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#6366f1" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default SalesChart;
