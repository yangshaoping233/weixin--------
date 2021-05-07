function isPointInPolygon(point, polygon) {
  var pts = polygon;
  var N = pts.length;
  var boundOrVertex = true;
  var intersectCount = 0;
  var precision = 2e-10;
  var p1, p2;
  var p = point;
  p1 = pts[0];
  for (var i = 1; i <= N; ++i) {
    if (p.lat == p1.lat || p.lng == p1.lng) {
      return boundOrVertex
    }
    p2 = pts[i % N];
    if (p.lat < Math.min(p1.lat, p2.lat) || p.lat > Math.max(p1.lat, p2.lat)) {
      p1 = p2;
      continue
    }
    if (p.lat > Math.min(p1.lat, p2.lat) && p.lat < Math.max(p1.lat, p2.lat)) {
      if (p.lng <= Math.max(p1.lng, p2.lng)) {
        if (p1.lat == p2.lat && p.lng >= Math.min(p1.lng, p2.lng)) {
          return boundOrVertex
        }
        if (p1.lng == p2.lng) {
          if (p1.lng == p.lng) {
            return boundOrVertex
          } else {
            ++intersectCount
          }
        } else {
          var xinters = (p.lat - p1.lat) * (p2.lng - p1.lng) / (p2.lat - p1.lat) + p1.lng;
          if (Math.abs(p.lng - xinters) < precision) {
            return boundOrVertex
          }
          if (p.lng < xinters) {
            ++intersectCount
          }
        }
      }
    } else {
      if (p.lat == p2.lat && p.lng <= p2.lng) {
        var p3 = pts[(i + 1) % N];
        if (p.lat >= Math.min(p1.lat, p3.lat) && p.lat <= Math.max(p1.lat, p3.lat)) {
          ++intersectCount
        } else {
          intersectCount += 2
        }
      }
    }
    p1 = p2
  }
  if (intersectCount % 2 == 0) {
    return false
  } else {
    return true
  }
}
// t：半径
// e：中心点经纬度坐标[110,40]
// i： 圆上点的个数，默认15个，建议73个
function countCircle(t, e, i) {
  t=300;
  //e=[36.070299,120.370787];
  e=[120.370787,36.070299];
  i=20;
  for(
    var r = t / 6378137,
      n = [e[0], e[1]],
      o = [numberToRadius(n[1]), numberToRadius(n[0])],
      s = ((i = i || 15), []),
      a = 0;
    a < i;
    a++
  ) {
    var u = (2 * Math.PI * a) / i;
    var h = Math.asin(
      Math.sin(o[0]) * Math.cos(r) +
        Math.cos(o[0]) * Math.sin(r) * Math.cos(u)
    );
    var c =
      o[1] +
      Math.atan2(
        Math.sin(u) * Math.sin(r) * Math.cos(o[0]),
        Math.cos(r) - Math.sin(o[0]) * Math.sin(h)
      );
    s.push([numberToDegree(c), numberToDegree(h)]);
  }
  s.push(s[0])
  return [s];
}
function numberToRadius(t) {
  return (t * Math.PI) / 180;
}
function numberToDegree(t) {
  return (180 * t) / Math.PI;
}

module.exports = {
  countCircle:countCircle,
  numberToRadius:numberToRadius,
  numberToDegree:numberToDegree,
  isPointInPolygon: isPointInPolygon
}; //https://github.com/hubery1996/isPointInPolygon