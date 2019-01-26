# day01
## 0. 准备
    项目描述: 做什么/特点/功能模块/主要技术/开发方式
    技术选型: 分方向详细技术
    API接口: 理解/ 接口文档/对接口

## 1. 创建项目, 并运行
	create-react-app react-admin
	npm start

## 2. 对项目进行git版本控制
	创建本地仓库
	创建远程仓库
	将本地仓库推送到远程
	创建dev分支并推送到远程
	克隆远程分支, 并创建本地dev分支

## 3. 设计源码的基本目录, 实现App基本组件效果
	assets	
	api
	components
	pages
	App.js
	index.js

## 4. 引入antd, 实现按需打包和自定义主题
	下载antd和相关的工具包
	配置1: config-overrides.js
	配置2: package.json

## 5. 引入react-router-dom, 实现基本的一级路由
	<BrowserRouter>/<HashRouter>
	<Switch>
	<Route>
	login/admin

## 6. 登陆的基本静态界面
	<Form>
	<Form.Item>
	<Input>
	<Icon>
	<Button>

## 7. 登陆的表单验证和数据收集
	配置对象: 属性名是一些特定的名称的对象
	验证需求:
		用户名: 长度>=4的字符串
		密码: 长度在4-8位的字符串
	包装Form组件: Form.create()(LoginForm)
		操作表单项(Field)数据
		对表达项数据进行实时验证
	form对象:
		this.props.form: 得到form对象
		getFieldDecorator(fieldName, options)(<Input/>): 包装Input组件
		resetFields(): 重置所有输入框
	表单验证方式:
		纯声明式验证
		半编程式验证
		
# day02

## 1. server应用
    理解前后台分离
    启动应用
    使用postman测试接口
    
## 2. ajax请求函数模块
	内部封装axios
    函数的返回值为promise对象
    目标:
      1. 请求错误统一处理
      2. 异步返回的是data, 而不是response
    解决: 
      自定义promsie对象
      在catch回调中: 不调用reject(), 而是显示提示
      在then回调中:  resolve(response.data)
      
## 3. 封装接口请求函数模块
    对ajax模块进一步封装, 让发请求的调用代码更简洁
    函数返回的是promise对象
    根据接口文档定义接口请求函数
    
## 4. 代理
    1). 是什么?
       具有特定功能的程序
    2). 运行在哪?
       前台应用端
       只能在开发时使用
    3). 作用?
        解决开发时的ajax请求跨域问题
        监视并拦截请求(3000)
        转发请求(4000)
    4). 配置代理
       告诉代理服务器一些信息: 转发的目标地址
       
## 5. 实现登陆功能
    调用接口请求函数请求登陆
    使用store库保存user到local中
    将user保存到内存中
    实现用户登陆检查/自动登陆
    
## 6. 搭建管理界面的整体结构
    LeftNav
    Header
    Footer
    多个切换显示的路由组件
        Home
        Category
        Product
        User
        Role
        Bar
        Line
        Pie

## 7. 左侧导航
    导航相关数据的配置
    根据导航配置动态渲染导航界面
        Menu/SubMenu/Item/Icon
        函数递归调用/reduce()    

# day03

## 1. Header

    1). 界面布局: Row / Col
	2). 时间动态显示: sysTime + setInterval()
	3). 天气: 天气接口 + jsonp
	4). 显示当前用户
	5). 退出登陆
	6). 显示当前导航页面的名称

## 2. 分类管理
### 功能
	1). 显示一级分类列表
	2). 显示二级分类列表
	3). 添加分类(一级/二级)
	4). 修改分类名称

### 请求后台接口
	1). 获取分类列表
	2). 添加分类
	3). 修改分类名称

### 界面
    antd组件: Table/Card/Button/Icon
    前台分页
    
### 显示一级分类列表
    状态: categorys
    调用接口请求函数获取一级分类列表并更新状态

### 添加一级分类
    antd组件: Modal/Form/Select/Input/message
    子组件向父组件通信: 函数属性
    添加分类接口函数的异步调用与处理
    

# day 04

## 1. 修改分类的名称
    antd组件: Modal/Form/Input
    调用更新分类的接口请求函数
    
## 2. 查看/添加/更新二级分类
    设计标识状态: subCategorys/parentId/parentName
    根据parentId状态获取相应的分类列表(一级/二级)
    根据parentId显示一级或二级列表
    在setState()真正更新状态后处理
    添加完分类后, 获取指定parentId的分类列表
    
## 3. 商品管理
 
### 路由
    product.jsx
        index: 商品管理的主页面
        add-update: 商品添加/更新
        detail: 商品详情

### index
    1). 界面
        antd: Card/Select/Input/Button/Icon/Table
    2). 分页:
        前台分页: 
            一性获取所有数据, 在浏览器端在显示分页效果, 
            切换页码时不再请求后台
        后台分页: 
            每次只获取当前页的数据, 一般需要指定pageNum/pageSize参数
            切换页码时, 需要再请求获取对应页的数据
        如何选择?
            数据数量特别多时用后台分页, 不太多时用前台分页
    3). 一般分页/搜索分页
        定义2个接口请求函数
        搜索条件的状态: searchType/searchName, 实时收集数据
        判断当前需要请求哪个接口

# day 05
## 商品分类数据管理
    1. 二级分类联动列表的初始显示
    2. 二级分类联动列表的更新显示
    3. 收集分类数据到商品对象中

## 商品图片管理
    1. antd组件: Upload
    2. 已上传图片列表的初始显示
    3. 上传图片
    4. 删除已上传的图片
    5. 收集上传的图片数据

## 商品详情界面数据管理
    1. 使用富文本编程器react插件库
    2. 商品详情的初始显示
    3. 收集输入的详情html数据

## 商品的添加和更新
    1. 区别添加/更新
        this.props.history.push(path, product): 路由路由并携带数据
        this.props.location.state: 读取携带的数据
    2. 请求后台实现添加/更新功能

# day 06
    1. 商品上架与下架
        根据商品的status做对应显示
        点击按钮, 发送更新商品状态的请求
    2. 商品详情界面
        跳转路由, 携带product数据显示
        根据商品的pCategoryId和categoryId请求获取分类名称: Promise.all()
        解析html标签文本显示

# day07
## 1. 角色管理
    1. 显示所有角色列表
    2. 添加角色
    3. 给角色授权
        通过递归实现所有权限菜单树状显示
    4. 关于Component与PureComponent, setState()与shouldComponentUpdate()
        Component:
          shouldComponentUpdate()返回值总是true, 只要setState()就导致重新render(即使数据没有变化)
          重写shouldComponentUpdate(), 判断state和props中的数据是否发生改变, 如果没有变化返回false, 否则返回true
        PureComponent:
          重写shouldComponentUpdate(), 对组件状态/属性数据进行改变的判断, 如果没有变化返回false, 否则返回true
          如果直接修改state中的数据, 再调用setState()更新, 不会重新渲染(有问题)
              原因: 状态数据变量的值没有变, shouldComponentUpdate()的返回值是false
              解决: 生成一个状态数据拷贝数据, 更新拷贝的数据, 再调用setState(), shouldComponentUpdate()的返回值是true
## 2. 用户管理
    1. 显示用户列表
        使用对象容器避免数组的遍历查找


## 内存
    const a = {}
    a.xxx = {}
    
    const persons = [{m: 1}]
    
    /*
    const a = {}
    const b = []
    const c = function (){}
    a.d = {}
    
    a = b
    一个对象自身中不可能有另一个对象, 每个对象都有单独的内存空间
    变量的赋值(a = b): 拷贝右边变量的值保存到左边的变量
    对象的赋值(a = {}): 将对象的地址拷贝保存到左边的变量
    一个变量本身是不能存储一个对象, 保存的只可能是对象的地址值
    
    const arr = [{m: 1}]
    */
    
# day08

## 1. 用户管理
    1. 添加
    2. 更新
    3. 删除
    
## 2. 菜单导航的权限控制
    导航菜单项显示的条件判断
    1). 菜单项声明为公开的
    2). 当前登陆用户是admin
    3). 当前item的key在当前用户的权限菜单key数组(menus)中
    4). 如果有子菜单项, 只要有一个子菜单项的key在当前用户的权限菜单key数组中, 那当前菜单也需要显示
    
## 3. 数据可视化: echarts
    理解: 将多个数据以图形图表的形式展现
    常用库(JS): 
        echarts(百度开源)
        AntV(阿里开源)
        d3(国外开源)
    react中使用echarts
        echarts-for-react
        参考官网例子编写
        
