import React, { useState } from "react";

import context from "../../context";
import toCode from "@mybricks/to-code-react/dist/esm/toTargetCode"
import css from "../../theme.module.less";

const Download = () => {
  const [error, setError] = useState(false);

  const handleDownloadClick = () => {
    try {
      const toJSON = context.plugin.project.toJSON({ withDiagrams: true });
      const result = toCode(toJSON, { target: "react" });
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
      >{error ? "执行失败，请检查控制台" : "toReact"}</button>
    </div>
  )
}

export default Download;
