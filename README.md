# 급식알리미

내가 고른 캐릭터가 말풍선으로 오늘 급식을 알려주는 윈도우 PC 위젯입니다.

## 설치 방법

1. [최신 릴리스](https://github.com/gajaessam/hungry-widget/releases/latest)의 **Assets**에서 `geupsik-alimi-setup-버전.exe`를 내려받습니다. 다른 파일은 받지 않아도 됩니다.
2. 내려받은 파일을 실행합니다.
3. 파란색 **Windows의 PC 보호** 창이 뜨면 **추가 정보**를 누른 뒤 **실행**을 누릅니다.
4. 설치가 끝나면 설정 창에서 학교와 학년을 고릅니다.

파란 창은 개인이 만든 무료 앱이라 코드 서명 인증서가 없어서 나타나는 안내입니다. 앱은 고른 학교의 급식과 학사일정만 나이스에서 받아오며 개인정보를 수집하지 않습니다. Windows 전용이며 Mac과 휴대폰에서는 사용할 수 없습니다.

## 개발 실행

```bash
npm install
npm start
```

처음 켜면 설정 창이 열립니다. 학교를 검색해서 고르면 바로 급식이 나옵니다.

```bash
npm test
npm run dist
```

`npm test`는 로직 테스트, `npm run dist`는 `dist` 폴더에 설치 파일을 만드는 명령입니다.

## 사용법

- 캐릭터 클릭: 말 걸기
- 캐릭터 드래그: 위치 옮기기
- 캐릭터 우클릭 또는 트레이 아이콘 우클릭: 메뉴 열기 (설정, 사용 설명서 포함)
- 트레이 아이콘 클릭: 위젯 숨기기와 보이기
- 말풍선의 `‹ ›`: 일주일 치 식단 넘겨보기
- 메뉴에 마우스를 올린 뒤 ♥ 또는 ✕: 좋아하는 메뉴, 싫어하는 메뉴로 등록
- 설정의 학년: 내 학년의 시험과 쉬는 날을 대사로 안내
- 설정의 크기 슬라이더: 위젯 크기를 70~150%로 조절

## 데이터

- 식단은 [나이스 교육정보 개방 포털](https://open.neis.go.kr) Open API에서 받습니다. 인증키는 필요 없습니다.
- 설정, 식단, 캐릭터 이미지는 `%APPDATA%\급식알리미`에만 저장합니다. 이미지는 외부로 전송하지 않습니다.
- 알레르기 경고는 학교가 입력한 번호와 메뉴 이름을 기준으로 합니다. 경고가 없다고 안전하다는 뜻은 아닙니다.
- 프로그램에는 사용자의 이미지가 포함되지 않습니다. 기본 캐릭터는 이 프로젝트에서 직접 그린 것입니다.

## 배포

프로젝트가 한글 경로에 있으면 빌드가 시간 초과될 수 있으므로 출력 폴더를 영문 경로로 지정합니다. `package.json`의 버전을 올린 뒤 실행하세요.

```bash
npx electron-builder --win nsis --publish always --config.directories.output=C:/temp/geupsik-build
```

`--prepackaged`로 나눠서 빌드하면 자동 업데이트 설정 파일(`app-update.yml`)이 빠지므로 쓰지 마세요.

## 공유용 zip 만들기

설치 파일을 빌드해 `dist\버전` 폴더에 넣은 뒤 실행하면, 설치 안내 PDF와 설치 파일을 묶은 `dist\버전\geupsik-alimi-버전.zip`이 만들어집니다.

```bash
npm.cmd run share
```

설치 안내는 `docs/install-guide.html`을 고치면 됩니다. Windows의 PC 보호 창을 캡처해 `docs/images/smartscreen-1.png`(추가 정보 누르기 전), `docs/images/smartscreen-2.png`(실행 버튼이 보이는 화면)로 저장하면 예시 그림 대신 실제 캡처가 들어갑니다.
