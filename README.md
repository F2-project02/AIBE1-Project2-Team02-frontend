# 📦 Project Setup (React + Vite + JavaScript)


## 🚀 프로젝트 시작하기

### 1. 레포지토리 클론

```bash
git clone https://github.com/1000hyehyang/mentoss-frontend.git
cd your-repo-name
```

### 2. 패키지 설치

```bash
npm install
# 또는
yarn install
```

### 3. 환경변수 설정

프로젝트에는 `.env` 파일이 필요합니다.

```bash
cp .env.example .env
```

`.env` 파일의 값은 팀에서 공유한 정보를 기반으로 수정하세요.

> 예시:

```env
# .env
VITE_SECRET_API_KEY=your-secret-api-key
```

### 4. 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

브라우저에서 [`http://localhost:5173`](http://localhost:5173)로 접속하면 로컬 개발 서버를 확인할 수 있습니다.
