const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.userInfo.avatar,
  name: state => state.user.userInfo.name,
  routes: state => state.user.userInfo.routes,
  roles: state => state.user.userInfo.roles,
  buttons: state => state.user.userInfo.buttons,
};
export default getters;
