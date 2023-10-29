import React, { useEffect, useState } from "react";
import { ChatScreens, GroupScreens } from "../Components";
import { getGroupsRequest } from "../Helpers";
import { GroupListHeader } from "../Components/GroupScreens/GroupListHeader";
import {
  checkAuth,
  createGroupRequest,
  createUserRequest,
} from "../Helpers/_requests";
import SignupForm from "./signup";

function Dashboard({ handleLogout }) {
  const auth = checkAuth();
  const [state, setState] = useState({
    search: "",
    groups: [],
    selectedGroup: null,
    createUser: false,
  });

  const getGroups = async () => {
    const result = await getGroupsRequest(state.search);
    if (result.success) {
      setState({ ...state, groups: result.data });
    }
  };

  const createGroup = async (groupName) => {
    if (groupName !== "") {
      const result = await createGroupRequest(groupName);
      if (result.success) {
        getGroups();
      }
    }
  };

  useEffect(() => {
    getGroups();
  }, [state.search,state.createUser]);

  return (
    <>
      <div className="flex">
        <div className="w-1/3 h-12 h-screen ">
          <GroupListHeader
            handleSearch={(search) => setState({ ...state, search: search })}
            handleLogout={handleLogout}
            handleAddGroup={(groupName) => createGroup(groupName)}
          />
          <GroupScreens
            groups={state.groups}
            handleGroupSelect={(group) =>
              setState({ ...state, selectedGroup: group })
            }
          />
        </div>
        <div className="w-3/4 h-12">
          {state.createUser ? (
            <>
              <SignupForm
                submitCallback={async (value) => {
                  const result = await createUserRequest(value.formData);
                  console.log(result);
                  if (result.success) {
                    setState({ ...state, createUser: false });
                  }
                }}
              />
            </>
          ) : (
            state.selectedGroup && (
              <ChatScreens
                isAdmin={auth.data?.isAdmin}
                userId={auth.data?._id}
                groupId={state.selectedGroup._id}
                group={state.selectedGroup}
                handleCreateUser={() =>
                  setState({ ...state, selectedGroup: null, createUser: true })
                }
              />
            )
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
