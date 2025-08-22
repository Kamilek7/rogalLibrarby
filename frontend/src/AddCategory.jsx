import { useState, useEffect } from 'react'




const ModalRender = ({getSelectors}) => {

    const [topModal, setModal] = useState(false);
    const [categoryName, setCategory] = useState("");

    const newCategory = async (name) => {
        setModal(false)
        const data = {name:name}
        const url = "https://librarby-backend.rogalrogalrogalrogal.online/addCategory/" + userID;
                const options = {
            method: "POST",
            headers:  {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(data)
        }
        const response = await fetch(url, options);
        getSelectors();
    }

    return (
        <div>
            <button class='normalButt' onClick={() =>{setModal(true)}}>Dodaj więcej kategorii</button>
            <div class={(topModal) ? "categoryAdd" : "categoryAdd-hidden"}>
                <div class='divTitleMinor'>Dodaj nową kategorię książek</div>
                <input value={categoryName} onChange={(e) => { setCategory(e.target.value) }} type='text'></input>
                <button class='normalButt' onClick={(e) => { newCategory(categoryName) }}>Dodaj kategorie</button>
                <button class='normalButt' onClick={() => { setModal(false) }}>Wroc</button>
            </div>
        </div>
    )
}

export default ModalRender