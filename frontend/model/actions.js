import Backend from './Backend';

const Account = {
        init: async (name, key, imap, smtp) => {
                const response = await Backend.ask({
                        type: "initAccount",
                        content: {
                                name,
                                key,
                                imap,
                                smtp
                        }
                });
                return response.result;
        },

        use: async (account) => {
                const response = await Backend.ask({
                        type: "useAccount",
                        content: {
                                account,
                        }
                });
                return response.result;
        },

        list: async () => {
                const response = await Backend.ask({
                        type: "listAccount",
                });
                return response.result;
        },

        remove: async (account) => {
                const response = await Backend.ask({
                        type: "removeAccount",
                        content: {
                                account,
                        }
                });
                return response.result;     
        },
};

const Folder = {
        create: async (folder) => {
                const response = await Backend.ask({
                        type: "createFolder",
                        content: {
                                folder,
                        }
                });
                return response.result;   
        },

        list: async () => {
                const response = await Backend.ask({
                        type: "listFolder",
                });
                return response.result;     
        },

        remove: async (folder) => {
                const response = await Backend.ask({
                        type: "removeFolder",
                        content: {
                                folder,
                        }
                });
                return response.result;      
        }
};

const Mail = {
        list: async (folder, filter) => {
                const response = await Backend.ask({
                        type: "listMails",
                        content: {
                                folder,
                                filter
                        }
                });
                return response.result;
        },
        get: async (mail) => {
                const response = await Backend.ask({
                        type: "getMail",
                        content: {
                                mail
                        }
                });
                return response.result;   
        },
        copy: async (mail, to) => {
                const response = await Backend.ask({
                        type: "copyMail",
                        content: {
                                to,
                                mail
                        }
                });
                return response.result;
        },
        remove: async (mail) => {
                const response = await Backend.ask({
                        type: "removeMail",
                        content: {
                                mail
                        }
                });
                return response.result;
        }
}


export {
        Account,
        Folder,
        Mail
}