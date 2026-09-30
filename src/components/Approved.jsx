import React, { useEffect, useState } from "react";
import api from "../services/api";

const Approved = () => {
  const [loan, setLoan] = useState(null);
  const [message, setMessage] = useState("");

  const fetchLoan = async () => {
    try {
      const res = await api.get("/loan/loan/my-loans", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      const loans = res.data || [];

      if (loans.length > 0) {
        const latest = loans.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )[0];

        setLoan(latest);
      }
    } catch (err) {
      setMessage("ডাটা লোড করতে সমস্যা হয়েছে");
    }
  };

  useEffect(() => {
    fetchLoan();
  }, []);

  return (
    <div className="p-4">

      {message && (
        <p className="text-red-600 text-center">{message}</p>
      )}

      {!loan ? (
        <p className="text-center text-gray-600">
          কোনো লোন পাওয়া যায়নি
        </p>
      ) : loan.loan_status === "Approved" ? (
        <div className="bg-green-100 border border-green-300 p-4 rounded-xl">
          <h2 className="text-green-700 font-bold text-lg">
            🎉 Loan Approved
          </h2>

          <p>Amount: {loan.amount}</p>
          <p>Months: {loan.months}</p>
          <p>Monthly Installment: {loan.monthly_installment}</p>
          <p>Status: {loan.loan_status}</p>
        </div>
      ) : (
        <div className="bg-yellow-100 border border-yellow-300 p-4 rounded-xl">
          <p className="font-bold">
            Status: {loan.loan_status}
          </p>
        </div>
      )}

    </div>
  );
};

export default Approved;