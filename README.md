# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

# 환경 설정 가이드

현재 react project의 환경은 이렇습니다.

node : v18.20.5
nvm : 1.2.2
npm : 10.8.2

nvm : node 버전 관리 도구 - 설치된 여러개의 노드 버젼 중 원하는걸 골라 쓸 수 있도록 도와줌 

https://github.com/coreybutler/nvm-windows/releases  exe파일 다운받아 설치

npm : node 패키지 매니저 - npm 명령어를 이용하여 npm 서비스에 등록된 Node.js 로 작성된 패키지를 관리하는 프로그램

nvm 을 먼저 설치한 후 nvm install 18.20.5 → nvm use 18.20.5로 node와 npm 한꺼번에 설치 

https://velog.io/@ddusi/Linux-1  https://bogyum-uncle.tistory.com/103  참고


[사진첨부필요]
npm nvm node 버전
[사진첨부필요]
node 버전 두개중 nvm으로 18.20.5를 사용하도록 설정 + 라이브러리들 버전



### 프로젝트 실행 방법

: 터미널에서 

npm install 입력 → package.json에 설정된 필요한 라이브러리들을 npm을 통해 설치

설치 완료된 후

npm start 입력
[사진첨부필요]
[사진첨부필요]
처음 실행시 보이는 화면

패키지 풀어서 실행하는데 시간이 좀 걸리는듯하여 인내심을 가지고 기다리다보면 아래와 같은 화면이 나타납니다(개발 추가되면 화면은 변화될 수 있음)

[사진첨부필요]
[사진첨부필요]
두번째 실행 부터는 이런 식으로 바로 실행됩니다

