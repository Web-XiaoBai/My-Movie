import { IMovie, MovieService } from "../../services/MovieService";
import { IAction } from "./ActionTypes";
import { ICondition, MovieSwitch } from "../../services/CommonTypes";
import { ThunkAction } from 'redux-thunk';
import { IRootReducer } from "../store";

/**
 * 设置电影数组
 */
export type SetMovieAction = IAction<'_setMovie', {
    movie: IMovie[];
    total: number;
}>;
function setMovieAction(movie: IMovie[], total: number): SetMovieAction {
    return {
        type: '_setMovie',
        payload: {
            movie,
            total
        }
    };
};

/**
 * 设置查询条件
 */
export type SetConditionAction = IAction<'_setCondition', ICondition>;
function setConditionAction(condition: ICondition): SetConditionAction {
    return {
        type: '_setCondition',
        payload: condition
    };
};

/**
 * 设置是否正在加载
 */
export type SetLoadingAction = IAction<'_setLoading', boolean>;
function setLoadingAction(isLoading: boolean): SetLoadingAction {
    return {
        type: '_setLoading',
        payload: isLoading
    };
};

/**
 * 删除一个电影
 */
export type DeleteMovieAction = IAction<'_deleteMovie', string>;
function deleteMovieAction(id: string): DeleteMovieAction {
    return {
        type: '_deleteMovie',
        payload: id
    };
};

/**
 * 更改开关状态
 */
export type CheckedSwitchAction = IAction<'_checkedSwitch', {
    type: MovieSwitch
    newVal:boolean
    id: string
}>;
function checkedSwitchAction(type: MovieSwitch, newVal:boolean, id: string): CheckedSwitchAction {
    return {
        type: '_checkedSwitch',
        payload: {
            type,
            newVal,
            id
        }
    }
}

export type MovieActions = SetMovieAction | SetConditionAction | SetLoadingAction | DeleteMovieAction | CheckedSwitchAction;

// 副作用处理
/**
 * 请求数据
 * @param condition 条件
 */
function fetchMovies(condition: ICondition): ThunkAction<Promise<void>, IRootReducer, any, MovieActions> {
    return async (dispatch, getState) => {
        dispatch(setLoadingAction(true)); // 设置加载状态
        dispatch(setConditionAction(condition)); // 设置条件状态
        const curCondition = getState().movie.condition; // 获取条件状态
        const resp = await MovieService.find(curCondition); // 获取服务器数据
        dispatch(setMovieAction(resp.data, resp.total)); // 更改仓库数据
        dispatch(setLoadingAction(false)); // 设置加载状态
    }
}

/**
 * 根据ID删除数据
 * @param id 
 */
function deleteMovie(id: string): ThunkAction<Promise<void>, IRootReducer, any, MovieActions> {
    return async dispatch => {
        dispatch(setLoadingAction(true)); // 设置加载状态
        await MovieService.delete(id); // 根据ID删除数据库数据
        dispatch(deleteMovieAction(id)); // 根据ID删除仓库数据
        dispatch(setLoadingAction(false)); // 设置加载状态
    }
}

function checkedSwitchMovie(type: MovieSwitch, newVal:boolean, id: string): ThunkAction<Promise<void>, IRootReducer, any, MovieActions> {
    return async dispatch => {
        dispatch(setLoadingAction(true)); // 设置加载状态
        await MovieService.updata(id, {
            [type]: newVal
        }) // 更新服务器数据
        dispatch(checkedSwitchAction(type, newVal, id)); // 更改仓库数据
        dispatch(setLoadingAction(false)); // 设置加载状态
    }
}

export default {
    setMovieAction,
    setConditionAction,
    setLoadingAction,
    deleteMovieAction,
    fetchMovies,
    deleteMovie,
    checkedSwitchMovie
};
