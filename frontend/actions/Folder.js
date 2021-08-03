import { createSlice } from "@reduxjs/toolkit";
import { Folder } from './../model/actions';

const name = 'Folder';

const list =  () => {
    return async (dispatch) => {
        const folders = await Folder.list();
        dispatch(FolderSlice.actions.listed(folders));
    }
};

export const FolderSlice = createSlice({
    name,
    initialState: window.localStorage.getItem(name)
    ? JSON.parse(window.localStorage.getItem(name))
    : {
        list: []
    },
    reducers: {
        listed: (state, actions) => {
            state.list = actions.payload;
            window.localStorage.setItem(name, JSON.stringify(state));
        }
    } 
});

export { list };
export const { listed } = FolderSlice.actions;

export default FolderSlice.reducer;

