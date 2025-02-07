import React, { useState } from "react";

import context from "../../context";
import { toCode, downloadToFile } from "../../utils";
import css from "./index.less";

const Download = () => {
  const [error, setError] = useState(false);

  const handleDownloadClick = () => {
    try {
      const toJSON = context.plugin.project.toJSON({ withDiagrams: true });
      toCode(toJSON).then((tsx) => {
        downloadToFile({content: tsx, name: `${context.config.fileName}.tsx`});
        setError(false);
      }).catch((e) => {
        console.error(e);
        setError(true);
      })
    } catch (e) {
      console.error(e);
      setError(true);
    }
  }
  

  return (
    <div>
      <button
        className={`${css.button} ${css.buttonBlock}${error ? ` ${css.error}` : ""}`}
        onClick={handleDownloadClick}
      >{error ? "下载失败，请检查控制台" : "下载"}</button>
    </div>
  )
}

export default Download;
