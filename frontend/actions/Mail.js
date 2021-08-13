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

const get = (_mail) => async (dispatch, getState) => {
    console.log('getting');
    console.log(_mail);
    const mail = await Mail.get(_mail);
    console.log(mail);
    dispatch(MailSlice.actions.getted(mail));
};

export const MailSlice = createSlice({
    name,
    initialState: window.localStorage.getItem(name)
    ? JSON.parse(window.localStorage.getItem(name))
    : {
        list: [],
        current: null,
    },
    reducers: {
        listed: (state, actions) => {
            state.list = actions.payload;
            window.localStorage.setItem(name, JSON.stringify(state));
        },
        getted: (state, actions) => {
            state.current = actions.payload;
            window.localStorage.setItem(name, JSON.stringify(state));
        }
    } 
});

export { list, get };
export const { listed, getted } = MailSlice.actions;

export default MailSlice.reducer;

