import { useState, useEffect } from 'react'
import ModalWindow from './ModalWindow';

const NavComponent = ({userID, wyloguj}) => {
    const [modalState, setModalState]= useState(1)
    const [modalStateVisibility, setModalStateVisibilty]= useState(false)
    return( 
        <div class='navigation'>
            <div class='hori-buttons'>
                <button onClick={wyloguj}><i class='icon-logout'></i></button>
                <button class='mainBtn' onClick={()=>{setModalState(1); setModalStateVisibilty(true);}}><i class='icon-plus-squared'></i></button>
                <button onClick={()=>{setModalState(2); setModalStateVisibilty(true);}}><i class='icon-user'></i></button>
            </div>
            <ModalWindow tryb={modalState} visibility={modalStateVisibility} setVisibility={setModalStateVisibilty} userID={userID}></ModalWindow>
        </div>
        )
}

export default NavComponent