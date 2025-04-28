function SummaryCards({
  totalAnnualSales,
  currentYear,
  expensesTotal,
  currentMonthName,
  monthlyLoss,
  monthlyIncome, // new prop
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
        <span className="text-gray-500 text-sm mb-1">
          Total Annual Sales ({currentYear})
        </span>
        <span className="text-2xl font-bold text-green-600 flex items-center gap-3">
          {totalAnnualSales.toLocaleString(undefined, {
            style: "currency",
            currency: "PHP",
          })}
          <img
            src="/src/assets/money.svg"
            alt="Dashboard Icon"
            className="h-7 w-7"
          />
        </span>
      </div>
      <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
        <span className="text-gray-500 text-sm mb-1">
          Income for this month
        </span>
        <span className="text-2xl font-bold text-blue-600 flex items-center gap-3">
          {monthlyIncome.toLocaleString(undefined, {
            style: "currency",
            currency: "PHP",
          })}
          <img
            src="/src/assets/calendar.svg"
            alt="Dashboard Icon"
            className="h-7 w-7"
          />
        </span>
      </div>
      <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
        <span className="text-gray-500 text-sm mb-1">
          Operational Expenses ({currentMonthName} {currentYear})
        </span>
        <span className="text-2xl font-bold text-red-600 flex items-center gap-3">
          {expensesTotal.toLocaleString(undefined, {
            style: "currency",
            currency: "PHP",
          })}
          <img
            src="/src/assets/clip-board.svg"
            alt="Dashboard Icon"
            className="h-7 w-7"
          />
        </span>
      </div>
      <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
        <span className="text-gray-500 text-sm mb-1">Loss for this month</span>
        <span className="text-2xl font-bold text-yellow-600 flex items-center gap-3">
          {monthlyLoss.toLocaleString(undefined, {
            style: "currency",
            currency: "PHP",
          })}
          <img
            src="/src/assets/truck.svg"
            alt="Dashboard Icon"
            className="h-7 w-7"
          />
        </span>
      </div>
    </div>
  );
}

export default SummaryCards;
