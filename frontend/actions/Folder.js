import { createSlice } from "@reduxjs/toolkit";
import { Folder } from './../model/actions';

const list =  () => {
    return async (dispatch) => {
        const folders = await Folder.list();
        dispatch(FolderSlice.actions.listed(folders));
    }
};

export const FolderSlice = createSlice({
    name: 'Folder',
    initialState: {
        list: []
    },
    reducers: {
        listed: (state, actions) => {
            state.list = actions.payload;
        }
    } 
});

export { list };
export const { listed } = FolderSlice.actions;

export default FolderSlice.reducer;

