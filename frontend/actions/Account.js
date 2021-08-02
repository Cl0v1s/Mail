import { createSlice } from "@reduxjs/toolkit";
import { Account } from '../model/actions';

const use = (account) => async (dispatch) => {
    await Account.init(account.name, account.key, account.imap, account.smtp);
    await Account.use(account);
    dispatch(AccountSlice.actions.used(account));
}

export const AccountSlice = createSlice({
    name: 'Account',
    initialState: {
        current: {
            name: null,
            key: null,
            imap: null,
            smtp: null,
        }
    },
    reducers: {
        used: (state, action) => {
            const account = action.payload;
            state.current = account;
        }
    }
});

export { use };
export const { used } = AccountSlice.actions;

export default AccountSlice.reducer;

