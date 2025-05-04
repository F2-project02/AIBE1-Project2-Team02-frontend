# 📦 Project Setup (React + Vite + JavaScript)

## 🚀 프로젝트 시작하기

### 1. 레포지토리 클론

```bash
git clone https://github.com/1000hyehyang/mentos-frontend.git
cd mentos-frontend
```

### 2. 패키지 설치

```bash
npm install
# 또는
yarn install
```

### 3. 환경변수 설정

프로젝트에는 `.env.development`, `.env.production` 파일이 필요합니다.

```bash
cp .env.example .env.development
```

`.env.development` 파일은 다음 예시를 참고해 수정하세요:

```env
# 🌍 현재 사용 중인 백엔드 서버 대상 선택: local 또는 prod
VITE_BACKEND_TARGET=local

# 🖥️ 로컬 Spring Boot 서버 주소
VITE_LOCAL_API_URL=http://localhost:8081

# ☁️ 배포된 Render 서버 주소
VITE_PROD_API_URL=https://mentoss.onrender.com
```

배포 환경에서는 `VITE_BACKEND_TARGET=prod`로 고정됩니다:

```env
# .env.production
VITE_BACKEND_TARGET=prod
VITE_PROD_API_URL=https://mentoss.onrender.com
```

> 💡 로컬에서 개발할 때 **`VITE_BACKEND_TARGET=local`** 또는 \*\*`prod`\*\*로 바꾸면
> Spring Boot 로컬 서버 혹은 Render 배포 서버에 요청을 자유롭게 보낼 수 있습니다.

---

### 4. 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

브라우저에서 [`http://localhost:5173`](http://localhost:5173)로 접속하여 프론트 개발 서버를 확인할 수 있습니다.


### 💡 주의 사항

| 상황                       | 해야 할 일                                          |
| ------------------------ | ----------------------------------------------- |
| 로컬 서버에 API 요청하고 싶을 때     | `.env.development`: `VITE_BACKEND_TARGET=local` |
| 배포된 Render 서버에 요청하고 싶을 때 | `.env.development`: `VITE_BACKEND_TARGET=prod`  |
| `.env` 변경 후              | 반드시 `npm run dev` 재시작                           |