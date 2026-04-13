---
name: git
description: Unity 프로젝트 전용 Git 명령. "/git commit" — 변경사항 3분류 자동 커밋. "/git push" — 커밋 후 푸쉬. "커밋", "커밋해", "푸쉬해" 시에도 사용.
---

# Unity Project Git

`/git commit` — 변경사항을 코드/UI/이미지 3분류로 자동 분류 커밋.
`/git push` — 3분류 커밋 후 리모트 푸쉬.

## Instructions

### STEP 1: 변경사항 분석

아래 명령을 **병렬** 실행:

```bash
git status            # untracked + modified 파일 확인
git diff --stat       # 변경 통계
git diff              # 상세 변경 내용 (staged + unstaged)
git log --oneline -5  # 최근 커밋 메시지 스타일 참조
```

변경사항이 없으면: "변경사항이 없습니다." 출력 후 종료.

### STEP 2: 변경 분류

변경된 파일을 3가지 카테고리로 분류:

| 분류 | 대상 확장자 | 스테이징 패턴 |
|------|-----------|-------------|
| **코드** | `.cs` | `Assets/**/*.cs` (VContainer/, Plugins/ 제외) |
| **UI 에셋** | `.prefab`, `.unity`, `.asset`, `.controller`, `.anim` | `Assets/**/*.prefab Assets/**/*.unity Assets/**/*.asset` |
| **이미지** | `.png`, `.jpg`, `.psd`, `.svg` | `Assets/**/*.png Assets/**/*.jpg` |

해당 카테고리에 변경 파일이 없으면 해당 커밋 건너뜀.

**주의**: `.meta` 파일은 해당 에셋과 같은 카테고리로 분류. 예: `UIManager.cs.meta` → 코드, `TestPopup.prefab.meta` → UI 에셋.

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

### STEP 5: 커밋 실행

해당하는 분류만 순서대로 커밋:

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

# 3. 이미지 추가 (있을 때만)
git add Assets/**/*.png Assets/**/*.png.meta \
        Assets/**/*.jpg Assets/**/*.jpg.meta \
        Assets/**/*.psd Assets/**/*.psd.meta \
        Assets/**/*.svg Assets/**/*.svg.meta
git commit -m "$(cat <<'EOF'
feat : 간결한 설명

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

**VContainer/, Plugins/ 하위 파일은 커밋 대상에서 제외** (vendored/third-party).
제외 대상이 변경된 경우: chore prefix로 별도 커밋하거나 사용자에게 확인.

### STEP 6: 커밋 결과 확인

```bash
git status        # 남은 변경사항 확인
git log --oneline -5  # 방금 생성된 커밋 확인
```

결과 보고:
```
커밋 완료:
- [prefix] : 설명 (코드 N개 파일)
- [prefix] : 설명 (UI N개 파일)
- [prefix] : 설명 (이미지 N개 파일)

남은 변경사항: 없음 / N개 파일
```

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
- `Address` 클래스 (자동 생성) 변경은 코드 커밋에 포함
- `.meta` 파일은 반드시 해당 에셋과 함께 커밋 (Unity 필수)
- 커밋 전 `git diff --cached`로 스테이징 내용 최종 확인
- pre-commit hook 실패 시: 원인 분석 → 수정 → 새 커밋 (amend 금지)
