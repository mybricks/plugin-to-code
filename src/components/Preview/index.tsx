import React, { useState, useRef, useLayoutEffect } from "react";

import Editor, { Icon, HandlerType } from "@mybricks/coder";
import context from "../../context";
import { toCode } from "../../utils";
import css from "./index.less";

const Preview = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const [code, setCode] = useState("");
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const codeIns = useRef<HandlerType>(null)

  const handlePreviewClick = () => {
    setCode("");
    try {
      const toJSON = context.plugin.project.toJSON({ withDiagrams: true });
    
      toCode(toJSON).then((tsx) => {
        setCode(tsx);
      }).catch((e) => {
        console.error(e);
        setError(true);
      });
    } catch (e) {
      console.error(e);
      setError(true);
    }
  }

  useLayoutEffect(() => {
    const height = 27 + 12 + 22.5;
    setHeight(containerRef.current!.scrollHeight - height);
  }, [])

  return (
    <div ref={containerRef} style={{flex: 1}}>
      <button
        className={`${css.button} ${css.buttonBlock}${error ? ` ${css.error}` : ""}`}
        onClick={handlePreviewClick}
      >{error ? "预览失败，请检查控制台" : "预览"}</button>
      
      {code && (
        <div>
          <div style={{display: "flex", justifyContent: "end"}}>
            <span data-mybricks-tip="展开">
              <Icon className={css.icon} name="plus" onClick={() => {
                setOpen(true);
              }}/>
            </span>
          </div>
          <Editor
            ref={codeIns}
            value={code}
            height={height}
            language="typescript"
            isTsx={true}
            options={{
              readOnly: true,
              fontSize: 13
            }}
            theme="light"
            modal={{
              open,
              width: 1200,
              title: "预览",
              inside: true,
              closeIcon: <Icon name="zoom" data-mybricks-tip="缩小"/>,
              onOpen: () => setOpen(true),
              onClose: () => setOpen(false),
              contentClassName: css.dialog
            }}
          />
        </div>
      )}
    </div>
  )
}

export default Preview;
