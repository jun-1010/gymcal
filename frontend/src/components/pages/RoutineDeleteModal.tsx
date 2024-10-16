import { useEffect, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningIcon from "@mui/icons-material/Warning";
import { Events, getEventKey } from "../../utilities/Type";
import { initialRoutines, RoutineElement, Routines } from "../../utilities/RoutineUtil";

interface RoutineDeleteModalProps {
  selectEvent: Events;
  setRoutine: React.Dispatch<React.SetStateAction<RoutineElement[]>>;
  setRoutines: React.Dispatch<React.SetStateAction<Routines>>;
  allowIndividualReset: boolean;
}

const RoutineDeleteModal = ({
  selectEvent,
  setRoutine,
  setRoutines,
  allowIndividualReset,
}: RoutineDeleteModalProps) => {
  const [deleteMenuOpen, setDeleteMenuOpen] = useState(false);
  const deleteMenuRef = useRef<HTMLDivElement>(null);
  const [resetTarget, setResetTarget] = useState(0);
  const [resetErrorMessage, setResetErrorMessage] = useState("");

  const handleClickOutside = (event: MouseEvent) => {
    if (deleteMenuRef.current && !deleteMenuRef.current.contains(event.target as Node)) {
      setResetTarget(0);
      setResetErrorMessage("");
      setDeleteMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleReset = () => {
    if (resetTarget === 0) {
      setResetErrorMessage("リセットする対象を選んでください");
      return;
    } else if (resetTarget === 2) {
      setRoutines(initialRoutines);
    }
    setResetTarget(0);
    setResetErrorMessage("");
    setRoutine([]);
    setDeleteMenuOpen(false);
  };

  return (
    <div className="routine__delete">
      <span className="routine__delete-icon">
        <DeleteIcon onClick={() => setDeleteMenuOpen(!deleteMenuOpen)} />
      </span>
      {deleteMenuOpen && (
        <div className="routine__delete-modal">
          <div className="routine__delete-menu" ref={deleteMenuRef}>
            <p className="routine__delete-title">演技構成のリセット</p>
            <p>リセットする対象を選んでください</p>
            <p className="routine__delete-line" />

            {allowIndividualReset && (
              <label className="routine__delete-label">
                <input type="radio" name="resetTarget" value="1" onChange={() => setResetTarget(1)} />
                <p>{getEventKey(selectEvent)}の演技構成</p>
              </label>
            )}

            <label className="routine__delete-label">
              <input type="radio" name="resetTarget" value="2" onChange={() => setResetTarget(2)} />
              <p>全種目の演技構成</p>
            </label>

            {resetErrorMessage && <p className="routine__delete-alert">{resetErrorMessage}</p>}

            <p className="routine__delete-line" />
            <table className="common__table routine__delete-table">
              <tbody>
                <tr className="common__table-row">
                  <td className="common__table-cell">
                    <WarningIcon color="error" />
                    この操作は元に戻せません
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="routine__delete-button-box">
              <div
                className="routine__delete-button"
                onClick={() => {
                  setResetTarget(0);
                  setDeleteMenuOpen(false);
                }}
              >
                キャンセル
              </div>
              <div className="routine__delete-button routine__delete-button--alert" onClick={handleReset}>
                リセットする
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutineDeleteModal;
