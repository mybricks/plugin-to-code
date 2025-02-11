import JSzip from "jszip";
import prettier from "prettier";
import prettierPluginBabel from "prettier/plugins/babel";
import prettierPluginEstree from "prettier/plugins/estree";
import { toCode as toReactCode } from "@mybricks/to-code-react";

/** 首字母转换为大写 */
export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/** 特殊字符转下划线 */
export const convertToUnderscore = (str: string) => {
  return str.replace(/[^a-zA-Z0-9]/g, "_");
};

/** 根据namespace生成组件名 */
export const generateComponentNameByDef = ({ namespace, rtType }: any) => {
  const lastIndex = namespace.lastIndexOf(".");
  return convertToUnderscore(
    lastIndex !== -1 ? namespace.substring(lastIndex + 1) : namespace,
  )
    .split("_")
    .filter((str) => str)
    .reduce((p, c, index) => {
      return (
        p +
        (rtType?.match(/^js/)
          ? index
            ? capitalizeFirstLetter(c)
            : c
          : capitalizeFirstLetter(c))
      );
    }, "");
};

export const getNamespaceToMetaDataMap = () => {
  const namespaceToMetaDataMap: any = {};

  (window as any).__comlibs_edit_.forEach(({ id, namespace, comAray }: any) => {
    if (id && namespace) {
      traverseComAry(comAray, id);
    }
  })

  function traverseComAry(comAry: any, npm: any) {
    comAry.forEach((com: any) => {
      if (Array.isArray(com.comAray)) {
        traverseComAry(com.comAray, npm);
      } else {
        namespaceToMetaDataMap[com.namespace] = {
          npmPackageName: npm,
          defaultData: com.data || {},
        };
      }
    });
  }

  return namespaceToMetaDataMap;
}

export const toCode = async (toJSON: any) => {
  return new Promise<{path: string, content: string}[]>((resolve, reject) => {
    try {
      const namespaceToMetaDataMap: any = getNamespaceToMetaDataMap();
      const tsx = toReactCode(toJSON, {
        namespaceToMetaDataMap,
        splitModules: true
      });

      Promise.all((tsx as {path: string, content: string}[]).map(({ path, content }) => {
        return new Promise<{path: string, content: string }>((resolve, reject) => {
          const code = path === "index.tsx" ? `// 当前出码未支持能力：模块，插件能力，风格化，AI组件
        // 组件库依赖：react@18 react-dom@18 antd@4 moment@2 @ant-design/icons@4
        // 请先执行以下命令以安装组件库npm包
        // npm i @mybricks/comlib-basic@0.0.7-next.5 @mybricks/comlib-pc-normal@0.0.22-next.7 @mybricks/render-react-hoc@0.0.1-next.11
        
        ${content}` : content;
          
          prettier.format(code, {
            parser: 'babel-ts',
            semi: true,
            singleQuote: true,
            tabWidth: 2,
            plugins: [prettierPluginBabel, prettierPluginEstree]
          }).then((content) => {
            resolve({ path, content });
          }).catch((e) => {
            console.warn("prettier.format error => ", e);
            resolve({ path, content });
          });
        })
      })).then(resolve).catch(reject);

      // 单文件format
      // prettier.format(`
      //   // 当前出码未支持能力：模块，插件能力，风格化，AI组件
      //   // 组件库依赖：react@18 react-dom@18 antd@4 moment@2 @ant-design/icons@4
      //   // 请先执行以下命令以安装组件库npm包
      //   // npm i @mybricks/comlib-basic@0.0.7-next.5 @mybricks/comlib-pc-normal@0.0.22-next.7 @mybricks/render-react-hoc@0.0.1-next.11
      //   ${tsx}`, {
      //     parser: 'babel-ts',
      //     semi: true,
      //     singleQuote: true,
      //     tabWidth: 2,
      //     plugins: [prettierPluginBabel, prettierPluginEstree]
      //   }).then(resolve).catch(reject)
    } catch (e) {
      reject(e);
    }
  });
}

export function downloadToFile ({ content, name }: { content: any, name: string }) {
  // 添加文件到 ZIP
  const jszip = new JSzip();
  content.forEach(({ content, path }: any) => {
    jszip.file(path, content);
  })

  // 生成 ZIP 文件并触发下载
  jszip.generateAsync({ type: "blob" })
    .then(function (content) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = name;
      link.click();
    });
  // 下载单个文件
  // const eleLink = document.createElement('a')
  // eleLink.download = name
  // eleLink.style.display = 'none'

  // const blob = new Blob([content])

  // eleLink.href = URL.createObjectURL(blob)
  // document.body.appendChild(eleLink)
  // eleLink.click()
  // document.body.removeChild(eleLink)
}

export const safeParse = (str: any) => {
  try {
    return JSON.parse(str)
  } catch {
    return str
  }
}
