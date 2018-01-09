
let HID_____GLAG = 'HID_____GLAG'
let HTOKEN_____GLAG = 'HTOKEN_____GLAG'

export default {
  //设置uid  token
  setHead({Hid,Htoken}){
    local.set(HID_____GLAG,Hid);
    local.set(HTOKEN_____GLAG,Htoken);
  },
  getHead(){
    let Hid = local.get(HID_____GLAG);
    let Htoken = local.get(HTOKEN_____GLAG);
    if(!Hid || !Htoken){
      return null;
    }
    return {
      Hid,
      Htoken
    }
  },
  cleanHead(){
    local.del(HID_____GLAG);
    local.del(HTOKEN_____GLAG);
  }
}
