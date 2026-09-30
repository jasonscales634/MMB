import React from "react";

const Card = ({ title, children }) => {
  return (
    <div className="bg-white p-4 rounded shadow space-y-3">
      <h2 className="font-bold text-lg">{title}</h2>
      {children}
    </div>
  );
};

export default Card;
