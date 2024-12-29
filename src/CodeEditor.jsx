import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror"; // default import
import { basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";

const CodeEditor = ({ code, setCode }) => {
  console.log('CodeEditor Component Rendered');
  console.log('Current Code:', code);

  return (
    <div style={{ width: '100%', padding: '20px' }}>
      <h2>Code Editor</h2>
      <CodeMirror
        value={code}
        height="200px"
        extensions={[basicSetup, javascript(), oneDark]}
        onChange={(value) => {
          console.log('Code Changed:', value); // Logs every change in the editor
          setCode(value);
        }}
      />
    </div>
  );
};

export default CodeEditor;