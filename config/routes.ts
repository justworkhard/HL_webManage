export default [
  {
    name: 'login',
    layout: false,
    path: '/user/login',
    hideInMenu: true,
    component: './user/login',
  },
  {
    path: '/account/updataPwd',
    hideInMenu: true,
    name: '修改密码',
    component: './account/updataPwd',
  },
  {
    path: '/',
    component: './home',
  },
  {
    name: '权限管理',
    icon: 'icon-quanxian1',
    path: '/AuthorityManagement',
    routes: [
      {
        name: '用户管理',
        icon: 'smile',
        path: '/authoritymanagement/usermanagement',
        component: './AuthorityManagement/UserManagement',
        access: 'normalRouteFilter',
      },
      {
        name: '角色管理',
        icon: 'smile',
        path: '/authoritymanagement/rolemanagement',
        access: 'normalRouteFilter',
        component: './AuthorityManagement/RoleManagement',
      },
      {
        name: '分组管理',
        icon: 'smile',
        access: 'normalRouteFilter',
        path: '/authoritymanagement/grouping',
        component: './AuthorityManagement/GroupingManagement',
      },
      {
        name: '菜单管理',
        icon: 'smile',
        access: 'normalRouteFilter',
        path: '/authoritymanagement/menu',
        component: './AuthorityManagement/MenuManagement',
      },
    ],
  },

  {
    component: './404',
  },
];
