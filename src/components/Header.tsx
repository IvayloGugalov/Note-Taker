import { signIn, signOut, useSession } from "next-auth/react";

import React from 'react'

export const Header = () => {
  const { data: sessionData}  = useSession();

  return (
    <div className="navbar bg-primary text-primary-content">
      <div className="flex-1 pl-5 text-3xl font-bold">
        {sessionData?.user?.name ? `Notes for ${sessionData.user.name}` : ""}
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown-end dropdown-hover dropdown mr-2 mt-1">
          {sessionData?.user ? (
            <label
              tabIndex={0}
              className="btn-ghost btn-circle avatar btn"
            >
              <div className="w-10 rounded-full">
                <img
                  src={sessionData?.user?.image ?? ""}
                  alt={sessionData?.user?.name ?? ""}
                />
              </div>
            </label>
          ) : (
            <button
              className="btn-ghost rounded-btn btn"
              onClick={() => void signIn()}
            >
              Sign in
            </button>
          )}
          {sessionData?.user && (
            <ul
              tabIndex={0}
              className='-mt-1 dropdown-content menu p-2 bg-base-100 rounded-box w-40 shadow-lg'
            >
              <li>
                <label
                  className="btn-ghost btn text-black text-xs"
                  onClick={() => void signOut()}
                >
                  Sign out
                </label>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  )
};