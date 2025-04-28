function TodaysTransactionsTable({ todaysTransactions, isLoading, navigate }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        Today's Latest Transactions
      </h2>
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <span className="text-gray-500">Loading transactions...</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {todaysTransactions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-gray-400">
                    No transactions found for today.
                  </td>
                </tr>
              ) : (
                todaysTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="cursor-pointer hover:bg-indigo-50 transition"
                    onClick={() => navigate("/transaction")}
                  >
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      {tx.date}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      {tx.customerName}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      {tx.totalAmount.toLocaleString(undefined, {
                        style: "currency",
                        currency: "PHP",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TodaysTransactionsTable;
