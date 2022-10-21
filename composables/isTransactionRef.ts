// TODO-TEST
export const isTransactionRefId = (id) => {
    return id.length >= 2 && id[0] == '[' && id[1] == '"'
} 