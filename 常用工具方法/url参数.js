/**
 * 给 url 增加指定的参数，如果 url 中有该参数则替换
 *
 * @param    {string}  url 要加参数的 url
 * @param    {string}  key 要增加的参数名
 * @param    {string}  val 要增加的参数值
 * @return   {string}      处理完的 url
 */
 function addUrlParam (url, key, val) {
  const newParam = key + '=' + encodeURIComponent(val)
  let params = '?' + newParam
  // If the 'url' string exists, then build params from it
  if (url) {
    // Try to replace an existance instance
    params = url.replace(
      new RegExp('([?&])' + key + '[^&]*'),
      '$1' + newParam
    )
    // If nothing was replaced, then add the new param to the end
    if (params === url && url.indexOf(newParam) < 0) {
      params += (url.indexOf('?') > 0 ? '&' : '?') + newParam
    }
  }
  return params
}

/**
 * 给 url 批量增加指定的参数，如果 url 中有该参数则替换
 *
 * @param    {string}  url 要加参数的 url
 * @param    {string}  params 要增加的参数对象
 * @return   {string}      处理完的 url
 */
function addUrlParams (url, params) {
  if (Object.keys(params).length === 0) {
    return url
  } else {
    for (var key in params) {
      url = this.addUrlParam(url, key, encodeURIComponent(params[key]))
      delete params[key]
      return this.addUrlParams(url, params)
    }
  }
}

/**
 * 获取 url 中的参数
 *
 * 输入页面地址，获取某一个指定参数的值
 *
 * @param    {string}  link 要获取参数的页面地址
 * @param    {string}  key  要获取的参数
 * @return   {string}       获取到参数的值
 */
 function getQueryString (link, key) {
  const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i')
  const queryString = link.split('?').length > 1 ? link.split('?')[1] : ''
  const r = queryString.match(reg)
  if (r !== null) return decodeURIComponent(r[2])
  return ''
}
