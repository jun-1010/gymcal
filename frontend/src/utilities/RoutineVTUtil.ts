import { RoutineElement } from "./RoutineUtil";

export const calculateVTScore = (routine: RoutineElement[]) => {
  if (routine.length === 1) {
    return routine[0].difficulty / 10;
  }
  if (routine.length === 2) {
    return (routine[0].difficulty / 10 + routine[1].difficulty / 10) / 2;
  }
  return 0;
};
