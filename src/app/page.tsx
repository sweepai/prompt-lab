"use client"

import React, { Suspense, useEffect, useState } from "react";
import RegexVisualizer from "./RegexVisualizer";
import "./Highlighter.css"; // Import the CSS file for styling
import Message, { getNextRole, MessageType } from "./Message";
import { RecoilRoot } from 'recoil';

function getRandomInt() {
  return Math.floor(Math.random() * 2147483647); // The maximum is exclusive and the minimum is inclusive
}

const Toast = ({ content }: { content: string }) => {
  return (
    <div id="toast-danger" className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
          </svg>
          <span className="sr-only">Error icon</span>
      </div>
      <div className="ms-3 text-sm font-normal">Item has been deleted.</div>
      <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-danger" aria-label="Close">
          <span className="sr-only">Close</span>
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
      </button>
    </div>
  )
}

const default_user_message = `The following is code written by a user for you to unit test.

<code>
\`\`\`
def check_tictactoe_win(board: list[list[str]], player: str = "X") -> bool:
    for row in board:
        if all(s == player for s in row):
            return True
    for col in range(3):
        if all(board[row][col] == player for row in range(3)):
            return True
    if all(board[i][i] == player for i in range(3)) or all(board[i][2-i] == player for i in range(3)):
        return True
    return False
\`\`\`
</code>

Write me a unit test for this code in the following format:

<unit_test>
\`\`\`
The unit test using the unittest module.
\`\`\`
</unit_test>`

const defaultDisplayContent = `<test_cases>
1. Test when there is a winning condition in a row.
2. Test when there is a winning condition in a column.
3. Test when there is a winning condition in a diagonal.
4. Test when there is no winning condition.
5. Test when the player is "O" instead of "X".
6. Test with an empty or invalid board.

</test_cases>

<unit_test>

\`\`\`python
import unittest

class TicTacToeTests(unittest.TestCase):
    
    def test_win_in_row(self):
        board = [["X", "X", "X"], [" ", " ", " "], [" ", " ", " "]]
        self.assertTrue(check_tictactoe_win(board, "X"))

    def test_win_in_column(self):
        board = [["X", " ", " "], ["X", " ", " "], ["X", " ", " "]]
        self.assertTrue(check_tictactoe_win(board, "X"))

    def test_win_in_diagonal(self):
        board = [["X", " ", " "], [" ", "X", " "], [" ", " ", "X"]]
        self.assertTrue(check_tictactoe_win(board, "X"))

    def test_no_win(self):
        board = [[" ", " ", " "], [" ", " ", " "], [" ", " ", " "]]
        self.assertFalse(check_tictactoe_win(board, "X"))

    def test_win_with_O(self):
        board = [[ "O", "O", "O"], [ " ", " ", " "], [" ", " ", " "]]
        self.assertTrue(check_tictactoe_win(board, "O"))
        
    def test_invalid_board(self):
        board = [[" ", " ", " "], [" ", " ", " "]]
        with self.assertRaises(IndexError):
            check_tictactoe_win(board, "X")

    # add this line so when the file is run, it runs the tests
    if __name__ == "__main__":
        unittest.main()
\`\`\`
</unit_test>`

const Main = () => {
  const [messages, setMessages] = useState<MessageType[]>(() => {
    // Load messages from local storage or default to initial array
    const savedMessages = typeof window !== "undefined" ? localStorage.getItem('messages') : null;
    return savedMessages ? JSON.parse(savedMessages) : [
      { content: "You are an expert Python QA engineer.", role: "system", id: 0 },
      { content: default_user_message, role: "user", id: 1 },
    ];
  });
  const [displayContent, setDisplayContent] = useState<string>(defaultDisplayContent);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('messages', JSON.stringify(messages));
    }
  }, [messages]);
  const runLLM = async () => {
    try {
      const response = await fetch("/api", {
        method: "POST", 
        body: JSON.stringify({
          messages: messages.map((message: MessageType) => {
            return {
              content: message.content,
              role: message.role
            }
          })
        })
      })!
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      const reader = response.body!.getReader();
      var displayContent = "";
      setDisplayContent(displayContent);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = new TextDecoder().decode(value);
        var displayContent = displayContent + chunk;
        setDisplayContent(displayContent);
      }
    } catch (e) {
      alert(e)
      console.error(e);
    }
  }

  return (
    <RecoilRoot>
      <main className="flex min-h-screen flex-col items-center justify-between p-12 font-mono">
        <h1 className="text-2xl mb-3">Prompt Playground</h1>
        <div className="h-screen w-full flex">
          <div className="w-1/3 p-4">
            {messages.map((message: MessageType) => (
              <Message
                content={message.content}
                role={message.role}
                id={message.id}
                onChange={(newContent: string) => {
                  setMessages((messages: MessageType[]) => messages.map((item: MessageType) => {
                    if (item.id === message.id) {
                      return { ...item, content: newContent };
                    }
                    return item;
                  }));
                }}
                onChangeRole={() => {
                  setMessages((messages: MessageType[]) => messages.map((item: MessageType) => {
                    if (item.id === message.id) {
                      return { ...item, role: getNextRole(item.role) };
                    }
                    return item;
                  }));
                }}
                onDelete={() => {
                  setMessages((messages: MessageType[]) => messages.filter((item: MessageType) => item.id !== message.id));
                }}
                key={message.id}
              />
            ))}
            <br/>
            <button
              className="font-bold text-lg mb-2 bg-gray-700 hover:bg-gray-800 text-white p-2 rounded w-full text-left"
              onClick={() => {setMessages((messages: MessageType[]) => [...messages, { content: "", role: "user", id: getRandomInt() }])}}
            >
              Add message
            </button>
          </div>
          <div className="w-2/3 p-4">
            <RegexVisualizer text={displayContent} runLLM={runLLM} />
            {/* <button
              className="font-bold text-xl mb-2 bg-blue-700 hover:bg-blue-800 text-white p-2 rounded w-full text-left mt-4"
              onClick={runLLM}
            >
              Run
            </button> */}
          </div>
        </div>
      </main>
    </RecoilRoot>
  )
}

export default function Home() {
  return (
    <RecoilRoot>
      <Main/>
    </RecoilRoot>
  )
}