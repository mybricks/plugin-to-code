import Icon from "./Icon";
import Render from "./Render";
import { safeParse } from "./utils";

console.log(`%c ${safeParse(NPM_NAME)} %c@${safeParse(NPM_VERSION)}`, `color:#FFF;background:#fa6400`, ``, ``);

export default function pluginEntry(config?: any) {
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
          render: Render,
        },
      },
    },
  };
}