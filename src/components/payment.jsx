import React from "react";

const Payment = ({ payment }) => {
  if (!payment) return null;

  const getMethodName = (id) => {
    id = String(id);

    if (id === "1") return "বিকাশ";
    if (id === "2") return "নগদ";
    if (id === "3") return "রকেট";
    if (id === "4") return "ব্যাংক";

    return "-";
  };

  const maskNumber = (num) => {
    if (!num) return "**** **** ****";
    return num.replace(/^(\d{3})\d+(\d{3})$/, "$1***$2");
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-5 rounded-2xl shadow-xl">

      <p className="text-sm text-gray-200">পেমেন্ট পদ্ধতি</p>
      <p className="text-lg font-bold">
        {getMethodName(payment.payment_method_id)}
      </p>

      <p className="mt-3 text-sm text-gray-200">অ্যাকাউন্ট নম্বর</p>
      <p className="font-semibold text-white">
        {maskNumber(
          payment.mobile_wallet_number || payment.bank_account_number
        )}
      </p>

      {payment.payment_description && (
        <p className="mt-3 text-xs text-gray-300">
          {payment.payment_description}
        </p>
      )}
    </div>
  );
};

export default Payment;