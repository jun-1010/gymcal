import { CategorizedElements, getGroupElements } from "../../utilities/ElementUtil";
import { calculateMultipleSaltoShortage, isFXCircleLimit, isFXStrengthLimit } from "../../utilities/RoutineFXUtil";
import {
  getPHHandstandLimitCodes,
  getPHRussianLimitCodes,
  getPHRussianTravelLimit1Codes,
  getPHTravelLimitCodes,
  getPHTravelSpindleLimitCodes,
} from "../../utilities/RoutinePHUtils";
import {
  calculateElementCountDeduction,
  calculateNeutralDeduction,
  calculateTotalConnectionValue,
  calculateTotalDifficulty,
  calculateTotalElementGroupScore,
  calculateTotalScore,
  isGroupLimited,
  RoutineElement,
} from "../../utilities/RoutineUtil";
import { ELEMENT_COUNT_DEDUCTIONS, Events, RuleKey, RuleName, Rules, getGroupKey } from "../../utilities/Type";
import RoutineRule from "../atoms/RoutineRule";

// 同一枠の技を持つ技のコードを取得
const getSameSlotCodes = (routine: RoutineElement[], categorizedElements: CategorizedElements) => {
  // 同一枠制限
  let sameSlotCodes: string[] = [];

  routine.forEach((element) => {
    const groupElements = getGroupElements(categorizedElements, element.event, element.element_group);

    Object.values(groupElements).forEach((rowElements) => {
      Object.values(rowElements).forEach((groupElement) => {
        if (
          "code" in groupElement &&
          groupElement.code !== "" &&
          groupElement.id !== element.id &&
          groupElement.code === element.code
        ) {
          sameSlotCodes.push(groupElement.code!);
        }
      });
    });
  });

  return sameSlotCodes;
};

// グループ技数制限が適用されているグループを取得
const getLimitedGroups = (routine: RoutineElement[]) => {
  let limitedGroups: string[] = [];
  routine.forEach((element) => {
    if (isGroupLimited(routine, element)) {
      const groupKey = getGroupKey(element.element_group);
      if (!limitedGroups.includes(groupKey)) {
        limitedGroups.push(groupKey);
      }
    }
  });
  return limitedGroups;
};

interface RoutineRulesProps {
  selectEvent: number;
  routine: RoutineElement[];
  categorizedElements: CategorizedElements;
}

export const RoutineRules = ({ selectEvent, routine, categorizedElements }: RoutineRulesProps) => {
  const sameSlotCodes = getSameSlotCodes(routine, categorizedElements);
  const limitedGroups = getLimitedGroups(routine);
  const fxStrengthLimitCode =
    (selectEvent === Events.床 && routine.find((element) => isFXStrengthLimit(routine, element))?.code) || "";
  const fxCircleLimitCode =
    (selectEvent === Events.床 && routine.find((element) => isFXCircleLimit(routine, element))?.code) || "";
  const phTravelLimitCodes = selectEvent === Events.あん馬 ? getPHTravelLimitCodes(routine) : [];
  const phRussianLimitCodes = selectEvent === Events.あん馬 ? getPHRussianLimitCodes(routine) : [];
  const phHandstandLimitCodes = selectEvent === Events.あん馬 ? getPHHandstandLimitCodes(routine) : [];
  const phRussianTranveLimit1Codes = selectEvent === Events.あん馬 ? getPHRussianTravelLimit1Codes(routine) : [];
  const phTranveSpindleLimitCodes = selectEvent === Events.あん馬 ? getPHTravelSpindleLimitCodes(routine) : [];

  return (
    <>
      <div className="routine__title-box">
        <div className="routine__title">関連ルール</div>
      </div>
      <div className="routine__rules">
        <div className="rules__section">
          <div className="rules__section-header">
            <p className="rules__section-title">加算ルール</p>
            <p className="rules__section-description">条件を満たした場合に加算されるルール</p>
          </div>

          {/* Dスコア */}
          <RoutineRule
            summaryNode={
              <span className="rules__summary-title">
                {RuleKey(Rules.Dスコア)}

                {calculateTotalScore(routine) > 0 ? (
                  <p className="common__label common__label--active routine__summary-label">
                    Dスコア: {calculateTotalScore(routine).toFixed(1)}
                  </p>
                ) : null}
              </span>
            }
            descriptionNode={
              <div className="rules__description">
                <p>Dスコアは以下の得点の合計で算出されます。</p>
                <p>・グループ得点(EG)</p>
                <p>・難度点</p>
                <p>・組み合わせ加点(CV)</p>
              </div>
            }
            show={true}
          />

          {/* グループ得点 */}
          <RoutineRule
            summaryNode={
              <span className="rules__summary-title">
                {RuleKey(Rules.グループ得点)}

                {calculateTotalElementGroupScore(routine) > 0 ? (
                  <p className="common__label routine__summary-label">
                    EG: {calculateTotalElementGroupScore(routine).toFixed(1)}
                  </p>
                ) : (
                  <></>
                )}
              </span>
            }
            descriptionNode={
              <div className="rules__description">
                <p>技はグループ(EG)に分類されます。</p>
                <p>
                  各EG内の
                  <span style={{ fontWeight: "bold" }}>最高難度の技</span>
                  に応じてグループ得点が付与されます。
                </p>
                <table className="rules__table-table">
                  <tbody>
                    <tr className="rules__table-row">
                      <td className="rules__table-cell rules__table-cell--3rem">難度</td>
                      <td className={`rules__table-cell rules__table-cell--3rem`}>A~C</td>
                      <td className={`rules__table-cell rules__table-cell--3rem`}>D以上</td>
                    </tr>
                    <tr className="rules__table-row">
                      <td className="rules__table-cell rules__table-cell--3rem">加点</td>
                      <td className={`rules__table-cell rules__table-cell--3rem`}>0.3</td>
                      <td className={`rules__table-cell rules__table-cell--3rem`}>0.5</td>
                    </tr>
                  </tbody>
                </table>
                <p>EG1は難度に関わらず0.5点が付与されます。</p>
                <p className="rules__section-line" />
                <p>
                  終末技は、<span style={{ fontWeight: "bold" }}>終末技の難度</span>
                  分の得点が終末技グループ得点として付与されます。（終末技がF難度の場合、グループ得点も0.6点となります。）
                </p>
              </div>
            }
            show={true}
          />

          {/* 難度点 */}
          <RoutineRule
            summaryNode={
              <span className="rules__summary-title">
                {RuleKey(Rules.難度点)}

                {calculateTotalDifficulty(routine) > 0 ? (
                  <p className="common__label routine__summary-label">
                    難度: {calculateTotalDifficulty(routine).toFixed(1)}
                  </p>
                ) : (
                  <></>
                )}
              </span>
            }
            descriptionNode={
              <div className="rules__description">
                <p>最大8つの技の難度点が加算されます。</p>
              </div>
            }
            show={true}
          />

          {/* 組み合わせ加点 */}
          <RoutineRule
            summaryNode={
              <span className="rules__summary-title">
                {RuleKey(Rules.組み合わせ加点)}

                {calculateTotalConnectionValue(routine) > 0 ? (
                  <p className="common__label routine__summary-label">
                    CV: {calculateTotalConnectionValue(routine).toFixed(1)}
                  </p>
                ) : (
                  <></>
                )}
              </span>
            }
            descriptionNode={
              <div className="rules__description">
                <p>技を組み合わせると加点が付与されます。</p>
                <table className="rules__table-table">
                  <tbody>
                    <tr className="rules__table-row">
                      <td className="rules__table-cell rules__table-cell--6rem">組み合わせ</td>
                      <td className={`rules__table-cell  rules__table-cell--6rem`}>D以上+BorC</td>
                      <td className={`rules__table-cell  rules__table-cell--6rem`}>D以上+D以上</td>
                    </tr>
                    <tr className="rules__table-row">
                      <td className="rules__table-cell rules__table-cell--6rem">加点</td>
                      <td className={`rules__table-cell rules__table-cell--6rem`}>0.1</td>
                      <td className={`rules__table-cell rules__table-cell--6rem`}>0.2</td>
                    </tr>
                  </tbody>
                </table>
                <p>ただし以下の場合は加点が付与されません。</p>
                <p style={{ fontWeight: "bold" }}>・切り返しによる組み合わせ</p>
                <p> 例）ルドルフ+前方抱え込み宙返り正面支持臥）</p>
                <p style={{ fontWeight: "bold" }}>・ひねりを伴う1回宙同士の組み合わせ</p>
                <p> 例）後方伸身宙返り5/2ひねり + 前方伸身宙返り2回ひねり</p>
              </div>
            }
            show={selectEvent === Events.床 || selectEvent === Events.鉄棒}
          />
        </div>

        <div className="rules__section">
          <div className="rules__section-header">
            <p className="rules__section-title">減点ルール</p>
            <p className="rules__section-description">条件を満たさない場合に減点されるルール</p>
          </div>

          {/* ニュートラルディダクション */}
          <RoutineRule
            summaryNode={
              <span className="rules__summary-title">
                {RuleKey(Rules.ニュートラルディダクション)}
                {calculateNeutralDeduction(selectEvent, routine) > 0 ? (
                  <p className="common__label common__label--active routine__summary-label">
                    ND:{calculateNeutralDeduction(selectEvent, routine).toFixed(1)}
                  </p>
                ) : (
                  <></>
                )}
              </span>
            }
            descriptionNode={
              <div className="rules__description">
                <p>以下の要求を満たさない場合、減点が付与されます。</p>
                <p>・6技以上による構成（技数減点）</p>
                <p>・終末技が2回もしくは3回宙返り技（ダブル系不足）</p>
              </div>
            }
            show={true}
          />

          {/* 技数減点 */}
          <RoutineRule
            summaryNode={
              <span className="rules__summary-title">
                {RuleKey(Rules.技数減点)}
                {calculateElementCountDeduction(routine) > 0 ? (
                  <p className="common__label routine__summary-label">
                    技数減点:{calculateElementCountDeduction(routine).toFixed(1)}
                  </p>
                ) : (
                  <></>
                )}
              </span>
            }
            descriptionNode={
              <div className="rules__description">
                <p>少ない技数の演技には減点が発生します(ND)。</p>
                <table className="rules__table-table">
                  <tbody>
                    <tr className="rules__table-row">
                      <td className="rules__table-cell rules__table-cell--3rem">技数</td>
                      {ELEMENT_COUNT_DEDUCTIONS.map((deduction, index) => (
                        <td
                          key={index}
                          className={`rules__table-cell ${routine.length === index ? "rules__table-cell--active" : ""}`}
                        >
                          {index}
                        </td>
                      ))}
                    </tr>
                    <tr className="rules__table-row">
                      <td className="rules__table-cell rules__table-cell--3rem">減点</td>
                      {ELEMENT_COUNT_DEDUCTIONS.map((deduction, index) => (
                        <td
                          key={index}
                          className={`rules__table-cell ${routine.length === index ? "rules__table-cell--active" : ""}`}
                        >
                          {deduction}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            }
            show={true}
          />

          {/* ダブル系 */}
          <RoutineRule
            summaryNode={
              <span className="rules__summary-title">
                {RuleKey(Rules.ダブル系不足)}
                {calculateMultipleSaltoShortage(routine) > 0 ? (
                  <p className="common__label routine__summary-label">
                    ダブル系不足:{calculateMultipleSaltoShortage(routine).toFixed(1)}
                  </p>
                ) : (
                  <></>
                )}
              </span>
            }
            descriptionNode={
              <div className="rules__description">
                <p>終末技が2回もしくは3回宙返り技でない場合、減点が付与されます（仮）。</p>
              </div>
            }
            show={selectEvent === Events.床}
          />
        </div>

        <div className="rules__section">
          <div className="rules__section-header">
            <p className="rules__section-title">制限ルール</p>
            <p className="rules__section-description">条件を満たした技に選択制限がかかるルール</p>
          </div>

          {/* 同一枠制限 */}
          <RoutineRule
            summaryNode={
              <span className="rules__summary-title">
                {RuleKey(Rules.同一枠制限)}

                {sameSlotCodes.length > 0 ? (
                  <div className="rules__summary-labels">
                    {sameSlotCodes.slice(0, 4).map((e, index) => (
                      <p key={index} className="common__label routine__summary-label">
                        {e}
                      </p>
                    ))}
                    {sameSlotCodes.length > 4 && <p className="common__label routine__summary-label">...</p>}
                  </div>
                ) : null}
              </span>
            }
            descriptionNode={
              <div className="rules__description">
                <p>類似した技は同じ技と判定されます。</p>
                <p>技名の先頭のコード(採点規則準拠)が同じ技が対象です。</p>
                <p>例）</p>
                <p>
                  ・<span style={{ fontWeight: "bold" }}>II14</span>.前方伸身宙返り
                </p>
                <p>
                  ・<span style={{ fontWeight: "bold" }}>II14</span>
                  .前方伸身宙返り1/2ひねり
                </p>
              </div>
            }
            show={true}
          />

          {/* グループ技数制限 */}
          <RoutineRule
            summaryNode={
              <span className="rules__summary-title">
                {RuleKey(Rules.グループ技数制限)}

                {limitedGroups.length > 0 ? (
                  <div className="rules__summary-labels">
                    {limitedGroups.map((e, index) => (
                      <p key={index} className="common__label routine__summary-label">
                        {e}
                      </p>
                    ))}
                  </div>
                ) : null}
              </span>
            }
            descriptionNode={
              <div className="rules__description">
                <p>
                  同一グループからは最大
                  <span style={{ fontWeight: "bold" }}>4つの技</span>
                  を使用できます。
                </p>
                {/* 
          <p>鉄棒のEG2(手放し技)は、技を組み合わせることで5つ目の技を使用できるようになります。</p>
          */}
              </div>
            }
            show={true}
          />

          {/* 全体技数制限 */}
          <RoutineRule
            summaryNode={
              <span className="rules__summary-title">
                {RuleKey(Rules.全体技数制限)}
                {routine.length === 8 ? <p className="common__label routine__summary-label">✔️</p> : null}
              </span>
            }
            descriptionNode={
              <div className="rules__description">
                <p>
                  1演技は最大<span style={{ fontWeight: "bold" }}>8つの技</span>
                  で構成できます。
                </p>
                <p>8つ以上の技を実施してもDスコアには加算されません。</p>
              </div>
            }
            show={true}
          />

          {/* 床_力技制限 */}
          <RoutineRule
            summaryNode={
              <span className="rules__summary-title">
                {RuleName(Rules.床_力技制限)}
                {fxStrengthLimitCode ? (
                  <p className="common__label routine__summary-label">{fxStrengthLimitCode}</p>
                ) : null}
              </span>
            }
            descriptionNode={
              <div className="rules__description">
                <p>力技は1演技に1つまで使用できます。</p>
                <p>力技は以下を除いたI1~I48です。</p>
                <p>・I19 倒立(2秒)</p>
                <p>・I31 倒立ひねりor倒立1回ひねり</p>
                {/* TODO: getElementNameByCodeをElement.tsに作成 & selectEvent/selectGroupをContextAPIに保持（リファクタリング） */}
              </div>
            }
            show={selectEvent === Events.床}
          />

          {/* 床_旋回制限 */}
          <RoutineRule
            summaryNode={
              <span className="rules__summary-title">
                {RuleName(Rules.床_旋回制限)}
                {fxCircleLimitCode ? <p className="common__label routine__summary-label">{fxCircleLimitCode}</p> : null}
              </span>
            }
            descriptionNode={
              <div className="rules__description">
                <p>旋回技(I79~I105)は1演技に1つまで使用できます。</p>
              </div>
            }
            show={selectEvent === Events.床}
          />

          {/* あん馬_縦向き移動技制限 */}
          <RoutineRule
            summaryNode={
              <span className="rules__summary-title">
                {RuleName(Rules.あん馬_縦向き移動技制限)}
                {phTravelLimitCodes.length > 0 ? (
                  <div className="rules__summary-labels">
                    {phTravelLimitCodes.map((code, index) => (
                      <p key={index} className="common__label routine__summary-label">
                        {code}
                      </p>
                    ))}
                  </div>
                ) : null}
              </span>
            }
            descriptionNode={
              <div className="rules__description">
                <p>縦向き3部分前及び後ろ移動技は1演技中2つまで使用できます。</p>
              </div>
            }
            show={selectEvent === Events.あん馬}
          />

          {/* あん馬_ロシアン転向技制限 */}
          <RoutineRule
            summaryNode={
              <span className="rules__summary-title">
                {RuleName(Rules.あん馬_ロシアン転向技制限)}
                {phRussianLimitCodes.length > 0 ? (
                  <div className="rules__summary-labels">
                    {phRussianLimitCodes.map((code, index) => (
                      <p key={index} className="common__label routine__summary-label">
                        {code}
                      </p>
                    ))}
                  </div>
                ) : null}
              </span>
            }
            descriptionNode={
              <div className="rules__description">
                <p>ロシアン転向技は終末技を含めて1演技中2つまで使用できます。</p>
                <p>また、同じ場所でのロシアン転向技は1つまで使用できます。</p>
                <p>例）</p>
                <p>・馬端馬背ロシアン1080°転向～ロシアン720°転向下り：不認定+B難度</p>
                <p>・あん部馬背ロシアン720°転向～あん部馬背ロシアン1080°転向：不認定+E難度</p>
                <p>・あん部馬背ロシアン360° ～馬端馬背ロシアン1080°転向～ロシアン360°転向下り：C難度+不認定+A難度</p>
              </div>
            }
            show={selectEvent === Events.あん馬}
          />

          {/* あん馬_倒立技制限 */}
          <RoutineRule
            summaryNode={
              <span className="rules__summary-title">
                {RuleName(Rules.あん馬_倒立技制限)}
                {phHandstandLimitCodes.length > 0 ? (
                  <div className="rules__summary-labels">
                    {phHandstandLimitCodes.map((code, index) => (
                      <p key={index} className="common__label routine__summary-label">
                        {code}
                      </p>
                    ))}
                  </div>
                ) : null}
              </span>
            }
            descriptionNode={
              <div className="rules__description">
                <p>倒立する技は終末技を除いて1演技中2つまで使用できます。</p>
              </div>
            }
            show={selectEvent === Events.あん馬}
          />

          {/* あん馬_ロシアン転向移動技制限1 */}
          <RoutineRule
            summaryNode={
              <span className="rules__summary-title">
                {RuleName(Rules.あん馬_ロシアン転向移動技制限1)}
                {phRussianTranveLimit1Codes.length > 0 ? (
                  <div className="rules__summary-labels">
                    {phRussianTranveLimit1Codes.map((code, index) => (
                      <p key={index} className="common__label routine__summary-label">
                        {code}
                      </p>
                    ))}
                  </div>
                ) : null}
              </span>
            }
            descriptionNode={
              <div className="rules__description">
                <p>以下のロシアン転向移動技は1演技中2つまで使用できます。</p>
                <p>・III.57 下向き正転向移動(一把手～馬端)</p>
                <p>・III.58 トンフェイ</p>
                <p>・III.59 ヴァメン</p>
                <p>・III.64 下向き720°(以上)転向移動(一把手～馬端)</p>
                <p>・III.65 ウ・ヴォニアン</p>
                <p>・III.70 ロス</p>
              </div>
            }
            show={selectEvent === Events.あん馬}
          />

          {/* あん馬_移動ひねり技制限 */}
          <RoutineRule
            summaryNode={
              <span className="rules__summary-title">
                {RuleName(Rules.あん馬_移動ひねり技制限)}
                {phTranveSpindleLimitCodes.length > 0 ? (
                  <div className="rules__summary-labels">
                    {phTranveSpindleLimitCodes.map((code, index) => (
                      <p key={index} className="common__label routine__summary-label">
                        {code}
                      </p>
                    ))}
                  </div>
                ) : null}
              </span>
            }
            descriptionNode={
              <div className="rules__description">
                <p>以下のひねりを伴う3/3移動技は1演技中2つまで使用できます。</p>
                <p>・III.17 正面横移動ひねり、背面横移動ひねり（馬端～馬端）</p>
                <p>・III.22 縦向き1/3前移動直ちに縦向き2/3移動ひねり（ニン・レイエス）</p>
                <p>・III.23 両把手を越えて縦向き3/3前移動直ちに1/2ひねり（ニン・レイエス2）</p>
                <p>・III.29 開脚旋回縦向き3/3移動1回ひねり（2回以内の旋回で）（ウルジカ2/ブルクハルト）</p>
              </div>
            }
            show={selectEvent === Events.あん馬}
          />
        </div>
      </div>
    </>
  );
};
