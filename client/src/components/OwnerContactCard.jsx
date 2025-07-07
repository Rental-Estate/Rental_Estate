import { FaPhone, FaEnvelope } from 'react-icons/fa';

const OwnerContactCard = ({ owner }) => {
  if (!owner) return null;

  return (
    <div className="flex items-center space-x-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
      {owner.avatar && (
        <img src={owner.avatar} alt={owner.name} className="w-12 h-12 rounded-full" />
      )}
      <div>
        <h3 className="text-lg font-bold">{owner.name}</h3>
        <p className="text-sm flex items-center gap-2">
          <FaPhone /> {owner.phone}
        </p>
        <p className="text-sm flex items-center gap-2">
          <FaEnvelope /> {owner.email}
        </p>
      </div>
    </div>
  );
};

export default OwnerContactCard;