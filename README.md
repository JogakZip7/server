# **🔉프로젝트 소개**

코드잇부스트 1기 2반 데모데이의 프로젝트 주제인 **조각집**으로, 사진 공유 방식의 커뮤니티 웹 서비스 입니다.

### ⭐제시된 요구사항과 차별화된 점

회원가입 및 로그인 기능을 추가하여 스크랩한 게시글 및 속한 그룹들을 한 눈에 볼 수 있도록 하였으며, 메인페이지를 따로 만들어 다른 그룹들의 공유 게시글들을 자유롭게 둘러볼 수 있는 커뮤니티의 기능을 강화하였습니다.

뱃지의 경우, 이미 누른 사람은 다시 누를 수 없도록 변경

로그인으로 비밀번호를 받는 절차를 간소화하는 등 사용자가 보다 편하게 사용할 수 있도록 설계하였습니다.

## 🚩페이지 및 기능 소개

- CRUD 기능
- 그룹.게시글.댓글 기능

### 메인

### 커뮤니티

### 게시글 상세

### 마이페이지

### 로그인

# **👩🏻‍💻** 팀원소개

| 추정은 | 김민하 | 최신원 | 이예진 |
| --- | --- | --- | --- |
| @forlyby | @kminaaaa | @Shinwon2001 | @veun00 |

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

→위에 README 작성 꿀팁처럼 **file-tree-generator**  설치한 다음 넣기

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
