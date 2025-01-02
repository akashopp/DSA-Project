import React, { useEffect } from "react";
import { EditorView, keymap } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { indentWithTab } from "@codemirror/commands";
import { basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";

const CodeEditor = ({ handleRunCode }) => {
  useEffect(() => {
    // Initialize the editor
    const editor = new EditorView({
      state: EditorState.create({
        extensions: [
          basicSetup,
          javascript(),
          keymap.of([
            {
              key: "Ctrl-Enter",
              run: () => {
                console.log("Ctrl-Enter detected!");
                handleRunCode();
                return true;
              },
              preventDefault: true,
            },
            {
              key: "Tab",
              run: indentWithTab,
            },
            {
              key: "Shift-Tab",
              run: indentWithTab,
            },
          ]),
        ],
      }),
      parent: document.getElementById("editor"),
    });

    // Cleanup the editor on component unmount
    return () => {
      editor.destroy();
    };
  }, [handleRunCode]);

  // Optional: Global fallback for Ctrl-Enter
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        console.log("Global Ctrl-Enter detected!");
        handleRunCode();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [handleRunCode]);

  return <div id="editor" style={{ height: "500px", border: "1px solid #ddd" }}></div>;
};

export default CodeEditor;