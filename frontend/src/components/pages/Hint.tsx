import { useEffect, useRef, useState } from "react";
import { ElementStatus, getElementStatusName } from "../../utilities/Type";
import CloseIcon from "@mui/icons-material/Close";

interface HintProps {
  hintNum: number;
  setHintNum: React.Dispatch<React.SetStateAction<number>>;
  setRoutineOpen: React.Dispatch<React.SetStateAction<number>>;
  isMobile: boolean;
  setDetailOpens: React.Dispatch<React.SetStateAction<number[]>>;
}

const Hint = ({ hintNum, setHintNum, setRoutineOpen, isMobile, setDetailOpens }: HintProps) => {
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
    setHintNum(-1);
    setDetailOpens((prevState) => {
      // すでに hintNum が存在しない場合のみ追加
      if (!prevState.includes(hintNum)) {
        return [...prevState, hintNum];
      }
      return prevState; // すでに存在する場合はそのまま返す
    });
    setRoutineOpen(isMobile ? 2 : 1);
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
              <span className="hint__title">{hintNum === ElementStatus.選択可能 ? "追加しました" : "制限中"}</span>
              {hintNum !== ElementStatus.選択可能 && (
                <span className="hint__description">
                  {hintNum}.{getElementStatusName(hintNum)}
                </span>
              )}
            </p>
            <a href={`#${hintNum}`} className="common__button hint__button" onClick={handleButtonClick}>
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
