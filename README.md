# **🔉프로젝트 소개**

코드잇부스트 1기 2반 데모데이의 프로젝트 주제인 **조각집**으로, 사진 공유 방식의 커뮤니티 웹 서비스 입니다.
http://jogakzip7.s3-website-us-east-1.amazonaws.com/

사이트에 접속하여 가입 후 그룹을 생성해 추억을 저장할 게시글을 작성할 수 있습니다.

원하는 사람끼리 사진과 내용을 공유하거나 많은 사람들에게 추억을 자랑할 수도 있습니다.

그 외에도 댓글, 스크랩, 공감하기 등등 부가적인 기능을 제공합니다.


### ⭐제시된 요구사항과 차별화된 점

회원가입 및 로그인 기능을 추가하여 스크랩한 게시글 및 속한 그룹들을 한 눈에 볼 수 있도록 하였으며, 메인페이지를 따로 만들어 다른 그룹들의 공유 게시글들을 자유롭게 둘러볼 수 있는 커뮤니티의 기능을 강화하였습니다.

뱃지의 경우, 이미 누른 사람은 다시 누를 수 없도록 변경

로그인으로 비밀번호를 받는 절차를 간소화하는 등 사용자가 보다 편하게 사용할 수 있도록 설계하였습니다.


## 🚩페이지 및 기능 소개

- CRUD 기능
- 그룹.게시글.댓글 기능
- 유저 로그인 기능 (유저가 스크랩 한 게시글, 참여 그룹 보기)
  

### 메인

여러 그룹을 보여줍니다. 유저는 다양한 그룹을 둘러보며 원하는 그룹에 참여할 수 있습니다.

### 커뮤니티

유저는 그룹을 생성하거나 가입하여 그룹에 게시글을 작성하거나, 다른 사람의 게시글에 댓글을 달 수 있습니다.

### 게시글 상세

그룹 내 쓰여진 게시글의 상세 내용을 이미지 파일과 함께 확인 할 수 있습니다.
자신의 게시글을 공개, 비공개 할 수 있습니다.

### 마이페이지

마이페이지에서 유저가 스크랩 한 게시글을 모아보거나, 유저가 참여한 그룹의 목록을 볼 수 있습니다.

### 로그인

유저가 회원가입 후 로그인 하여 고유 데이터(작성 글, 댓글 등)를 관리할 수 있습니다.


# **👩🏻‍💻** 팀원소개

| 추정은 | 김민하 | 최신원 | 이예진 |
| --- | --- | --- | --- |
| @forlyby | @kminnaaa | @Shinwon2001 | @veun00 |


# **🛠** 기술 스택

### **백엔드**

<p>
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
<img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=Express&logoColor=white">
<img src="[https://img.shields.io/badge/JWT-FFB400?style=for-the-badge&logo=JSON Web Tokens&logoColor=white](https://img.shields.io/badge/JWT-FFB400?style=for-the-badge&logo=JSON%20Web%20Tokens&logoColor=white)">
<img src="https://img.shields.io/badge/bcryptjs-4A90E2?style=for-the-badge&logo=Lock&logoColor=white">
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white">
<img src="https://img.shields.io/badge/dotenv-ECD53F?style=for-the-badge&logo=dotenv&logoColor=white">
<img src="https://img.shields.io/badge/CORS-FF6F00?style=for-the-badge&logo=internetexplorer&logoColor=white">
</p>


🖥️ 배포 및 호스트

<p>
  <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=Render&logoColor=white">
  <img src="https://img.shields.io/badge/aiven-DB0110?style=for-the-badge&logo=aiven&logoColor=white">
</p>


🧪개발 및 테스트 도구

<p>
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white">
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white">
  <img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white">
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=ESLint&logoColor=white">
  <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=Prettier&logoColor=white">
</p>


# **📂** 폴더 구조


```
📦middleware 
 ┗ 📜auth.js
📦src
 ┣ 📂routes
 ┃ ┣ 📂comment
 ┃ ┃ ┣ 📜createComment.js
 ┃ ┃ ┣ 📜deleteComment.js
 ┃ ┃ ┣ 📜readComment.js
 ┃ ┃ ┗ 📜updateComment.js
 ┃ ┣ 📂group
 ┃ ┃ ┣ 📜createGroup.js
 ┃ ┃ ┣ 📜deleteGroup.js
 ┃ ┃ ┣ 📜detailGroup.js
 ┃ ┃ ┣ 📜joinGroup.js
 ┃ ┃ ┣ 📜leaveGroup.js
 ┃ ┃ ┣ 📜readGroup.js
 ┃ ┃ ┗ 📜updateGroup.js
 ┃ ┣ 📂image
 ┃ ┃ ┗ 📜uploadImage.js
 ┃ ┣ 📂post
 ┃ ┃ ┣ 📜createPost.js
 ┃ ┃ ┣ 📜deletePost.js
 ┃ ┃ ┣ 📜detailPost.js
 ┃ ┃ ┣ 📜likePost.js
 ┃ ┃ ┣ 📜readPost.js
 ┃ ┃ ┣ 📜scrapPost.js
 ┃ ┃ ┗ 📜updatePost.js
 ┃ ┗ 📂user
 ┃ ┃ ┣ 📜deleteUser.js
 ┃ ┃ ┣ 📜myGroups.js
 ┃ ┃ ┣ 📜myScraps.js
 ┃ ┃ ┣ 📜signIn.js
 ┃ ┃ ┣ 📜signOut.js
 ┃ ┃ ┗ 📜signUp.js
 ┗ 📜index.js
```
