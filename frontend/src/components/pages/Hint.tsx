import { useEffect, useRef } from "react";
import { getElementStatusName } from "../../utilities/Type";

interface HintProps {
  hintNum: number;
  setHintNum: React.Dispatch<React.SetStateAction<number>>;
  setRoutineOpen: React.Dispatch<React.SetStateAction<number>>;
  isMobile: boolean;
  setDetailOpens: React.Dispatch<React.SetStateAction<number[]>>;
}

const Hint = ({ hintNum, setHintNum, setRoutineOpen, isMobile, setDetailOpens }: HintProps) => {
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
    <div className="hint">
      <div className="hint__contents" ref={hintModalRef}>
        <p>以下のルールが適用されています。</p>
        <table className="common__table hint__table">
          <tbody>
            <tr className="common__table-row">
              <td className="common__table-cell hint__table-cell">
                {hintNum}.{getElementStatusName(hintNum)}
              </td>
            </tr>
          </tbody>
        </table>
        <a href={`#${hintNum}`} className="common__button hint__button" onClick={handleButtonClick}>
          制限中のルールを見る
        </a>
      </div>
    </div>
  );
};

export default Hint;
