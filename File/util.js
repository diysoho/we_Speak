
/**
* 组件共通时把组件中的方法合并到页面中
* param
*		pageObj（第一个参数）：注册Page()函数时传入的object
*		compObjArr(后面的参数)：页面require的共通组件
**/
function registComp() {
  let pageObj = arguments[0];
  let length = arguments.length;
  for (let i = 1; i < length; i++) {
    let compObj = arguments[i];
    // for (let compKey in compObj) {
      // if (compKey == 'data') {
        // let data = compObj[compKey];
        // for(let dataKey in data) {
          // pageObj.data[dataKey] = data[dataKey];
        // }
      // } else {
        // pageObj[compKey] = compObj[compKey];
      // }
    // }
    for (let compKey in compObj) {
      if (typeof(compObj[compKey]) == 'object') {
        // 合并页面中的data
        let data = compObj[compKey];
        pageObj.data[compKey] = data;

      } else {
        // 合并页面中的方法
        pageObj[compKey] = compObj[compKey];
      }
    }
  }
}

function mapLinkToPage(url) {
  if (!url) {
    return undefined;
  }

  switch (true) {
      // 匹配page
    case (/\/index\/index\.html\?pid=(\d+)/i).test(url):
      const pid = url.match(/\/index\/index\.html\?pid=(\d+)/i)[1];
      console.log('page id is ' + pid);
      return { type: 'page', page: `/modules/page/index?pid=${pid}`, pid };
      break;

      // 匹配 product
    case (/\/goods\/details\.html\?gid=(\d+)/i).test(url):
      const gid = url.match(/\/goods\/details\.html\?gid=(\d+)/i)[1];
      console.log('product id is ' + gid);
      return { type: 'product', page: `/pages/products/show/show?id=${gid}` };

      // 匹配产品分类
    case (/\/goods\/lists\.html/i).test(url):
      const result = url.match(/\/goods\/lists\.html\?gtid=(\d+)/i);
      const gtid = result?result[1]:0;
      console.log('product cagegory id is ' + gtid);
      return { type: 'productCategory', page: `/modules/products/index?cid=${gtid}` };

      // 匹配资讯
    case (/\/article\/show\.html\?aid=(\d+)/i).test(url):
      const aid = url.match(/\/article\/show\.html\?aid=(\d+)/i)[1];
      console.log('news id is ' + aid);
      return { type: 'news', page: `/pages/articles/show/show?id=${aid}` };

      // 匹配资讯分类
    case (/\/article\/lists\.html/i).test(url):
      const aResult = url.match(/\/article\/lists\.html\?atid=(\d+)/i);
      const atid = aResult?aResult[1]:0;
      console.log('news category id is ' + atid);
      return { type: 'newsCategory', page: `/modules/articles/index?id=${atid}` };

    default:
      console.log("Didn't match");
      return undefined;
  }
}

function isFunction(obj) {
  return typeof obj === 'function';
}


export default {
  registComp,
  mapLinkToPage,
  isFunction,
}
