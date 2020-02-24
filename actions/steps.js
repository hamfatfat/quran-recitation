import {
  START_STEP_START,
  START_STEP_FINISH,
  UPDATE_REVISIONS,
  UPDATE_SCHEDULE,
  START_STUDENT_PROGRESS_START,
  START_STUDENT_PROGRESS_FINISH,
} from '../actionconstant';
import {
  stepsById,
  getAllStudentProgressForUserByStepId,
  updateStudentProgress,
  saveStudentProgress,
} from '../util/APIUtils';
import {cloneDeep} from 'lodash'
const getSteps = stepId => {
  return (dispatch, state) => {
    dispatch({type: START_STEP_START, data: []});
    stepsById(stepId).then(res => {
      dispatch({type: START_STEP_FINISH, data: res});
      dispatch({type: UPDATE_REVISIONS, revisions: res.revision});
      dispatch({type: UPDATE_SCHEDULE, schedules: res.schedule});
    });
  };
};
const getStudentProgressForUserByStepId = (userId, stepId) => {
  return (dispatch, state) => {
    dispatch({type: START_STUDENT_PROGRESS_START, studentProgress: []});
    getAllStudentProgressForUserByStepId(userId, stepId).then(res => {
      dispatch({type: START_STUDENT_PROGRESS_FINISH, studentProgress: res});
    });
  };
};

const saveAndUpdateStudentProgress = studentProgress => {
  return (dispatch, getState) => { 
    let allStudentProgress = getState().stepReducer.studentProgress;
    const findExisting = allStudentProgress.find(
      x => x.recitationstep_id === studentProgress.recitationstep_id,
    );
    if (findExisting !== undefined && findExisting !== null) {
      updateStudentProgress(studentProgress).then(res => {
        allStudentProgress = allStudentProgress.map(x => {
          if (x.recitationstep_id === res.recitationstep_id) {
            return res;
          } else return x;
        });
        dispatch({
          type: START_STUDENT_PROGRESS_FINISH,
          studentProgress: allStudentProgress,
        });
      });
    } else {
      saveStudentProgress(studentProgress).then(res => {
        allStudentProgress.push(res);
        dispatch({
          type: START_STUDENT_PROGRESS_FINISH,
          studentProgress: allStudentProgress,
        });
      });
    }
  };
};
const setRevisions = revisions => {
  return (dispatch, state) => {
    dispatch({type: UPDATE_REVISIONS, revisions});
  };
};
const setSchedules = schedules => {
  return (dispatch, state) => {
    dispatch({type: UPDATE_SCHEDULE, schedules});
  };
};
const deleteStepAction = id => {
  return (dispatch, getState) => {
    let steps = getState().stepReducer.data;
    steps = steps.filter(x => x.id !== id);
    dispatch({type: START_STEP_FINISH, data: steps});
  };
};

export {
  getSteps,
  setRevisions,
  setSchedules,
  deleteStepAction,
  getStudentProgressForUserByStepId,
  saveAndUpdateStudentProgress,
};
