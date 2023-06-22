import requests from '@/utils/request';

//spu中的sku相关接口

//1.获取sku图片列表  与spu中接口重复
export const reqSpuImagelist = (spuId) => requests({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' });

//2.请求销售销售属性
export const reqBasesaleAttrList = (spuId) => requests({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' });

//3.获取平台属性列表  与attr中接口重复
export const reqAttrList = (category1Id, category2Id, category3Id) => requests({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' });

//4.发起请求添加sku
export const reqAddSku = (skuInfo) => requests({ url: '/admin/product/saveSkuInfo', method: 'post', data: skuInfo });

//5.展示sku列表
export const reqSkuInfo = (spuId) => requests({ url: `/admin/product/findBySpuId/${spuId}`, method: 'get' });

//sku中的接口

//1.请求sku列表
export const reqSkuList = (page, limit) => requests({ url: `/admin/product/list/${page}/${limit}`, method: 'get' });

//2.上架sku
export const reqsale = (skuId) => requests({ url: `/admin/product/onSale/${skuId}`, method: 'get' });

//3.下架sku
export const reqCancel = (skuId) => requests({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' });

//4.获得sku详情
export const reqSkuById = (skuId) => requests({ url: `/admin/product/getSkuById/${skuId}`, method: 'get' });

//5.删除sku
export const reqDeleteSku = (skuId) => requests({ url: `/admin/product/deleteSku/${skuId}`, method: 'delete' });