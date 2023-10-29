import React from "react";

export default function index({ groups, handleGroupSelect }) {
  return (
    <>
      <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700 flex-col">
        {groups.map((group) => (
          <SingleGroup group={group} key={group._id} onClick={handleGroupSelect} />
        ))}
      </ul>
    </>
  );
}

const SingleGroup = ({ group, onClick }) => {
  return (
    <>
      <li className="py-2 px-5">
        <div className="flex items-center space-x-4 cursor-pointer" onClick={() => onClick(group)}>
          <div className="flex-shrink-0">
            <div className="w-9 h-9 bg-gray-400 rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
              {group?.name}
            </p>
            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
              Members: {group?.members?.length}
            </p>
          </div>
        </div>
      </li>
    </>
  );
};
