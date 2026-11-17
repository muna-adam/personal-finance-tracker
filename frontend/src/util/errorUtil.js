

export const extractErrorMessage = (error) => {
    if(!error) return null;

    if(error.response?.data){
        const data = error.response.data

        // handle zod validation error (array format)

        if(data.errors && Array.isArray(data.errors)){
            return data.errors.map(err => err.message).join(',')
        }

        // sinle error message

        if(data.message){
            return data.message
        }

        if(data.error){
            return data.error
        }
    }

    

    if(error.response && !error.response){
        return "Network Error, Please check your connection"
    }

  

    if(error.message){
        return error.message
    }

    return 'something Went wrong please try again'

}