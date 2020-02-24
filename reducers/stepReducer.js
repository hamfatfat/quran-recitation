import {
  START_STEP_START,
  START_STEP_FINISH,
  UPDATE_REVISIONS,
  UPDATE_SCHEDULE,
  START_STUDENT_PROGRESS_START,
  START_STUDENT_PROGRESS_FINISH
} from '../actionconstant';
const step = {
  data: null,
  revisions: [],
  schedules: [],
  studentProgress: [],
  loading:false
};
import {cloneDeep} from 'lodash';
export default (state = step, action) => {
  switch (action.type) {
    case START_STEP_START:
      return {...state, data: null, revisions: [], schedules: []};
    case START_STEP_FINISH:
      return {
        ...state,
        data: action.data,
        revisions: action.data.revision.map((x, idx) => {
          x.index = idx + 1;
          return x;
        }),
        schedules: action.data.schedule,
      };
    case UPDATE_REVISIONS:
      return {
        ...state,
        revisions: action.revisions.map((x, idx) => {
          x.index = idx + 1;
          return x;
        }),
      };
    case UPDATE_SCHEDULE:
      return {...state, schedules: action.schedules};
    case START_STUDENT_PROGRESS_START:
      return {...state, studentProgress: action.studentProgress, loading:true};
    case START_STUDENT_PROGRESS_FINISH:
      return {...state, studentProgress: [...action.studentProgress], loading: false};
    default:
      return state;
  }
};
