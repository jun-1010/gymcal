import { useEffect, useRef, useState } from "react";
import { ElementStatus, getElementStatusName } from "../../utilities/Type";
import CloseIcon from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import CheckIcon from "@mui/icons-material/Check";
import { calculateTotalScore, RoutineElement } from "../../utilities/RoutineUtil";
import { strenghTypes } from "../../utilities/RoutineSRUtil";

interface HintProps {
  hintNum: number;
  setHintNum: React.Dispatch<React.SetStateAction<number>>;
  setDisplayMode: React.Dispatch<React.SetStateAction<number>>;
  isMobile: boolean;
  setDetailOpens: React.Dispatch<React.SetStateAction<number[]>>;
  routine: RoutineElement[];
}

const Hint = ({ hintNum, setHintNum, setDisplayMode, isMobile, setDetailOpens, routine }: HintProps) => {
  const visibleTime = 4000; // Hint表示時間
  const hintModalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (hintModalRef.current && !hintModalRef.current.contains(event.target as Node)) {
      setHintNum(-1);
    }
  };

  // メニューの外側をクリックしたらメニューを閉じる
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // レンダリングされてから一定時間後に hintNum を -1 にする
  useEffect(() => {
    const visibleTimer = setTimeout(() => {
      setHintNum(-1);
    }, visibleTime);

    return () => {
      clearTimeout(visibleTimer);
    };
  }, []);

  const handleButtonClick = () => {
    // 対象のルールの開閉状態を更新(対象ルールへのジャンプはaタグのhrefで制御)
    setDetailOpens((prevState) => {
      const targetRule = strenghTypes.includes(hintNum) ? ElementStatus.つり輪_力技制限2_脚前挙 : hintNum;
      // 対象のルールが開いていない場合は開ける
      if (!prevState.includes(targetRule)) {
        return [...prevState, targetRule];
      }
      return prevState; // すでに開いている場合はそのまま
    });
    setHintNum(-1);
    // ルールを表示する
    setDisplayMode(isMobile ? 2 : 1);
  };

  return (
    <div className={`hint ${isMobile ? "hint--sp" : "hint--pc"}`}>
      <div
        className={`hint__container ${
          hintNum === ElementStatus.選択可能 ? "hint__container--light" : "hint__container--dark"
        }`}
        ref={hintModalRef}
      >
        <div className="hint__wrapper">
          <div className="hint__content">
            <p className="hint__textbox">
              <span className="hint__title">
                {hintNum === ElementStatus.選択可能 ? (
                  <>
                    <CheckIcon sx={{ color: `var(--black)`, fontSize: `1.2rem` }} />
                    追加しました
                  </>
                ) : (
                  <>
                    <LockIcon sx={{ color: `var(--white)`, fontSize: `1rem` }} />
                    制限中
                  </>
                )}
              </span>
              {hintNum === ElementStatus.選択可能 ? (
                <span className="hint__description">
                  現在のDスコア: <span style={{ fontWeight: "bold" }}> {calculateTotalScore(routine).toFixed(1)}</span>
                </span>
              ) : (
                <span className="hint__description">
                  {hintNum}.{getElementStatusName(hintNum)}
                </span>
              )}
            </p>
            <a
              href={`#${strenghTypes.includes(hintNum) ? ElementStatus.つり輪_力技制限2_脚前挙 : hintNum}`}
              className="common__button hint__button"
              onClick={handleButtonClick}
            >
              {hintNum === ElementStatus.選択可能 ? "演技構成を見る" : "ルールを見る"}
            </a>
          </div>
        </div>
        <div className={`hint__icon ${hintNum === ElementStatus.選択可能 ? "hint__icon--light" : "hint__icon--dark"}`}>
          <CloseIcon onClick={() => setHintNum(-1)} />
        </div>
      </div>
    </div>
  );
};

export default Hint;
