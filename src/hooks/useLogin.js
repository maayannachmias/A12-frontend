import { useState } from "react"
import { useAuthContext } from "./useAuthContext"

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const useLogin = () => {
    const [error,setError] = useState(null)
    const [isLoading,setIsLoading] = useState(null)
    const {dispatch} = useAuthContext()

    const login = async (email,password) => {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`${BACKEND_URL}/api/user/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        });
        
        if (!response.ok){
            setIsLoading(false);
            const errorResponse = await response.text(); // Attempt to read text response
            try {
                const errorJson = JSON.parse(errorResponse);
                setError(errorJson.error);
            } catch {
                setError("An unknown error occurred.");
            }
            return; // Important to return here to avoid further processing
        }
        
        const json = await response.json();
        // The rest of your success logic
        if (!response.ok){
            setIsLoading(false)
            setError(json.error)
        }

        if(response.ok){
            //save the user to local storage
            localStorage.setItem('user', JSON.stringify(json))
            //update the auth context
            dispatch({type: 'LOGIN', payload: json})
            setIsLoading(false)
            setError(null)
        }
    }

    return {login, isLoading, error}
}