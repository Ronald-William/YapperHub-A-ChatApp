import {useParams } from 'react-router-dom'
const Chat = ()=>{
    const {id} = useParams();
    return(
        <>
            <h1>This is the Chat page with id: {id}</h1>
        </>
    )
}
export default Chat;