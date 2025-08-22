import {useState, useEffect} from 'react'

const BookOnBoard = ({book, buttons, getBooks, categories, color, statuses}) => {
    const [infoId, setInfoId] = useState(null);

    const remove = async (bookID) => {
        const url = "https://librarby-backend.rogalrogalrogalrogal.online/removeBook/" + bookID;
        const options = {
            method:"DELETE"
        }
        const response = await fetch(url, options);
        getBooks();
    }

    const passNewStatus = async (id, status) => {
        const options = {
            method: "PATCH"
        }
        const url = "https://librarby-backend.rogalrogalrogalrogal.online/changeStatus/" + id + "/" + status;
        const response = await fetch(url, options);
        getBooks();
    }

    const passNewCategories = async (id, e) => {
        const form = e.currentTarget;
        const data = new FormData(form);
        const catStr = data.getAll("categories");
        var cats = []
        catStr.forEach((value) => {
            cats.push(parseInt(value))
        })
        const dane = {
            categories: cats
        }
        const url = "https://librarby-backend.rogalrogalrogalrogal.online/changeCategories/" + id;
        const options = {
            method: "PATCH",
            headers:  {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(dane)
        }
        const response = await fetch(url, options);
        getBooks();
    }

    return (
        <div key={book["ID"]} class='bookFound' style={{borderBottom: "5px solid " + color}}>
            <img class='cover' src={book["obraz"]} ></img>
            <div class='vert-buttons'>
                {buttons.map(button => {
                    return (<button onClick={ () =>{button.func(book["ID"])}} class={button.class}><i class={button.icon}></i></button>)
                })}
                <button class='read' onClick={() => {setInfoId(book["ID"])}}><i class='icon-dot-3' ></i></button>
            </div>
            <div class={(infoId==book["ID"]) ? 'bookInfo' : "bookInfo-hidden"}>
                Kategorie:
                <form onChange={(e) => {passNewCategories(book["ID"], e)}}>
                    <div style={{"display":"flex", "margin":"auto"}}>
                        <div class='categories'>
                            {categories.map((cat) => {
                                return (<div style={{"display":"flex", "margin":"auto"}}><input name='categories' defaultChecked={book["kategoria"].includes(cat["ID"])} type="checkbox"  value={cat["ID"]}></input>{cat["nazwa"]}</div>)
                            })}
                        </div>
                    </div>
                </form>
                <div class='statusSelect'>
                    Zmień status:<br></br>
                    <select onChange={(e) => {passNewStatus(book["ID"], e.target.value)}} defaultValue={parseInt(book["status"])}>
                        {statuses.map(status => {
                            return (<option value={status.id}>{status.name}</option>)
                        })}
                    </select>
                </div>
                <div class='hori-buttons'>
                    <button class='remove' onClick={() => {remove(book["ID"])}}><i class='icon-trash-empty' ></i></button>
                    <button class='read' onClick={() => {setInfoId(null)}}><i class='icon-dot-3' ></i></button>
                </div>
            </div>
        </div>
    )
}
export default BookOnBoard