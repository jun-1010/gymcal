import { useState } from "react";

interface LpProps {
  setIsLpVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Lp = ({ setIsLpVisible }: LpProps) => {
  const [localIsLpHidden, setLocalIsLpHidden] = useState(false);

  const handleButtonClick = () => {
    if (localIsLpHidden) {
      localStorage.setItem("isLpHidden", "true");
    }
    setIsLpVisible(false);
  };

  return (
    <div className="lp">
      <div className="lp__header lp__wrapper">
        <img src="./icon_枠なし_透過.png" alt="" />
        <p className="lp__subtitle">体操競技のデジタル採点規則</p>
        <p className="lp__title">GymCal</p>
      </div>

      <div className="lp__contents lp__wrapper">
        <table className="common__table lp__table">
          <tbody>
            <tr className="common__table-row">
              <td className="common__table-cell">数学の公式をただ読むより、</td>
            </tr>
            <tr className="common__table-row">
              <td className="common__table-cell">実際に計算する方が、理解はぐんと深まる。</td>
            </tr>
          </tbody>
        </table>
        <div className="lp__contents-description">
          <p>あなたにもそんな経験、ありませんか？</p>
          <p>
            体操競技の複雑なルールが
            <br />
            <span style={{ fontWeight: "bold" }}>「電卓のように自動計算」</span>されたら
            <br />
            もっと直感的に理解できる
          </p>
          <p>そう考え、このアプリを開発しました。</p>
        </div>
        <div className="lp__video-box">
          <video src="./LP用デモ動画.mov" loop autoPlay muted></video>
          <p className="lp__video-description">技を選択すると得点が自動計算されます</p>
        </div>
      </div>

      <div className="lp__buttons lp__wrapper">
        <p>
          組み合わせによって得点が変わる <br />
          <span style={{ fontWeight: "bold" }}>体操競技の面白さを体感しましょう</span>
        </p>

        <button onClick={() => handleButtonClick()}>はじめる</button>
        <label>
          <input
            type="checkbox"
            name="isLpHidden"
            defaultChecked={localIsLpHidden}
            onClick={() => setLocalIsLpHidden(!localIsLpHidden)}
          />
          <p>次回からこのページを表示しない</p>
        </label>
      </div>

      <div className="lp__footer">
        <a href="https://x.com/Gymnastics_Jun">
          <img src="./icon_枠なし_透過.png" alt="" />
        </a>
        <p>
          <a href="https://x.com/Gymnastics_Jun">Jun</a>が運営しています。
        </p>
      </div>
    </div>
  );
};

export default Lp;
