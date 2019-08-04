# pure-nav

> 无需后台的全静态前端导航网站

[PureNav](https://github.com/WaveF/pure-nav/) 灵感来源于 [WebStack](https://github.com/WebStackPage/WebStackPage.github.io)，目标是制作一款全静态前端导航网站，与之不同的是 PureNav 还包括了在线编辑功能且无需任何后台技术支撑。

## 预览地址

[http://wavef.cn/pure-nav/](http://wavef.cn/pure-nav/)


## 数据存储

用户需自行到 [JSONBIN.IO](https://jsonbin.io) 注册并使用其提供的在线存取JSON服务充当数据库，注册后新建一个私有JSON，以后凭SECRET_KEY对前台数据进行增删查改。

PURENAV 基于VUEJS非编译方式构建，旨在使用较少的库进行开发，PURE（纯净）取意于此，目前仍处于开发当中...

### 未完成：

- 从JSONBIN存取数据（AXIOS）
- 前台增删查改功能（SweetAlert 或 dat.GUI 或其他）

### 有BUG：

- 展开/折叠菜单
- 自适应