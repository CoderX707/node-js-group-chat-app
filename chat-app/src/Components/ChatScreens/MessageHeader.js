import React, { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { addMemberRequest, getUserRequest } from "../../Helpers/_requests";

export default function MessageHeader({ group, isAdmin, handleCreateUser }) {
  const [state, setState] = useState({ members: [], selected: [] });

  const getMembers = async () => {
    const result = await getUserRequest();
    if (result.success) {
      const members = result.data.map((member) => {
        return { label: member.name, value: member._id };
      });
      setState({ ...state, members: members });
    }
  };

  const addMember = async () => {
    if (state.selected.length > 0) {
      const result = await addMemberRequest(group._id, state.selected[0].value);
      if (result.success) {
        setState({ ...state, selected: [] });
      }
    }
  };

  useEffect(() => {
    getMembers();
  }, []);

  return (
    <>
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <span className="absolute text-green-500 right-0 bottom-0">
              <svg width="20" height="20">
                <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
              </svg>
            </span>
            <div className="w-10 sm:w-16 h-10 sm:h-16 bg-gray-400 rounded-full" />
          </div>
          <div className="flex flex-col leading-tight">
            <div className="text-2xl mt-1 flex items-center">
              <span className="text-gray-700 mr-3 uppercase ">
                {group.name}
              </span>
            </div>
            <span className="text-lg text-gray-600">
              Members: {group.members.length}
            </span>
          </div>
        </div>
        <div>
          <MultiSelect
            hasSelectAll={false}
            options={state.members}
            className="w-min-350px"
            value={state.selected}
            onChange={(value, i) => setState({ ...state, selected: value })}
            labelledBy="Add Members"
          />
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mt-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={addMember}
          >
            Add
          </button>
          {isAdmin && (
            <button
              type="button"
              className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mt-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
              onClick={handleCreateUser}
            >
              Create User
            </button>
          )}
        </div>
      </div>
    </>
  );
}
