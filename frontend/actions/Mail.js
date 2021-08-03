import { createSlice } from "@reduxjs/toolkit";
import { Mail } from './../model/actions';

const name = 'Mail';

const list = (folder, filters = null) =>  async (dispatch, getState) => {
    const mails = await Mail.list(folder, filters);
    dispatch(MailSlice.actions.listed({
        ...getState().list,
        [folder.name]: mails,
    }));
};

export const MailSlice = createSlice({
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
export const { listed } = MailSlice.actions;

export default MailSlice.reducer;

