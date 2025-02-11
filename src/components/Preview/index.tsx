import React, { useState, useRef, useLayoutEffect } from "react";

import Editor, { Icon, HandlerType } from "@mybricks/coder";
import TreeView from "./TreeView";
import context from "../../context";
import { toCode } from "../../utils";
import css from "../../theme.module.less";
import css2 from "./index.module.less";

const Preview = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const [code, setCode] = useState("");
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const codeIns = useRef<HandlerType>(null)
  const [files, setFiles] = useState<{path: string, content: string}[]>([]);

  const handlePreviewClick = () => {
    setFiles([])
    setCode("");
    try {
      const toJSON = context.plugin.project.toJSON({ withDiagrams: true });
      toCode(toJSON).then((tsx) => {
        setFiles(tsx);
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
    <div ref={containerRef} className={css2.container}>
      <button
        className={`${css.button} ${css.buttonBlock}${error ? ` ${css.error}` : ""}`}
        onClick={handlePreviewClick}
      >{error ? "预览失败，请检查控制台" : "预览"}</button>

      <div className={css2.content}>
        {/* 默认的index.tsx */}
        <div className={css2.filesTree}>
          {files.length ? (
            <TreeView defaultCurrent="index.tsx">
              <FilesTree files={files} path="" onSelect={setCode}/>
            </TreeView>
          ) : null}
        </div>
        {code && (
          <div style={{ width: "100%" }}>
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
    </div>
  )
}

export default Preview;

const FileIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z"/></svg>;

const FilesTree = ({ files, path: parentPath, onSelect }: { files: { path: string, content: string }[], path: string, onSelect: (code: string) => void }) => {
  const items: ({
    id: string,
    name: string,
    type: "file"
  } | {
    id: string,
    name: string,
    type: "directory",
    subTree: { path: string, content: string }[]
  }) [] = [];
  const next: Record<string, { path: string, content: string }[]> = {};
  const codeMap: Record<string, string> = {};

  files.forEach(({ path, content }) => {
    const split = path.split("/");
    // 默认当前不存在空文件夹
    if (split.length === 1) {
      if (parentPath + path === "index.tsx") {
        // 默认的index.tsx
        onSelect(content)
      }
      // 文件
      items.push({
        id: parentPath + path,
        name: split[0],
        type: "file",
      })
      codeMap[parentPath + path] = content;
    } else {
      // 文件夹
      if (!next[split[0]]) {
        next[split[0]] = [];
        items.push({
          id: parentPath + split[0],
          name: split[0],
          type: "directory",
          subTree: next[split[0]],
        })
      }

      next[split[0]].push({ path: split.slice(1).join("/"), content })
    }
  })

  return items.map(({ id, name, type, subTree }: any) => {
    const isFile = type === "file";
    return (
      <TreeView.Item
        id={id}
        onSelect={isFile ? () => {
          onSelect(codeMap[id]);
        } : undefined}
        leadingVisual={isFile ? FileIcon : <TreeView.DirectoryIcon />}
        contentText={name}
        hasSubTree={!isFile}
      >
        {/* {name} */}
        {isFile ? null : (
          <TreeView.SubTree>
            <FilesTree files={subTree} path={`${name}/`} onSelect={onSelect} />
          </TreeView.SubTree>
        )}
      </TreeView.Item>
    )
  })
}
