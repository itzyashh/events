import { Session } from "@supabase/supabase-js"
import axios from "axios"
import { useAuth } from "~/providers/AuthProvider"


const searchEndpoint = "https://api.mapbox.com/search/searchbox/v1"

const getSuggestions = async (q :string, searchArea: string | null, session_token: string) => {
    console.log('searchArea', searchArea)
    const res = await axios.get(`${searchEndpoint}/suggest`, {
        params: {
            q,
            access_token: 'pk.eyJ1IjoiaXR6eWFzaGgiLCJhIjoiY2t3bjVtb2ptMjJwNDJ4bWR2ZWV6eGpxNCJ9.wLqvp1MJxRyLfvw8W_S5QQ',
            session_token,
            proximity: searchArea
        }
    })
    return res.data
}


const retrievePlace = async (id: string, session_token: string) => {
    const res = await axios.get(`${searchEndpoint}/retrieve/${id}`, {
        params: {
            session_token,
            access_token: 'pk.eyJ1IjoiaXR6eWFzaGgiLCJhIjoiY2t3bjVtb2ptMjJwNDJ4bWR2ZWV6eGpxNCJ9.wLqvp1MJxRyLfvw8W_S5QQ'
        }
    })
    return res.data
}

export { getSuggestions, retrievePlace }