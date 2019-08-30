const defaultLocation = {
  lat: 0,
  lng: 0,
};

const defaultAcc = {
  x: 0,
  y: 0,
  z: 0,
};

const defaultGyro = {
  x: 0,
  y: 0,
  z: 0,
};


module.exports = {
  navTheme: 'dark', // theme for nav menu
  primaryColor: '#1890FF', // primary color of ant design
  layout: 'sidemenu', // nav menu position: sidemenu or topmenu
  contentWidth: 'Fluid', // layout of content: Fluid or Fixed, only works when layout is topmenu
  fixedHeader: true, // sticky header
  autoHideHeader: false, // auto hide header
  fixSiderbar: false, // sticky siderbar
  menu: {
    disableLocal: false,
  },
  title: 'Firefighter Finder',
  pwa: false,
  // Your custom iconfont Symbol script Url
  // eg：//at.alicdn.com/t/font_1039637_btcrd5co4w.js
  // 注意：如果需要图标多色，Iconfont 图标项目里要进行批量去色处理
  // Usage: https://github.com/ant-design/ant-design-pro/pull/3517
  iconfontUrl: '',
  defaultCenter: {
    lat: -3.745,
    lng: -38.523
  },
 defaultData: {
    image: '',
    name: '',
    age: 0,
    humidity: 0, 
    pressure: 0, 
    proximity: 0, 
    temperature: 0,
    timestamp: '',
    ppb: 0,
    rh: 0,
    acc: defaultAcc,
    gyro: defaultGyro,
    // timeDetail: '',
    location: defaultLocation,
  },
};
