---
name: git
description: 게임 프로젝트 Git 명령 (Unity / Cocos Creator 2.x / 3.x 자동 감지). "/git commit" — 변경사항 3분류 자동 커밋. "/git push" — 커밋 후 푸쉬. "커밋", "커밋해", "푸쉬해" 시에도 사용.
---

# Game Project Git

`/git commit` — 변경사항을 코드/UI 에셋/미디어 4분류로 자동 분류 커밋.
`/git push` — 분류 커밋 후 리모트 푸쉬.

지원 엔진: **Unity**, **Cocos Creator 2.x**, **Cocos Creator 3.x**

## Instructions

### STEP 0: 엔진 감지

프로젝트 루트에서 아래 순서로 엔진 판별 (첫 번째 매칭 시 확정, 이후 조건 검사 안 함):

| 우선순위 | 조건 | 엔진 |
|---------|------|------|
| 1 | `ProjectSettings/` 폴더 존재 | **Unity** → 확정 |
| 2 | `assets/` (소문자) + `package.json` 내 `"creator"` 버전 `>= 3.0` | **Cocos 3.x** → 확정 |
| 3 | `assets/` (소문자) + (`project.json` 존재 또는 `"creator"` 버전 `< 3.0`) | **Cocos 2.x** → 확정 |

감지 실패 시 사용자에게 엔진 확인 질문 후 진행.

감지 결과를 이후 단계에서 **{ENGINE}** 으로 참조.

---

### STEP 1: 변경사항 분석

아래 명령을 **병렬** 실행:

```bash
git status            # untracked + modified 파일 확인
git diff --stat       # 변경 통계
git diff              # 상세 변경 내용 (staged + unstaged)
git log --oneline -5  # 최근 커밋 메시지 스타일 참조
```

변경사항이 없으면: "변경사항이 없습니다." 출력 후 종료.

---

### STEP 2: 변경 분류

변경된 파일을 4가지 카테고리로 분류. **엔진별 분류 테이블 참조:**

모든 스테이징 패턴에 대응하는 `.meta` 파일도 함께 스테이징. (예: `*.cs` → `*.cs.meta` 도 추가)

#### Unity

| 분류 | 대상 확장자 | 스테이징 패턴 | 제외 |
|------|-----------|-------------|------|
| **코드** | `.cs` | `Assets/**/*.cs` + `.meta` | `VContainer/`, `Plugins/` |
| **UI 에셋** | `.prefab`, `.unity`, `.asset`, `.controller`, `.anim` | `Assets/**/*.prefab .unity .asset .controller .anim` + `.meta` | — |
| **이미지** | `.png`, `.jpg`, `.psd`, `.svg` | `Assets/**/*.png .jpg .psd .svg` + `.meta` | — |
| **오디오** | `.mp3`, `.ogg`, `.wav`, `.flac` | `Assets/**/*.mp3 .ogg .wav .flac` + `.meta` | — |

#### Cocos Creator 3.x

| 분류 | 대상 확장자 | 스테이징 패턴 | 제외 |
|------|-----------|-------------|------|
| **코드** | `.ts`, `.js` | `assets/**/*.ts .js` + `.meta` | `node_modules/`, `extensions/` |
| **UI 에셋** | `.prefab`, `.scene`, `.anim`, `.animation`, `.mtl`, `.effect`, `.material` | `assets/**/*.prefab .scene .anim .animation .mtl .effect .material` + `.meta` | — |
| **이미지** | `.png`, `.jpg`, `.psd`, `.svg`, `.webp` | `assets/**/*.png .jpg .psd .svg .webp` + `.meta` | — |
| **오디오** | `.mp3`, `.ogg`, `.wav`, `.flac` | `assets/**/*.mp3 .ogg .wav .flac` + `.meta` | — |

#### Cocos Creator 2.x

| 분류 | 대상 확장자 | 스테이징 패턴 | 제외 |
|------|-----------|-------------|------|
| **코드** | `.ts`, `.js` | `assets/**/*.ts .js` + `.meta` | `node_modules/`, `packages/` |
| **UI 에셋** | `.prefab`, `.fire`, `.anim`, `.atlas`, `.fnt`, `.bmfont` | `assets/**/*.prefab .fire .anim .atlas .fnt .bmfont` + `.meta` | — |
| **이미지** | `.png`, `.jpg`, `.psd`, `.svg`, `.webp` | `assets/**/*.png .jpg .psd .svg .webp` + `.meta` | — |
| **오디오** | `.mp3`, `.ogg`, `.wav`, `.flac` | `assets/**/*.mp3 .ogg .wav .flac` + `.meta` | — |

해당 카테고리에 변경 파일이 없으면 해당 커밋 건너뜀.

**주의**: `.meta` 파일은 해당 에셋과 같은 카테고리로 분류.
- 예: `UIManager.cs.meta` → 코드, `TestPopup.prefab.meta` → UI 에셋
- `.meta` 파일은 Unity/Cocos 모두 반드시 해당 에셋과 함께 커밋

---

### STEP 3: Prefix 결정

변경 내용을 분석하여 적절한 prefix 선택:

| Prefix | 사용 조건 |
|--------|----------|
| `feat` | 새 기능, 새 파일 추가, 기존 기능 확장 |
| `fix` | 버그 수정, 오류 수정, 동작 교정 |
| `refactor` | 동작 변경 없이 코드 구조 개선, 이름 변경, 정리 |
| `chore` | 설정 변경, 패키지 업데이트, 빌드 설정, 기타 잡무 |
| `build` | **빌드 전용** — 아래 "빌드 커밋" 섹션에서만 사용 |

**이 5개만 사용. 다른 prefix 금지. `build`는 빌드 커밋 시에만.**

---

### STEP 4: 커밋 메시지 작성

형식:
```
{prefix} : 간결한 설명 (한국어)
```

규칙:
- 콜론 앞뒤 공백 1칸
- 한국어로 간결하게 (최대 50자)
- 이전 커밋 메시지 스타일 참조
- 각 분류별로 별도 커밋 메시지

---

### STEP 5: 커밋 실행

{ENGINE}에 따라 에셋 루트(`Assets/` 또는 `assets/`)와 확장자가 달라짐.
해당하는 분류만 순서대로 커밋:

#### Unity 예시

```bash
# 1. 코드 변경 (있을 때만)
git add Assets/**/*.cs Assets/**/*.cs.meta \
        ":(exclude)Assets/VContainer/" ":(exclude)Assets/Plugins/"
git commit -m "$(cat <<'EOF'
feat : 간결한 설명

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"

# 2. UI 에셋 변경 (있을 때만)
git add Assets/**/*.prefab Assets/**/*.prefab.meta \
        Assets/**/*.unity Assets/**/*.unity.meta \
        Assets/**/*.asset Assets/**/*.asset.meta \
        Assets/**/*.controller Assets/**/*.controller.meta \
        Assets/**/*.anim Assets/**/*.anim.meta
git commit -m "$(cat <<'EOF'
feat : 간결한 설명

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"

# 3. 이미지 (있을 때만)
git add Assets/**/*.png Assets/**/*.png.meta \
        Assets/**/*.jpg Assets/**/*.jpg.meta \
        Assets/**/*.psd Assets/**/*.psd.meta \
        Assets/**/*.svg Assets/**/*.svg.meta
git commit -m "$(cat <<'EOF'
feat : 간결한 설명

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"

# 4. 오디오 (있을 때만)
git add Assets/**/*.mp3 Assets/**/*.mp3.meta \
        Assets/**/*.ogg Assets/**/*.ogg.meta \
        Assets/**/*.wav Assets/**/*.wav.meta \
        Assets/**/*.flac Assets/**/*.flac.meta
git commit -m "$(cat <<'EOF'
feat : 간결한 설명

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

#### Cocos 3.x 예시

```bash
# 1. 코드 변경 (있을 때만)
git add assets/**/*.ts assets/**/*.ts.meta \
        assets/**/*.js assets/**/*.js.meta \
        ":(exclude)node_modules/" ":(exclude)extensions/"
git commit -m "$(cat <<'EOF'
feat : 간결한 설명

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"

# 2. UI 에셋 변경 (있을 때만)
git add assets/**/*.prefab assets/**/*.prefab.meta \
        assets/**/*.scene assets/**/*.scene.meta \
        assets/**/*.anim assets/**/*.anim.meta \
        assets/**/*.animation assets/**/*.animation.meta \
        assets/**/*.mtl assets/**/*.mtl.meta \
        assets/**/*.effect assets/**/*.effect.meta \
        assets/**/*.material assets/**/*.material.meta
git commit -m "$(cat <<'EOF'
feat : 간결한 설명

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"

# 3. 이미지 (있을 때만)
git add assets/**/*.png assets/**/*.png.meta \
        assets/**/*.jpg assets/**/*.jpg.meta \
        assets/**/*.psd assets/**/*.psd.meta \
        assets/**/*.svg assets/**/*.svg.meta \
        assets/**/*.webp assets/**/*.webp.meta
git commit -m "$(cat <<'EOF'
feat : 간결한 설명

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"

# 4. 오디오 (있을 때만)
git add assets/**/*.mp3 assets/**/*.mp3.meta \
        assets/**/*.ogg assets/**/*.ogg.meta \
        assets/**/*.wav assets/**/*.wav.meta \
        assets/**/*.flac assets/**/*.flac.meta
git commit -m "$(cat <<'EOF'
feat : 간결한 설명

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

#### Cocos 2.x 예시

```bash
# 1. 코드 변경 (있을 때만)
git add assets/**/*.ts assets/**/*.ts.meta \
        assets/**/*.js assets/**/*.js.meta \
        ":(exclude)node_modules/" ":(exclude)packages/"
git commit -m "$(cat <<'EOF'
feat : 간결한 설명

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"

# 2. UI 에셋 변경 (있을 때만)
git add assets/**/*.prefab assets/**/*.prefab.meta \
        assets/**/*.fire assets/**/*.fire.meta \
        assets/**/*.anim assets/**/*.anim.meta \
        assets/**/*.atlas assets/**/*.atlas.meta \
        assets/**/*.fnt assets/**/*.fnt.meta \
        assets/**/*.bmfont assets/**/*.bmfont.meta
git commit -m "$(cat <<'EOF'
feat : 간결한 설명

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"

# 3. 이미지 (있을 때만)
git add assets/**/*.png assets/**/*.png.meta \
        assets/**/*.jpg assets/**/*.jpg.meta \
        assets/**/*.psd assets/**/*.psd.meta \
        assets/**/*.svg assets/**/*.svg.meta \
        assets/**/*.webp assets/**/*.webp.meta
git commit -m "$(cat <<'EOF'
feat : 간결한 설명

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"

# 4. 오디오 (있을 때만)
git add assets/**/*.mp3 assets/**/*.mp3.meta \
        assets/**/*.ogg assets/**/*.ogg.meta \
        assets/**/*.wav assets/**/*.wav.meta \
        assets/**/*.flac assets/**/*.flac.meta
git commit -m "$(cat <<'EOF'
feat : 간결한 설명

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

**제외 대상 폴더 파일이 변경된 경우**: chore prefix로 별도 커밋하거나 사용자에게 확인.

---

### STEP 6: 커밋 결과 확인

```bash
git status        # 남은 변경사항 확인
git log --oneline -5  # 방금 생성된 커밋 확인
```

결과 보고:
```
[엔진: {ENGINE}]
커밋 완료:
- [prefix] : 설명 (코드 N개 파일)
- [prefix] : 설명 (UI N개 파일)
- [prefix] : 설명 (이미지 N개 파일)
- [prefix] : 설명 (오디오 N개 파일)

남은 변경사항: 없음 / N개 파일
```

---

### STEP 7: 푸쉬

**`/git push` 또는 인자에 "push" 포함 시에만 실행.**
`/git commit`이면 이 단계 건너뜀.

```bash
git push -u origin $(git branch --show-current)
```

---

## 빌드 커밋 (특수)

사용자가 "빌드 커밋", "빌드"라고 한 경우:
- 3분류 무시, 모든 변경사항 하나로 커밋
- 버전 번호 필수 — 없으면 사용자에게 질문

```bash
git add -A
git commit -m "$(cat <<'EOF'
build : {버전}

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
git tag v{버전}
```

---

## 체크포인트 커밋 squash (agent-team 연동)

사용자가 "커밋해"라고 하면:

1. `git log --oneline`에서 `checkpoint :` 프리픽스 커밋 존재 여부 확인
2. **체크포인트 없으면**: squash 건너뜀 → 바로 STEP 1~6 실행 (일반 커밋)
3. **체크포인트 있으면**:
   - 시작점 찾기: `checkpoint :` 아닌 마지막 커밋
   - soft reset: `git reset --soft {시작점}`
   - 위 STEP 2~6 대로 3분류 정식 커밋

---

## 주의사항

- `.env`, `credentials`, 시크릿 파일은 커밋 금지 — 발견 시 사용자에게 경고
- `.meta` 파일은 반드시 해당 에셋과 함께 커밋 (Unity/Cocos 모두 필수)
- 커밋 전 `git diff --cached`로 스테이징 내용 최종 확인
- pre-commit hook 실패 시: 원인 분석 → 수정 → 새 커밋 (amend 금지)
- **Unity 전용**: `Address` 클래스 (자동 생성) 변경은 코드 커밋에 포함
- **Cocos 전용**: `library/`, `temp/`, `build/`, `local/` 폴더는 커밋 대상 아님 (`.gitignore` 확인)
