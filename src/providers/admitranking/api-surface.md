# AdmitRanking API Surface

中文说明：这份文档记录 `intlquals` 当前对 AdmitRanking 的 API 认知边界，方便后续 agent 与开发者快速判断：

- 当前 CLI 已接入哪些接口
- 哪些接口与国际学校研究强相关，但尚未接入
- 哪些接口更偏平台、账户、社区能力，当前不优先

说明：

- 本文档基于当前公开前端资源中可见的 `/mb/api/intl/...` 路径整理
- “已发现”不等于“已完整接入”
- 当前项目遵循 `one provider, one domain`

## A. 当前 CLI 已接入的核心接口

这 3 个接口就是当前 `intlquals` AdmitRanking provider 真正依赖的一级 raw data categories。

### 1. `GET /mb/api/intl/rank/getRankByType`

中文：获取榜单列表

当前用途：

- `iq rank admitranking list`

当前代码位置：

- [endpoints.ts](./endpoints.ts)
- [client.ts](./client.ts)
- [mapper.ts](./mapper.ts)

### 2. `POST /mb/api/intl/school/getComPageRankEnV2`

中文：获取某个榜单下的学校条目列表

当前用途：

- `iq rank admitranking show <rankId>` 的学校条目部分

当前代码位置：

- [endpoints.ts](./endpoints.ts)
- [client.ts](./client.ts)
- [mapper.ts](./mapper.ts)

### 3. `GET /mb/api/intl/school/getComDetailById`

中文：获取单个学校详情

当前用途：

- `iq rank admitranking school <schoolId>`

当前代码位置：

- [client.ts](./client.ts)
- [mapper.ts](./mapper.ts)

## B. 与当前产品方向强相关，但尚未接入的接口

这些接口仍然围绕国际学校、榜单、学校详情、评价和筛选，属于后续最值得研究的一层。

### Rank

- `/mb/api/intl/rank/getRankDetail`
  中文：获取单个榜单详情页信息
  备注：已确认存在，但当前 CLI 不再使用。因为当前 `show` 被定义为“看榜单内容”，榜单头信息直接来自 `getRankByType` 即可。

- `/mb/api/intl/rank/getSmallRankByComId`
  中文：按学校获取细分榜单/子榜单信息

### School

- `/mb/api/intl/school/getIntlSchoolPage`
  中文：国际学校分页列表
- `/mb/api/intl/school/getIntlSchoolKeywordDropdown`
  中文：学校关键词联想/下拉建议
- `/mb/api/intl/school/getOfferSchoolByRank`
  中文：学校录取相关榜单/结果信息
- `/mb/api/intl/school/getComClubList`
  中文：学校社团列表
- `/mb/api/intl/school/getComHighStatsList`
  中文：学校高阶统计信息
- `/mb/api/intl/school/getComLikeListTitle`
  中文：相似学校/相关推荐信息
- `/mb/api/intl/school/getGroupDetailById`
  中文：学校集团详情
- `/mb/api/intl/school/getGroupPage`
  中文：学校集团分页
- `/mb/api/intl/school/getStatComByYear`
  中文：按年份获取学校统计
- `/mb/api/intl/school/getStatPreComByYear`
  中文：按年份获取历史学校统计

### Review

- `/mb/api/intl/review/getExpertReviewListByComId`
  中文：学校专家评价列表
- `/mb/api/intl/review/getReviewListByComId`
  中文：学校普通评价列表
- `/mb/api/intl/review/getReviewStaticByComId`
  中文：学校评价统计
- `/mb/api/intl/review/getReviewTypeList`
  中文：评价类型列表
- `/mb/api/intl/review/pageReviewByCom`
  中文：学校评价分页
- `/mb/api/intl/review/saveReview`
  中文：提交评价

### Home / Options

- `/mb/api/intl/home/getSchoolOption`
  中文：学校筛选项
- `/mb/api/intl/home/getUserTypeOption`
  中文：用户类型筛选项
- `/mb/api/intl/home/expertList`
  中文：专家列表

### News / Event / Page

- `/mb/api/intl/news/getNewsList`
  中文：新闻列表
- `/mb/api/intl/news/getNewsDetail`
  中文：新闻详情
- `/mb/api/intl/event/GETEventList`
  中文：活动列表
- `/mb/api/intl/event/GETEventDetail`
  中文：活动详情
- `/mb/api/intl/event/GETEventListByComId`
  中文：学校活动列表
- `/mb/api/intl/event/GETEventOption`
  中文：活动筛选项
- `/mb/api/intl/event/eventApply`
  中文：活动报名
- `/mb/api/intl/event/eventGetIsApply`
  中文：查询活动报名状态
- `/mb/api/intl/page/getPage`
  中文：通用页面内容

## C. 平台/账户/社区类接口

这些接口说明 AdmitRanking 本身已经不是纯榜单站，而是一个带账户体系、收藏、关注、社区和消息功能的平台。

当前 `intlquals` 不以这些为优先。

### Favorites

- `/mb/api/intl/favorites/addFav`
- `/mb/api/intl/favorites/chkIsFav`
- `/mb/api/intl/favorites/delFav`
- `/mb/api/intl/favorites/getFavoriteList`
- `/mb/api/intl/favorites/getFavoriteTypeList`

中文：收藏相关

### Follow

- `/mb/api/intl/follow/addFollow`
- `/mb/api/intl/follow/cancelFollow`
- `/mb/api/intl/follow/chkIsFollow`
- `/mb/api/intl/follow/getFollowList`
- `/mb/api/intl/follow/getFollowTypeList`

中文：关注相关

### Msg

- `/mb/api/intl/msg/getMyTalkF2FList`
- `/mb/api/intl/msg/getMyTalkList`
- `/mb/api/intl/msg/getTalkMsgList`
- `/mb/api/intl/msg/getTalkMsgListByType`
- `/mb/api/intl/msg/getTalkMsgTypeList`
- `/mb/api/intl/msg/sendMsg`

中文：消息/私信相关

### Social Content

- `/mb/api/intl/social/content/GETIntlQaList`
- `/mb/api/intl/social/content/getContentListByIds`
- `/mb/api/intl/social/content/getContentReviewList`
- `/mb/api/intl/social/content/getDPSocialContentDetail`
- `/mb/api/intl/social/content/getHomeContent`
- `/mb/api/intl/social/content/getReviewToReviewList`
- `/mb/api/intl/social/content/getSocialContentDetail`
- `/mb/api/intl/social/content/getUserPostsList`
- `/mb/api/intl/social/content/saveContent`
- `/mb/api/intl/social/content/uploadFile`
- `/mb/api/intl/social/content/clickLikeContent?...`

中文：社区内容/问答/评论/点赞相关

### Social User

- `/mb/api/intl/social/user/GETMySocialVerifyList`
- `/mb/api/intl/social/user/GETVerifyOptions`
- `/mb/api/intl/social/user/SAVEVerify`
- `/mb/api/intl/social/user/getBadgeList`
- `/mb/api/intl/social/user/getPrivacySettingOption`
- `/mb/api/intl/social/user/getSocialMedalList`
- `/mb/api/intl/social/user/getUserCenter`
- `/mb/api/intl/social/user/getUserHomeMenu`
- `/mb/api/intl/social/user/getUserMedalList`
- `/mb/api/intl/social/user/savePrivacySetting`

中文：社区用户中心、认证、勋章、隐私设置相关

### User / Auth

- `/mb/api/intl/user2intl/LogoutUser`
- `/mb/api/intl/user2intl/bindByCode`
- `/mb/api/intl/user2intl/getAvatarList`
- `/mb/api/intl/user2intl/getCaptchaImage`
- `/mb/api/intl/user2intl/getCode`
- `/mb/api/intl/user2intl/login`
- `/mb/api/intl/user2intl/loginByCode`
- `/mb/api/intl/user2intl/loginByEmail`
- `/mb/api/intl/user2intl/register...`
- `/mb/api/intl/user2intl/registerByEmail`
- `/mb/api/intl/user2intl/resetPasswordByToken`
- `/mb/api/intl/user2intl/resetPwd`
- `/mb/api/intl/user2intl/sendResetPasswordLink`
- `/mb/api/intl/user2intl/updateUserInfo`
- `/mb/api/intl/user2intl/wxLogin`

中文：登录注册、验证码、找回密码、用户资料相关

### Commons

- `/mb/api/intl/commons/attachment/upload`

中文：附件上传

## 当前产品判断

如果只看 `intlquals` 当前 MVP，AdmitRanking 相关接口的优先级可以这样看：

- A 档：当前已接入且正在使用
- B 档：与国际学校研究强相关，下一批最值得研究
- C 档：站点平台能力，当前不是 CLI 重点

一句话总结：

AdmitRanking 远不止 4 个接口。  
但当前 `intlquals` 的 AdmitRanking provider，当前运行只依赖 A 档那 3 个核心接口。
