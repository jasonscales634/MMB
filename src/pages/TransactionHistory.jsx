import React, { useEffect, useState } from "react";
import api from "../services/api";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/deposit/my-transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to load transaction history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6">
          Transaction History
        </h1>

        {loading && (
          <p className="text-gray-500 animate-pulse">Loading...</p>
        )}

        {error && (
          <p className="text-red-500 font-semibold">{error}</p>
        )}

        {!loading && !error && transactions.length === 0 && (
          <p className="text-gray-500">No transactions found.</p>
        )}

        {!loading && transactions.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">#</th>
                  <th className="px-4 py-2 border">Amount</th>
                  <th className="px-4 py-2 border">Type</th>
                  <th className="px-4 py-2 border">Description</th>
                  <th className="px-4 py-2 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn, index) => (
                  <tr key={txn.id} className="text-center">
                    <td className="px-4 py-2 border">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 border font-semibold">
                      ৳ {txn.amount}
                    </td>
                    <td
                      className={`px-4 py-2 border font-semibold ${
                        txn.type === "credit"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {txn.type.toUpperCase()}
                    </td>
                    <td className="px-4 py-2 border">
                      {txn.description}
                    </td>
                    <td className="px-4 py-2 border text-sm text-gray-600">
                      {new Date(txn.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
