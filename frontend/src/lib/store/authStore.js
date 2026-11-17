
import { create } from 'zustand'
import { persist } from 'zustand/middleware'


const useAuthStore = create(
    
    persist(
        (set, get) =>({

            user: null,
            token: null,
            isAuthenticated: false, 

            // set user data and token after successfully login

            setAuth:(userData, token) => set ({
               user: userData,
               token,
               isAuthenticated: true 
            }),

            // clear userData and token after logout

            clearAuth: ()=> set({

                user:null,
                token:null,
                isAuthenticated:false
            }),


       

        // get token (for outside of react componens)
        
            getToken: () => get().token

            }),    // get waxaa loo isticmaala outside react 

            // marka laxaraynayo xogtaoo lagu xraynayo local storage ka 

            {
                name: "Auth-storage",
                partialize: (state) =>({
                    user: state.user,
                    token: state.token,
                    isAuthenticated: state.isAuthenticated
                })
            }
            
        

    )
)

export default useAuthStore;