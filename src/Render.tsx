import React from "react";

import { toCode, downloadToFile } from "./utils";
import css from "./Render.module.less";

const Render = (props: any) => {
  const handleDownloadClick = () => {
    const toJSON = props.project.toJSON({ withDiagrams: true });

    toCode(toJSON).then((tsx) => {
      downloadToFile({content: tsx, name: "MyBricksCode.tsx"})
    })
  }

  return (
    <div className={css.container}>
      <div className={css.title}>出码工具</div>
      <div className={css.content}>
        <div className={css.item}>
          <div className={css.itemTitle}>
            下载源码（Beta）
          </div>
          <div>
            <button
              className={`${css.itemButton} ${css.itemButtonBlock}`}
              onClick={handleDownloadClick}
            >下载</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Render;
