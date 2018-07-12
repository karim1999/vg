const initialState = {
    country: '',
    city: '',
    phone: '',
    name: '',
    email: '',
    password: '',
    description: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    amount: 0,
    idea: '',
    type: '',
    referral: '',
    how: ''
};
export const currentUser= (state = initialState, action) => {
    switch (action.type){
        case "SET_DATA":
            return { ...state, [action.key]: action.value };
        default:
            return state;
    }
};
export const setData = (key, value) => ({
    type: 'SET_USER',
    key,
    value
});