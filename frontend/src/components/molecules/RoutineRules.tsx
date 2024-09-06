import React from "react";
import { Element, CategorizedElements, getGroupElements, getElementsByType } from "../../utilities/ElementUtil";
import { calculateMultipleSaltoShortage } from "../../utilities/RoutineFXUtil";
import { getPHRussianLimitCodes } from "../../utilities/RoutinePHUtil";
import {
  calculateSwingHandstandShortage,
  getSRStrengthLimit1Codes,
  getSRStrengthLimit2Codes,
  srCombinationCode,
} from "../../utilities/RoutineSRUtil";
import {
  calculateElementCountDeduction,
  calculateNeutralDeduction,
  calculateTotalConnectionValue,
  calculateTotalDifficulty,
  calculateTotalElementGroupScore,
  calculateTotalScore,
  isGroupLimited,
  RoutineElement,
  getRoutineElementsByType,
} from "../../utilities/RoutineUtil";
import {
  ELEMENT_COUNT_DEDUCTIONS,
  ElementGroup,
  ElementType,
  Events,
  RuleKey,
  RuleName,
  Rules,
  getGroupKey,
  getGroupName,
} from "../../utilities/Type";
import RoutineRule from "../atoms/RoutineRule";
import { calculateVTScore } from "../../utilities/RoutineVTUtil";
import { checkOneRailBeginLimit } from "../../utilities/RoutinePBUtil";
import SimpleTypeCountRule from "../quarks/SimpleTypeCountRule";

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
  const phRussianLimitCodes = selectEvent === Events.あん馬 ? getPHRussianLimitCodes(routine) : [];
  const srStrengthLimit1CodesList = selectEvent === Events.つり輪 ? getSRStrengthLimit1Codes(routine) : [];
  const srStrengthLimit2Codes = selectEvent === Events.つり輪 ? getSRStrengthLimit2Codes(routine) : [];
  // 平行棒_単棒倒立系
  const pbOneRailLimitCodes =
    selectEvent === Events.平行棒
      ? getRoutineElementsByType(routine, [ElementType.平行棒_単棒終了技, ElementType.平行棒_単棒開始技])
      : [];
  const pbOneRailEndElements =
    selectEvent === Events.平行棒
      ? getElementsByType(Events.平行棒, ElementType.平行棒_単棒終了技, categorizedElements)
      : [];
  const pbOneRailBeginElements =
    selectEvent === Events.平行棒
      ? getElementsByType(Events.平行棒, ElementType.平行棒_単棒開始技, categorizedElements)
      : [];

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
                  <p className="common__label common__label--active ">
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
            show={selectEvent !== Events.跳馬}
          />

          {/* 跳馬_Dスコア */}
          <RoutineRule
            summaryNode={
              <span className="rules__summary-title">
                Dスコア
                {calculateVTScore(routine) > 0 ? (
                  <p className="common__label common__label--active ">
                    {routine.length === 2 && "平均"}Dスコア: {calculateVTScore(routine).toFixed(1)}
                  </p>
                ) : null}
              </span>
            }
            descriptionNode={
              <div className="rules__description">
                <p>跳馬のDスコアは技ひとつひとつに割り振られています。</p>
                <p>
                  種目別において選手は2つの跳躍を行い、その
                  <span style={{ fontWeight: "bold" }}>平均スコア</span>
                  が得点になります。
                </p>
                <p>例:</p>
                <div className="rules__description-label-box">
                  <span>・1跳躍目: D5.6 + E9.0 = 14.4</span>
                  <span>・2跳躍目: D5.2 + E9.2 = 14.2</span>
                  <span>
                    ・決定点： <span style={{ fontWeight: "bold" }}>(14.4 + 14.2) / 2 = 14.3</span>
                  </span>
                </div>
              </div>
            }
            show={selectEvent === Events.跳馬}
          />

          {/* グループ得点 */}
          <RoutineRule
            summaryNode={
              <span className="rules__summary-title">
                {RuleKey(Rules.グループ得点)}

                {calculateTotalElementGroupScore(routine) > 0 ? (
                  <p className="common__label ">EG: {calculateTotalElementGroupScore(routine).toFixed(1)}</p>
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
            show={selectEvent !== Events.跳馬}
          />

          {/* 難度点 */}
          <RoutineRule
            summaryNode={
              <span className="rules__summary-title">
                {RuleKey(Rules.難度点)}

                {calculateTotalDifficulty(routine) > 0 ? (
                  <p className="common__label ">難度: {calculateTotalDifficulty(routine).toFixed(1)}</p>
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
            show={selectEvent !== Events.跳馬}
          />

          {/* 床_組み合わせ加点 */}
          <RoutineRule
            summaryNode={
              <span className="rules__summary-title">
                {RuleName(Rules.床_組み合わせ加点)}

                {calculateTotalConnectionValue(routine) > 0 ? (
                  <p className="common__label ">CV: {calculateTotalConnectionValue(routine).toFixed(1)}</p>
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
            show={selectEvent === Events.床}
          />

          {/* つり輪_組み合わせ加点 */}
          <RoutineRule
            summaryNode={
              <span className="rules__summary-title">
                {RuleName(Rules.つり輪_組み合わせ加点)}

                {srCombinationCode(routine).length > 0 ? (
                  <p className="common__label ">{srCombinationCode(routine)}</p>
                ) : (
                  <></>
                )}
              </span>
            }
            descriptionNode={
              <div className="rules__description">
                <p>
                  ヤマワキやジョナサンから直接振動倒立技を実施した場合、ヤマワキやジョナサンは
                  <span style={{ fontWeight: "bold" }}>一段階格上げ</span>となります。
                </p>
                <p>この加点は難度点に付与されます。</p>
                <p>例:</p>
                <p>・I45.ジョナサン(C)+I81.後ろ振り倒立(C)→D+C</p>
                <p>・I44.ヤマワキ(B)+I45.ジョナサン(C)+I81.後ろ振り倒立→B+D+C</p>
              </div>
            }
            show={selectEvent === Events.つり輪}
          />

          {/* 鉄棒_組み合わせ加点 */}
          <RoutineRule
            summaryNode={
              <span className="rules__summary-title">
                組み合わせ加点
                {calculateTotalConnectionValue(routine) > 0 ? (
                  <p className="common__label ">CV: {calculateTotalConnectionValue(routine).toFixed(1)}</p>
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
                      <td className="rules__table-cell rules__table-cell--5rem rules__table-cell--left">手放し技</td>
                      <td className="rules__table-cell rules__table-cell--5rem rules__table-cell--left">手放し技</td>
                      <td className="rules__table-cell rules__table-cell--5rem rules__table-cell--left">加点</td>
                    </tr>
                    <tr className="rules__table-row">
                      <td className="rules__table-cell rules__table-cell--5rem rules__table-cell--left">C 難度</td>
                      <td className="rules__table-cell rules__table-cell--5rem rules__table-cell--left">D 難度以上</td>
                      <td className="rules__table-cell rules__table-cell--5rem rules__table-cell--left">
                        0.1（逆も可）
                      </td>
                    </tr>
                    <tr className="rules__table-row">
                      <td className="rules__table-cell rules__table-cell--5rem rules__table-cell--left">D 難度</td>
                      <td className="rules__table-cell rules__table-cell--5rem rules__table-cell--left">D 難度</td>
                      <td className="rules__table-cell rules__table-cell--5rem rules__table-cell--left">0.1</td>
                    </tr>
                    <tr className="rules__table-row">
                      <td className="rules__table-cell rules__table-cell--5rem rules__table-cell--left">D 難度以上</td>
                      <td className="rules__table-cell rules__table-cell--5rem rules__table-cell--left">E 難度以上</td>
                      <td className="rules__table-cell rules__table-cell--5rem rules__table-cell--left">
                        0.2（逆も可）
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table className="rules__table-table">
                  <tbody>
                    <tr className="rules__table-row">
                      <td className="rules__table-cell rules__table-cell--5rem rules__table-cell--left">
                        手放し技以外
                      </td>
                      <td className="rules__table-cell rules__table-cell--5rem rules__table-cell--left">手放し技</td>
                      <td className="rules__table-cell rules__table-cell--5rem rules__table-cell--left">加点</td>
                    </tr>
                    <tr className="rules__table-row">
                      <td className="rules__table-cell rules__table-cell--5rem rules__table-cell--left">D 難度</td>
                      <td className="rules__table-cell rules__table-cell--5rem rules__table-cell--left">D 難度以上</td>
                      <td className="rules__table-cell rules__table-cell--5rem rules__table-cell--left">
                        0.1（逆も可）
                      </td>
                    </tr>
                    <tr className="rules__table-row">
                      <td className="rules__table-cell rules__table-cell--5rem rules__table-cell--left">D 難度以上</td>
                      <td className="rules__table-cell rules__table-cell--5rem rules__table-cell--left">E 難度以上</td>
                      <td className="rules__table-cell rules__table-cell--5rem rules__table-cell--left">
                        0.2（逆も可）
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            }
            show={selectEvent === Events.鉄棒}
          />
        </div>
        {selectEvent !== Events.跳馬 && (
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
                    <p className="common__label common__label--active ">
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
                  {selectEvent === Events.床 && <p>・終末技が2回もしくは3回宙返り技（ダブル系不足）</p>}
                  {selectEvent === Events.つり輪 && <p>・振動倒立技を使用している（振動倒立技不足）</p>}
                </div>
              }
              show={selectEvent !== Events.跳馬}
            />

            {/* 技数減点 */}
            <RoutineRule
              summaryNode={
                <span className="rules__summary-title">
                  {RuleKey(Rules.技数減点)}
                  {calculateElementCountDeduction(routine) > 0 ? (
                    <p className="common__label ">技数減点:{calculateElementCountDeduction(routine).toFixed(1)}</p>
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
                            className={`rules__table-cell rules__table-cell--1-5rem ${
                              routine.length === index ? "rules__table-cell--active" : ""
                            }`}
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
                            className={`rules__table-cell rules__table-cell--1-5rem ${
                              routine.length === index ? "rules__table-cell--active" : ""
                            }`}
                          >
                            {deduction}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              }
              show={selectEvent !== Events.跳馬}
            />

            {/* 床_ダブル系 */}
            <RoutineRule
              summaryNode={
                <span className="rules__summary-title">
                  {RuleName(Rules.床_ダブル系不足)}
                  {calculateMultipleSaltoShortage(routine) > 0 ? (
                    <p className="common__label ">ダブル系不足:{calculateMultipleSaltoShortage(routine).toFixed(1)}</p>
                  ) : (
                    <></>
                  )}
                </span>
              }
              descriptionNode={
                <div className="rules__description">
                  <p>終末技が2回もしくは3回宙返り技でない場合、減点が付与されます。</p>
                </div>
              }
              show={selectEvent === Events.床}
            />

            {/* つり輪_振動倒立不足 */}
            <RoutineRule
              summaryNode={
                <span className="rules__summary-title">
                  {RuleName(Rules.つり輪_振動倒立不足)}
                  {calculateSwingHandstandShortage(routine) > 0 ? (
                    <p className="common__label ">
                      振動倒立技不足:{calculateSwingHandstandShortage(routine).toFixed(1)}
                    </p>
                  ) : (
                    <></>
                  )}
                </span>
              }
              descriptionNode={
                <div className="rules__description">
                  <p>振動倒立技が演技に含まれていない場合、減点が付与されます。</p>
                </div>
              }
              show={selectEvent === Events.つり輪}
            />
          </div>
        )}

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
                    {sameSlotCodes.slice(0, 3).map((e, index) => (
                      <p key={index} className="common__label ">
                        {e}
                      </p>
                    ))}
                    {sameSlotCodes.length > 3 && <p className="common__label ">...</p>}
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
            show={selectEvent !== Events.跳馬}
          />
          {/* グループ技数制限 */}
          <RoutineRule
            summaryNode={
              <span className="rules__summary-title">
                {RuleKey(Rules.グループ技数制限)}

                {limitedGroups.length > 0 ? (
                  <div className="rules__summary-labels">
                    {limitedGroups.map((e, index) => (
                      <p key={index} className="common__label ">
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
                {selectEvent == Events.鉄棒 && (
                  <p>手放し技同士の組み合わせがある場合、手放し技グループは5つ目の技を使用できます。</p>
                )}
                {/* 
          <p>鉄棒のEG2(手放し技)は、技を組み合わせることで5つ目の技を使用できるようになります。</p>
          */}
              </div>
            }
            show={selectEvent !== Events.跳馬}
          />
          {/* 全体技数制限 */}
          <RoutineRule
            summaryNode={
              <span className="rules__summary-title">
                {RuleKey(Rules.全体技数制限)}
                {routine.length === 8 ? <p className="common__label ">✔️</p> : null}
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
            show={selectEvent !== Events.跳馬}
          />
          {/* 終末技制限 */}
          <RoutineRule
            summaryNode={
              <span className="rules__summary-title">
                {RuleKey(Rules.終末技制限)}
                {routine.length > 0 && routine[routine.length - 1].element_group === ElementGroup.EG4 ? (
                  <p className="common__label ">{routine[routine.length - 1].code}</p>
                ) : null}
              </span>
            }
            descriptionNode={
              <div className="rules__description">
                <p>終末技は終末技グループから1演技中1つまで使用できます。</p>
                <p>終末技を選択したら技の解除はできますが技の新規選択はできません。</p>
              </div>
            }
            show={selectEvent !== Events.床 && selectEvent !== Events.跳馬}
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.床}
            routine={routine}
            categorizedElements={categorizedElements}
            title="力技制限"
            targetElementType={ElementType.床_力技}
            descriptionSentence="以下の力技は1演技に1つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.床}
            routine={routine}
            categorizedElements={categorizedElements}
            title="旋回制限"
            targetElementType={ElementType.床_旋回}
            descriptionSentence="以下の旋回技は1演技に1つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.あん馬}
            routine={routine}
            categorizedElements={categorizedElements}
            title="縦向き移動技制限"
            targetElementType={ElementType.あん馬_縦向き移動技}
            descriptionSentence="以下の縦向き3部分前及び後ろ移動技は1演技中2つまで使用できます。"
          />
          {/* あん馬_ロシアン転向技制限 */}
          <RoutineRule
            summaryNode={
              <span className="rules__summary-title">
                {RuleName(Rules.あん馬_ロシアン転向技制限)}
                {phRussianLimitCodes.length > 0 ? (
                  <div className="rules__summary-labels">
                    {phRussianLimitCodes.map((code, index) => (
                      <p key={index} className="common__label ">
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
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.あん馬}
            routine={routine}
            categorizedElements={categorizedElements}
            title="倒立技制限"
            targetElementType={ElementType.あん馬_倒立技}
            descriptionSentence="以下の倒立する技は終末技を除いて1演技中2つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.あん馬}
            routine={routine}
            categorizedElements={categorizedElements}
            title="ロシアン転向移動技制限1"
            targetElementType={ElementType.あん馬_ロシアン転向移動技1}
            descriptionSentence="以下のロシアン転向移動技は1演技中2つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.あん馬}
            routine={routine}
            categorizedElements={categorizedElements}
            title="移動ひねり技制限"
            targetElementType={ElementType.あん馬_移動ひねり技}
            descriptionSentence="以下のひねりを伴う3/3移動技は1演技中2つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.あん馬}
            routine={routine}
            categorizedElements={categorizedElements}
            title="ひねり技制限"
            targetElementType={ElementType.あん馬_ひねり技}
            descriptionSentence="以下の1回ひねりを伴う技は1演技中2つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.あん馬}
            routine={routine}
            categorizedElements={categorizedElements}
            title="ショーンべズゴ系制限"
            targetElementType={ElementType.あん馬_ショーンべズゴ系}
            descriptionSentence="以下のショーン系及びベズゴ系の技はフロップやコンバイン、倒立技を含め1演技中2つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.あん馬}
            routine={routine}
            categorizedElements={categorizedElements}
            title="開脚旋回技制限"
            targetElementType={ElementType.あん馬_開脚旋回技}
            descriptionSentence="以下の開脚旋回で実施される技は終末技は含まずに1演技中4つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.あん馬}
            routine={routine}
            categorizedElements={categorizedElements}
            title="ブスナリ系制限"
            targetElementType={ElementType.あん馬_ブスナリ系}
            descriptionSentence="以下のブスナリ系の技は1演技中1つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.あん馬}
            routine={routine}
            categorizedElements={categorizedElements}
            title="ロシアン転向移動技制限2"
            targetElementType={ElementType.あん馬_ロシアン転向移動技2}
            descriptionSentence="以下のロシアン転向移動技は1演技中1つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.あん馬}
            routine={routine}
            categorizedElements={categorizedElements}
            title="トンフェイ系制限"
            targetElementType={ElementType.あん馬_トンフェイ系}
            descriptionSentence="以下のトン・フェイ系の移動技は1演技中1つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.あん馬}
            routine={routine}
            categorizedElements={categorizedElements}
            title="ニンレイエス系制限"
            targetElementType={ElementType.あん馬_ニンレイエス系}
            descriptionSentence="以下のニン・レイエス系の移動技は1演技中1つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.あん馬}
            routine={routine}
            categorizedElements={categorizedElements}
            title="フロップ系制限"
            targetElementType={ElementType.あん馬_フロップ系}
            descriptionSentence="以下のフロップ系の技は1演技中1つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.あん馬}
            routine={routine}
            categorizedElements={categorizedElements}
            title="コンバイン系制限"
            targetElementType={ElementType.あん馬_コンバイン系}
            descriptionSentence="以下のコンバイン系の技は1演技中1つまで使用できます。"
          />
          {/* つり輪_力技制限1 */}
          <RoutineRule
            summaryNode={
              <span className="rules__summary-title">
                {RuleName(Rules.つり輪_力技制限1)}
                {srStrengthLimit1CodesList.length > 0 &&
                srStrengthLimit1CodesList[srStrengthLimit1CodesList.length - 1].length >= 3 ? (
                  <div className="rules__summary-labels">
                    <p className="common__label">✔️</p>
                  </div>
                ) : null}
              </span>
            }
            descriptionNode={
              <div className="rules__description">
                <p>以下の力技を連続で選択中です。</p>
                <div className="rules__description-label-box">
                  {srStrengthLimit1CodesList.map((codes, outerIndex) =>
                    codes.length > 0 ? (
                      <span key={outerIndex} className="rules__description-labels">
                        {codes.map((code, innerIndex) => (
                          <React.Fragment key={innerIndex}>
                            <span className="common__label">{code}</span>
                            {innerIndex < codes.length - 1 && <span>→</span>}
                          </React.Fragment>
                        ))}
                      </span>
                    ) : (
                      outerIndex === 0 && (
                        <span key={outerIndex} className="rules__description-labels">
                          選択していません
                        </span>
                      )
                    )
                  )}
                </div>

                <p className="rules__section-line" />
                <p>
                  EG2またはEG3の技は<span style={{ fontWeight: "bold" }}>直接3回</span>
                  を超えて使用できません。
                </p>
                <p>
                  EG2またはEG3の技が連続していないとするためにはEG1から
                  <span style={{ fontWeight: "bold" }}>B難度以上の振動技</span>
                  が必要です。
                </p>
                <p>ただしけ上がりor後方け上がりは連続を切る条件を満たしません。</p>
              </div>
            }
            show={selectEvent === Events.つり輪}
          />
          {/* つり輪_力技制限2 */}
          <RoutineRule
            summaryNode={
              <span className="rules__summary-title">
                {RuleName(Rules.つり輪_力技制限2)}
                {srStrengthLimit2Codes.length > 0 ? (
                  <div className="rules__summary-labels">
                    {srStrengthLimit2Codes.slice(0, 3).map((row, index) => (
                      <p key={index} className="common__label ">
                        {row.code}
                      </p>
                    ))}
                    {srStrengthLimit2Codes.length > 3 && <p className="common__label ">...</p>}
                  </div>
                ) : null}
              </span>
            }
            descriptionNode={
              <div className="rules__description">
                <p>以下の力技を選択中(制限中)です。</p>
                <div className="rules__description-label-box">
                  {([ElementGroup.EG2, ElementGroup.EG3] as ElementGroup[]).map((group) => (
                    <React.Fragment key={group}>
                      <div key={group}>
                        <p>{getGroupName(selectEvent, group)}</p>
                        <p className="rules__description-labels">
                          {srStrengthLimit2Codes.filter((row) => row.elementGroup === group).length > 0 ? (
                            srStrengthLimit2Codes
                              .filter((row) => row.elementGroup === group)
                              .map((row, index) => (
                                <span key={index} className="common__label ">
                                  {row.code}.{row.typeName}
                                </span>
                              ))
                          ) : (
                            <span>選択していません</span>
                          )}
                        </p>
                      </div>
                      {group !== ElementGroup.EG3 && <p className="rules__section-line--without-margin" />}
                    </React.Fragment>
                  ))}
                </div>
                <p className="rules__section-line" />
                <p>
                  終末姿勢が同一の力静止技は
                  <span style={{ fontWeight: "bold" }}>EG2とEG3で1回ずつ</span>
                  使用できます。
                </p>
                <p>・OK例:異なるEGで終末姿勢が同一</p>
                <table className="rules__table-table">
                  <tbody>
                    <tr className="rules__table-row">
                      <td className="rules__table-cell rules__table-cell--3rem">EG2</td>
                      <td className={`rules__table-cell rules__table-cell--12rem rules__table-cell--left`}>
                        II52.アザリアン
                      </td>
                    </tr>
                    <tr className="rules__table-row">
                      <td className="rules__table-cell rules__table-cell--3rem">EG3</td>
                      <td className={`rules__table-cell rules__table-cell--12rem rules__table-cell--left`}>
                        III16.ホンマ十字懸垂
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p>・NG例:同一EGで終末姿勢が同一</p>
                <table className="rules__table-table">
                  <tbody>
                    <tr className="rules__table-row">
                      <td className="rules__table-cell rules__table-cell--3rem">EG3</td>
                      <td className={`rules__table-cell rules__table-cell--12rem rules__table-cell--left`}>
                        III47.後方け上がり中水平
                      </td>
                    </tr>
                    <tr className="rules__table-row">
                      <td className="rules__table-cell rules__table-cell--3rem">EG3</td>
                      <td className={`rules__table-cell rules__table-cell--12rem rules__table-cell--left`}>
                        III71.後ろ振り上がり中水平
                      </td>
                    </tr>
                  </tbody>
                </table>
                {/* <p>脚前挙と脚上挙の2姿勢については別の姿勢として扱います。</p>
                <p>・OK例:同一EGで脚前挙と脚上挙</p>
                <table className="rules__table-table">
                  <tbody>
                    <tr className="rules__table-row">
                      <td className="rules__table-cell rules__table-cell--3rem">EG3</td>
                      <td className={`rules__table-cell rules__table-cell--12rem rules__table-cell--left`}>III2.前振り上がり脚前挙</td>
                    </tr>
                    <tr className="rules__table-row">
                      <td className="rules__table-cell rules__table-cell--3rem">EG3</td>
                      <td className={`rules__table-cell rules__table-cell--12rem rules__table-cell--left`}>III3.前振り上がり脚上挙</td>
                    </tr>
                  </tbody>
                </table>
                <p> ・NG例:同一EGで終末姿勢が同一 </p>
                <table className="rules__table-table">
                  <tbody>
                    <tr className="rules__table-row">
                      <td className="rules__table-cell rules__table-cell--3rem">EG3</td>
                      <td className={`rules__table-cell rules__table-cell--12rem rules__table-cell--left`}>
                        III2.前振り上がり脚前挙
                      </td>
                    </tr>
                    <tr className="rules__table-row">
                      <td className="rules__table-cell rules__table-cell--3rem">EG3</td>
                      <td className={`rules__table-cell rules__table-cell--12rem rules__table-cell--left`}>
                        III8.け上がり脚前挙
                      </td>
                    </tr>
                  </tbody>
                </table> */}
              </div>
            }
            show={selectEvent === Events.つり輪}
          />
          {/* 跳馬_グループ制限 */}
          <RoutineRule
            summaryNode={
              <span className="rules__summary-title">
                {RuleName(Rules.跳馬_グループ制限)}
                {routine.length > 0 ? (
                  <div className="rules__summary-labels">
                    {routine.map((element, index) => (
                      <p key={index} className="common__label ">
                        {/* {Object.entries(ElementGroup).find(([key, value]) => value === element.element_group) || ""} */}
                        {Object.keys(ElementGroup).find(
                          (key) => ElementGroup[key as keyof typeof ElementGroup] === element.element_group
                        ) || ""}
                      </p>
                    ))}
                  </div>
                ) : null}
              </span>
            }
            descriptionNode={
              <div className="rules__description">
                <p>種目別において、選手は2つの跳躍を行います。</p>
                <p>
                  2つの跳躍は<span style={{ fontWeight: "bold" }}>異なるグループ</span>
                  から選択する必要があります。
                </p>
              </div>
            }
            show={selectEvent === Events.跳馬}
          />
          {/* 跳馬_2技制限 */}
          <RoutineRule
            summaryNode={
              <span className="rules__summary-title">
                {RuleName(Rules.跳馬_2技制限)}
                {routine.length === 2 ? <p className="common__label ">✔️</p> : null}
              </span>
            }
            descriptionNode={
              <div className="rules__description">
                <p>種目別において、選手は2つまで跳躍を行います。</p>
              </div>
            }
            show={selectEvent === Events.跳馬}
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.平行棒}
            routine={routine}
            categorizedElements={categorizedElements}
            title="宙返り技制限(ドミトリエンコ系)"
            targetElementType={ElementType.平行棒_宙返り技制限_ドミトリエンコ系}
            descriptionSentence="以下の種類の宙返り技は1演技中1つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.平行棒}
            routine={routine}
            categorizedElements={categorizedElements}
            title="宙返り技制限(ハラダ系)"
            targetElementType={ElementType.平行棒_宙返り技制限_ハラダ系}
            descriptionSentence="以下の種類の宙返り技は1演技中1つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.平行棒}
            routine={routine}
            categorizedElements={categorizedElements}
            title="宙返り技制限(パフニュク系)"
            targetElementType={ElementType.平行棒_宙返り技制限_パフニュク系}
            descriptionSentence="以下の種類の宙返り技は1演技中1つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.平行棒}
            routine={routine}
            categorizedElements={categorizedElements}
            title="宙返り技制限(モリスエ系)"
            targetElementType={ElementType.平行棒_宙返り技制限_モリスエ系}
            descriptionSentence="以下の種類の宙返り技は1演技中1つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.平行棒}
            routine={routine}
            categorizedElements={categorizedElements}
            title="宙返り技制限(爆弾カット系)"
            targetElementType={ElementType.平行棒_宙返り技制限_爆弾カット系}
            descriptionSentence="以下の種類の宙返り技は1演技中1つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.平行棒}
            routine={routine}
            categorizedElements={categorizedElements}
            title="宙返り技制限(前方ダブル系)"
            targetElementType={ElementType.平行棒_宙返り技制限_前方ダブル腕支持系}
            descriptionSentence="以下の種類の宙返り技は1演技中1つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.平行棒}
            routine={routine}
            categorizedElements={categorizedElements}
            title="宙返り技制限(ベーレ系)"
            targetElementType={ElementType.平行棒_宙返り技制限_ベーレ系}
            descriptionSentence="以下の種類の宙返り技は1演技中1つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.平行棒}
            routine={routine}
            categorizedElements={categorizedElements}
            title="宙返り技制限(フォキン系)"
            targetElementType={ElementType.平行棒_宙返り技制限_フォキン系}
            descriptionSentence="以下の種類の宙返り技は1演技中1つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.平行棒}
            routine={routine}
            categorizedElements={categorizedElements}
            title="宙返り技制限(タナカ系)"
            targetElementType={ElementType.平行棒_宙返り技制限_タナカ系}
            descriptionSentence="以下の種類の宙返り技は1演技中1つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.平行棒}
            routine={routine}
            categorizedElements={categorizedElements}
            title="宙返り技制限(ギャニオン系)"
            targetElementType={ElementType.平行棒_宙返り技制限_ギャニオン系}
            descriptionSentence="以下の種類の宙返り技は1演技中1つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.平行棒}
            routine={routine}
            categorizedElements={categorizedElements}
            title="宙返り技制限(テハダ系)"
            targetElementType={ElementType.平行棒_宙返り技制限_テハダ系}
            descriptionSentence="以下の種類の宙返り技は1演技中1つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.平行棒}
            routine={routine}
            categorizedElements={categorizedElements}
            title="車輪系制限"
            targetElementType={ElementType.平行棒_車輪系}
            descriptionSentence="以下の車輪系の技は1演技に2つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.平行棒}
            routine={routine}
            categorizedElements={categorizedElements}
            title="棒下宙返り系制限"
            targetElementType={ElementType.平行棒_棒下宙返り系}
            descriptionSentence="以下の棒下宙返り系の技は1演技に2つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.平行棒}
            routine={routine}
            categorizedElements={categorizedElements}
            title="アーム倒立系制限"
            targetElementType={ElementType.平行棒_アーム倒立系}
            descriptionSentence="以下のアーム倒立系の技は1演技に2つまで使用できます。"
          />
          {/* 平行棒_単棒倒立系制限 */}
          <RoutineRule
            summaryNode={
              <span className="rules__summary-title">
                {RuleName(Rules.平行棒_単棒倒立系制限)}
                {/* {pbOneRailLimitCodes.length > 0 ? (
                  <div className="rules__summary-labels">
                    <p className="common__label">✔️</p>
                  </div>
                ) : null} */}
              </span>
            }
            descriptionNode={
              <div className="rules__description">
                <p>単棒倒立で終わる振動技は、単棒倒立で始まるヒーリー系に繋げない場合無効になります。</p>
                <p>単棒から始まるヒーリー系は 単棒倒立で終了する振動技にのみ繋げることができます。</p>
                <p>対象の技は以下のとおりです。</p>
                <p className="rules__section-line" />
                <p>単棒倒立で終わる技</p>
                <table className="rules__table-table">
                  <tbody>
                    {pbOneRailEndElements.map((element, index) => {
                      const foundElement = pbOneRailLimitCodes.find(
                        (routineElement) => routineElement.id === element.id
                      );

                      return (
                        <tr key={index} className="rules__table-row">
                          <td
                            className={`rules__table-cell rules__table-cell--left ${
                              foundElement && "rules__table-cell--active"
                            }
                            ${foundElement && foundElement.is_qualified === false && "rules__table-cell--limit"}`}
                          >
                            {element.code}.{element.alias || element.name}
                            {foundElement && (foundElement.is_qualified ? " (選択中 / 有効)" : " (選択中 / 無効)")}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <p>単棒倒立から始まるヒーリー系</p>
                <table className="rules__table-table">
                  <tbody>
                    {pbOneRailBeginElements.map((element, index) => (
                      <tr key={index} className="rules__table-row">
                        {pbOneRailLimitCodes.find(
                          (routineElement) => routineElement.id === element.id && routineElement.is_qualified
                        ) ? (
                          <td className="rules__table-cell rules__table-cell--left rules__table-cell--active">
                            {element.code}.{element.alias || element.name} (選択中)
                          </td>
                        ) : (
                          <React.Fragment>
                            {checkOneRailBeginLimit(routine, element) ? (
                              <td className="rules__table-cell rules__table-cell--left rules__table-cell--limit">
                                {element.code}.{element.alias || element.name} (選択不可)
                              </td>
                            ) : (
                              <td className="rules__table-cell rules__table-cell--left">
                                {element.code}.{element.alias || element.name} (選択可能)
                              </td>
                            )}
                          </React.Fragment>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
            show={selectEvent === Events.平行棒}
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.鉄棒}
            routine={routine}
            categorizedElements={categorizedElements}
            title="アドラー系制限"
            targetElementType={ElementType.鉄棒_アドラー系}
            descriptionSentence="以下のアドラー系は1演技に2つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.鉄棒}
            routine={routine}
            categorizedElements={categorizedElements}
            title="手放し技制限(トカチェフ系)"
            targetElementType={ElementType.鉄棒_手放し技制限_トカチェフ系}
            descriptionSentence="以下の種類の手放し技は1演技中2つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.鉄棒}
            routine={routine}
            categorizedElements={categorizedElements}
            title="手放し技制限(コバチ系)"
            targetElementType={ElementType.鉄棒_手放し技制限_コバチ系}
            descriptionSentence="以下の種類の手放し技は1演技中2つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.鉄棒}
            routine={routine}
            categorizedElements={categorizedElements}
            title="手放し技制限(ギンガー系)"
            targetElementType={ElementType.鉄棒_手放し技制限_ギンガー系}
            descriptionSentence="以下の種類の手放し技は1演技中2つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.鉄棒}
            routine={routine}
            categorizedElements={categorizedElements}
            title="手放し技制限(イェーガー系)"
            targetElementType={ElementType.鉄棒_手放し技制限_イェーガー系}
            descriptionSentence="以下の種類の手放し技は1演技中2つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.鉄棒}
            routine={routine}
            categorizedElements={categorizedElements}
            title="手放し技制限(マルケロフ系)"
            targetElementType={ElementType.鉄棒_手放し技制限_マルケロフ系}
            descriptionSentence="以下の種類の手放し技は1演技中2つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.鉄棒}
            routine={routine}
            categorizedElements={categorizedElements}
            title="手放し技制限(ゲイロード系)"
            targetElementType={ElementType.鉄棒_手放し技制限_ゲイロード系}
            descriptionSentence="以下の種類の手放し技は1演技中2つまで使用できます。"
          />
          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.鉄棒}
            routine={routine}
            categorizedElements={categorizedElements}
            title="ひねり技制限(ヒーリー系)"
            targetElementType={ElementType.鉄棒_ひねり技制限_ヒーリー系}
            descriptionSentence="以下の種類のひねり技は1演技中1つまで使用できます。"
          />

          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.鉄棒}
            routine={routine}
            categorizedElements={categorizedElements}
            title="ひねり技制限(リバルコ系)"
            targetElementType={ElementType.鉄棒_ひねり技制限_リバルコ系}
            descriptionSentence="以下の種類のひねり技は1演技中1つまで使用できます。"
          />

          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.鉄棒}
            routine={routine}
            categorizedElements={categorizedElements}
            title="ひねり技制限(シュタルダーリバルコ系)"
            targetElementType={ElementType.鉄棒_ひねり技制限_シュタルダーリバルコ系}
            descriptionSentence="以下の種類のひねり技は1演技中1つまで使用できます。"
          />

          <SimpleTypeCountRule
            selectEvent={selectEvent}
            showEvent={Events.鉄棒}
            routine={routine}
            categorizedElements={categorizedElements}
            title="ひねり技制限(キンテロ系)"
            targetElementType={ElementType.鉄棒_ひねり技制限_キンテロ系}
            descriptionSentence="以下の種類のひねり技は1演技中1つまで使用できます。"
          />
        </div>
      </div>
    </>
  );
};
