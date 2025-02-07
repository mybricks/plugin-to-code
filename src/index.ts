import React from "react";
import Icon from "./Icon";
import Render from "./Render";
import context from "./context";
import { safeParse } from "./utils";

console.log(`%c ${safeParse(NPM_NAME)} %c@${safeParse(NPM_VERSION)}`, `color:#FFF;background:#fa6400`, ``, ``);

export default function pluginEntry(config?: any) {
  const fileName = config?.fileContent?.name || config?.fileName || "MyBricksCode";

  return {
    name: '@mybricks/plugins/tocode',
    title: '出码',
    description: '出码',
    data: {},
    contributes: {
      sliderView: {
        tab: {
          title: '出码',
          icon: Icon,
          apiSet: ['project'],
          render: (plugin: any) => {
            if (!context.plugin) {
              context.plugin = plugin;
              context.config = {
                fileName,
              };
            }
            return React.createElement(Render, null);
          },
        },
      },
    },
  };
}