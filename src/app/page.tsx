"use client"

import React, { useEffect, useState } from "react";
import RegexVisualizer from "./RegexVisualizer";
import "./Highlighter.css"; // Import the CSS file for styling
import Message, { getNextRole, MessageType } from "./Message";

function getRandomInt() {
  return Math.floor(Math.random() * 2147483647); // The maximum is exclusive and the minimum is inclusive
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
  const [apiKey, setApiKey] = useState<string>(() => {
    // Load API key from local storage or default to empty string
    const savedApiKey = typeof window !== "undefined" ? localStorage.getItem('apiKey') : null;
    return savedApiKey ? savedApiKey : "";
  });
  const [messages, setMessages] = useState<MessageType[]>(() => {
    // Load messages from local storage or default to initial array
    const savedMessages = typeof window !== "undefined" ? localStorage.getItem('messages') : null;
    return savedMessages ? JSON.parse(savedMessages) : [
      { content: "You are an expert Python QA engineer.", role: "system", id: 0 },
      { content: default_user_message, role: "user", id: 1 },
    ];
  });
  const [displayContent, setDisplayContent] = useState<string>(defaultDisplayContent);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const runButtonDisabled = apiKey === "" || messages.length === 0 || isRunning;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('apiKey', apiKey);
    }
  }, [apiKey]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('messages', JSON.stringify(messages));
    }
  }, [messages]);

  const runLLM = async () => {
    setIsRunning(true);
    try {
      const response = await fetch("/api", {
        method: "POST", 
        body: JSON.stringify({
          apiKey: apiKey,
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
    setIsRunning(false);
  }

  console.log(runButtonDisabled)

  return (
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
            <RegexVisualizer text={displayContent} runButton={
                <button
                    className={`font-bold text-xl text-white p-2 rounded w-full text-center w-32 ${!runButtonDisabled ? "bg-blue-700 hover:bg-blue-800" : "bg-gray-700"}`}
                    onClick={runLLM}
                    disabled={runButtonDisabled}
                >
                  Run
                </button>
            } />
            <input 
              type="password"
              className="text-xs bg-gray-800 border border-gray-700 rounded p-2 font-mono w-full mt-4"
              placeholder="Put your OpenAI API key here"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        </div>
      </main>
  )
}

export default function Home() {
  return (
      <Main/>
  )
}