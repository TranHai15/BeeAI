import { useEffect, useContext, useRef } from "react";
import Markdown from "react-markdown";

import InputMessage from "../inputMessage";
import "./style.css";
import { ChatContext } from "../../../../contexts/ChatContext";

export default function ChatBoxConTent() {
  const { MessageChat, isLoading } = useContext(ChatContext);
  const chatEndRef = useRef(null);
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [MessageChat]);
  const text =
    "# Đây là Heading 1 \n ## Đây là Heading 2 \n ### Đây là Heading 3 \n #### Đây là Heading 4\n **Đây là văn bản in đậm.** *Đây là văn bản in nghiêng.* [Đây là một liên kết](https://www.example.com) ![Đây là một hình ảnh](https://via.placeholder.com/150) --- - Đây là một danh sách - Mục 2 - Mục con 1 - Mục con 2 --- > Đây là một trích dẫn văn bản. --- `Đây là một đoạn mã` --- 1. Mục 1 trong danh sách có thứ tự 2. Mục 2 1. Mục con 1 2. Mục con 2 ---";
  return (
    <div className="ChatBoxConTent relative ">
      <main className="container__message your-element">
        {MessageChat.map((text, index) => (
          <div key={index}>
            <div className="min-w-full flex gap-4">
              {text.role === "assistant" && (
                <div className="logo__chat logo__none w-10 h-w-10">
                  <img src="../../../../src/assets/user/logo.svg" />
                </div>
              )}
              <div
                className={` min-w-full flex ${
                  text.role === "user" ? "justify-end" : "gap-4 items-start"
                }`}
              >
                <div
                  className={` ${
                    text.role === "user"
                      ? "content__chat--user w-3/4 items-end"
                      : "content__chat"
                  }`}
                >
                  <Markdown>{text.content.trim("")}</Markdown>
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* loadaing */}
        {isLoading && (
          <div className="flex gap-4 items-start">
            <div className="logo__chat logo__none w-10 h-w-10">
              <img src="../../../../src/assets/user/logo.svg" />
            </div>
            <>
              <div className="loading-indicator">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </>
          </div>
        )}
        <div ref={chatEndRef} />
      </main>
      {/* <Markdown>{markdown}</Markdown> */}
      <div className="inputMessage">
        <InputMessage />
      </div>
    </div>
  );
}
