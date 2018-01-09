import apiList from './http';
import ajax from './ajax';
// http:

/**
 * gameApi  所有的api集合
 * */
const gameApi = {};

apiList.forEach((item,index)=>{
  let {url,use} = item;
  url = url.replace(/\s/g,'');
  let urlName = url.split('/').pop();
  if(url){
    url = url.replace(/^\/zzb-dream/,'');
    let sendUrl = `${DOMIN}${url}`;
    gameApi[urlName] = {
      send(params={},congig = {}){
        return ajax({
          url : sendUrl,
          use
        },{
          params,
          congig
        })
      },
      url : sendUrl
    }
  }

})


export default gameApi;
