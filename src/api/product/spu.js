import requests from '@/utils/request';

//请求Spu列表
export const reqSpulist = (page, limit, category3Id) => requests({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id } });

//请求Spu信息 描述 名称
export const reqSpu = (spuId) => requests({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' });

//请求Spu图标信息
export const reqSpuImagelist = (spuId) => requests({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' });

//请求品牌的信息
export const reqTradeMarkList = () => requests({ url: `/admin/product/baseTrademark/getTrademarkList`, method: 'get' });

//请求平台销售属性
export const reqBasesaleAttrList = () => requests({ url: '/admin/product/baseSaleAttrList', method: 'get' });

//新增spu或者 修改spu
export const reqSaveUpdateSpu = (spuInfo) => {
  //有id，为修改spu接口
  if (spuInfo.id) {
    return requests({ url: '/admin/product/updateSpuInfo', method: 'post', data: spuInfo });
  } else {
    //没有id，为新增spu
    return requests({ url: '/admin/product/saveSpuInfo', method: 'post', data: spuInfo });
  }
};

//删除spu
export const reqDeleteSpu = (spuId) => requests({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' });