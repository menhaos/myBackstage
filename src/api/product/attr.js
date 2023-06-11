import requests from '@/utils/request';

//1.获取属性的一级分类 /admin/product/getCategory1 get
export const reqGetCategory1 = () => requests({ url: '/admin/product/getCategory1', method: 'get' });

//2.获取属性二级分类 /admin/product/getCategory2/(category1ld} get
export const reqGetCategory2 = (category1Id) => requests({ url: `/admin/product/getCategory2/${category1Id}`, method: 'get' });

//3.获取属性三级分类 /admin/product/getCategory3/(category2ld get
export const reqGetCategory3 = (category2Id) => requests({ url: `/admin/product/getCategory3/${category2Id}`, method: 'get' });

//4.获取属性展示列表
export const reqAttrList = (category1Id, category2Id, category3Id) => requests({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' });

//5.添加属性名 属性值的接口
export const reqAddAttr = (data) => requests({ url: '/admin/product/saveAttrInfo', method: 'post', data });

//6.删除相应属性分类
export const reqDelete = (id) => requests({ url: `/admin/product/deleteAttr/${id}`, method: 'delete' });

/* data {
    //属性名
    attrName: 'string',
    //属性值列表
    attrValueList: [
      {
        //标记属于哪个属性  与属性名的id值相同 新增属性标记为undefined
        attrId: 0,
        //标记属性值的标志  新增商品不用带
        id: 0
        //属性值的名字
        valueName: '',
      },
    ],
    //三级列表的id
    categoryId: 0,
    //三级列表数据
    categoryLevel: 3,
    //属性名的id 新增商品不用带
    id: 0,
} */