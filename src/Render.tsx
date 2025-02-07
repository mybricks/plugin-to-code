import React from "react";

import { Download, Preview } from "./components";
import css from "./Render.module.less";

const Render = () => {
  return (
    <div className={css.container}>
      <div className={css.title}>出码工具</div>
      <div className={css.content}>
        <div className={css.item}>
          <div className={css.itemTitle}>
            源码（Beta）
          </div>
          <div className={css.itemContent}>
            <Download />
            <Preview />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Render;
