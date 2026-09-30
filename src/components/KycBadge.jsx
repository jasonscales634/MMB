const KycBadge = ({ status }) => {
  if (status === null) {
    return (
      <span className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-700">
        Not Submitted
      </span>
    );
  }

  return status ? (
    <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
      Verified
    </span>
  ) : (
    <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
      Pending
    </span>
  );
};

export default KycBadge;
