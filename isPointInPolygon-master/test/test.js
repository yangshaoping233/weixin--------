
import {
  isPointInPolygon,countCircle,numberToRadius,numberToDegree
} from '../utils/isPointInPolygon.js';
let newPoint = {
  // latitude: 80.47951,
  // longitude: 118.08948
  latitude: 36.070553,
  longitude: 120.372574,
};
Page({
    data: {
      latitude: newPoint.latitude,
      longitude: newPoint.longitude,
      markers: [],
      polygons: [],
      paramspolygones: [],

    },
    tapHandle() {
      //模拟定位点是否在围栏内
      if (!this.data.polygons.length) {
        return wx.showToast({
          title: '当前没有设置围栏',
          icon: 'none',
          mask: true
        })
      }
      let array = this.data.polygons[0].points;
      let newArray = [];
      for (let j = 0; j < array.length; j++) {
        let obj = {};
        obj.lng = array[j].longitude;
        obj.lat = array[j].latitude;
        newArray.push(obj)
      }
      this.setData({
        paramspolygones: newArray
      })
      let nowPoint = {};
      nowPoint.lat = newPoint.latitude
      nowPoint.lng = newPoint.longitude
      //true表示在围栏内反之围栏外
      let flag = isPointInPolygon(nowPoint, newArray);
      wx.showToast({
        title: flag?'正常：在围栏里面':'异常：在围栏外面',
        icon:'none'
      })
    },
    creatPolygons() { 
      //创建多边形围栏/服务范围
      if (this.data.markers.length < 3){
        debugger
        return wx.showToast({
          title: '请先在地图上标记点,且不少于三个点',
          icon:'none'
        })
      }
      let polygons = this.data.polygons;
      let markers = this.data.markers;
      let newArray = [];
      let params = {
        fillColor: "#1791fc66",
        strokeColor: "#FFF",
        strokeWidth: 2,
        zIndex: 3
      }
      for (let j = 0; j < markers.length; j++) {
        let obj = {
          latitude: markers[j].latitude,
          longitude: markers[j].longitude
        };
        newArray.push(obj);
      }
      polygons[0] = {};
      polygons[0].points = newArray;
      newArray = Object.assign(polygons[0], params);
      this.setData({
        "polygons[0]": newArray
      })
    },
    //画圆
    creatCircle() {
      var array=countCircle('','','');
      var jsons=[]
      array[0].forEach(element => {
        var json={};
        json.latitude=element[1]
        json.longitude=element[0]
        console.log('>>>>>>>>>>json>>>>'+JSON.stringify(json))
       // debugger
       jsons.push(json);
      });
       //this.data.markers=jsons
       debugger
 
       let polygons = this.data.polygons;
       let markers = this.data.markers;
       let newArray = [];
       let params = {
         fillColor: "#1791fc66",
         strokeColor: "#FFF",
         strokeWidth: 2,
         zIndex: 3
       }
       
       polygons[0] = {};
       polygons[0].points = jsons;//newArray;
       newArray = Object.assign(polygons[0], params);
       this.setData({
         "polygons[0]": newArray
       })
       var test={detail:{latitude:'',longitude:''}}
       test.detail.latitude=36.070400410816774 
       test.detail.longitude=120.37033081054688
       this.bindtapMap(test)

       var t2={detail:{latitude:'',longitude:''}}
       t2.detail.latitude=36.071400410816774 
       t2.detail.longitude=120.37033081054688
       this.bindtapMap(t2)
     },
    bindtapMap(e) {
      //创建标记点
      let tapPoint = e.detail;
      debugger
      let markers = this.data.markers
      let newContent = markers.length
      let markerItem = {
        callout: {
          content: ++newContent,
          padding: 5,
          borderRadius: 2,
          // bgColor:'#ffffff96',
          bgColor: '#ffffff',
          display: 'ALWAYS',
          anchorY: -15,
          anchorX: 15,
          zIndex: 2
        },
        id: newContent,
        latitude: null,
        longitude: null,
        iconPath: '/images/Marker1_Activated@3x.png',
        width: '34px',
        height: '34px',
        rotate: 0,
        alpha: 1,
        zIndex: 3
      }
      markerItem.latitude = tapPoint.latitude;
      markerItem.longitude = tapPoint.longitude;
      markers.push(markerItem)
      console.log('markerItem>>>'+JSON.stringify(markerItem))
      this.setData({
        markers
      })
    },
    removeMarker(e) {
      //删除重复点击的标记点
      console.log(e.markerId)
      let markers = this.data.markers;
      markers.splice(e.markerId - 1, 1)
      console.log(markers);
      //重置marker数组的id和content
      for (let j = 0; j < markers.length; j++) {
        markers[j].id = j + 1;
        markers[j].callout.content = j + 1;
      }
      this.setData({
        markers
      })
    },
    removePolygons() {
      //删除围栏和标记
      this.setData({
        markers: [],
        polygons: []
      })
    },
    onLoad(options) {
      this.creatCircle()
    }, 

  }

)