import React from "react";

export default function MessageBody({ chat, userId }) {
  return (
    <>
      <div
        id="messages"
        className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
      >
        {chat.length > 0 &&
          chat.map((message, i) => {
            return message.userId === userId ? (
              <div className="chat-message" key={i}>
                <div className="flex items-end">
                  <div className="flex flex-col space-y-2 text-sm max-w-xs mx-2 order-2 items-start">
                    <div>
                      <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                        {message.message}
                      </span>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-gray-400 order-1" />
                </div>
              </div>
            ) : (
              <div className="chat-message">
                <div className="flex items-end justify-end">
                  <div className="flex flex-col space-y-2 text-sm max-w-xs mx-2 order-1 items-end">
                    <div>
                      <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                        {message.message}
                      </span>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-gray-400 order-2" />
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}
