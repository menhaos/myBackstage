import request from '@/utils/request';

//1.获取品牌管理分页列表  /admin/product/baseTrademark/{page}/{limit} get
export const reqTrademarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' });

//2.新增商品   /admin/product/baseTrademark/save  post 两个参数：1.tmName 商品名称 string  1.logoUrl 图片地址 string
export const reqSaveNewGoods = (data) => request({ url: '/admin/product/baseTrademark/save', method: 'post', data });

//3.修改商品   /admin/product/baseTrademark/update   put  一共三个参数 多带一个id参数
export const reqUpdateGoods = (data) => request({ url: '/admin/product/baseTrademark/update', method: 'put', data });

//4.删除商品   /admin/product/baseTrademark/remove/{id} delete
export const reqDeleteGoods = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' });