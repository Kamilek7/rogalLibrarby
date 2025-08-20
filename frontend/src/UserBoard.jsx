import { useState, useEffect } from 'react'
import SmolSearch from './SmolSearch';

const UserBoard = ({setCookie, userID, booksFromOtherPart, wyloguj}) => {

    const [infoId, setInfoId] = useState(null);
    const [books, setBooks] = useState([]);
    const [categories, setCats] = useState([]);
    const [category, setCat] = useState(0);
    const [topModal, setModal] = useState(false);
    const [categoryName, setCategory] = useState("");

    const statuses = [{name: "Na półce", id: 1}, {name: "Czytane", id:2}, {name:"Ukończone", id:3}, {name:"Wstrzymane", id:4}]

    const read = async (bookID) =>  {
        const url = "https://librarby-backend.rogalrogalrogalrogal.online/readBook/" + bookID;
        const options = {
            method:"PATCH"
        }
        const response = await fetch(url, options);
        getBooks();
    }

    const hold = async (bookID) => {
        const url = "https://librarby-backend.rogalrogalrogalrogal.online/holdBook/" + bookID;
        const options = {
            method:"PATCH"
        }
        const response = await fetch(url, options);
        getBooks();
    }

    const finish = async (bookID) => {
        const url = "https://librarby-backend.rogalrogalrogalrogal.online/finishBook/" + bookID;
        const options = {
            method:"PATCH"
        }
        const response = await fetch(url, options);
        getBooks();
    }


    const remove = async (bookID) => {
        const url = "https://librarby-backend.rogalrogalrogalrogal.online/removeBook/" + bookID;
        const options = {
            method:"DELETE"
        }
        const response = await fetch(url, options);
        getBooks();
    }

    const progress = (books) =>
    {
        var booksRead = books.filter(book => book.status==3)
        return(
            <div>
                Stopień przeczytania ({booksRead.length}/{books.length}):
                <div class='progress'><div class='progressIn' style={{width:booksRead.length/books.length*100 + "%"}}></div></div>
            </div>
        )
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

    const callBack = (bookData) => {
        

        var finishButt = {class: 'read', icon: "icon-ok", func: (val) => {finish(val)}};
        var readButt = {class: 'read', icon: "icon-book-open", func: (val) => {read(val)}};
        var holdButt = {class: 'onHold', icon: "icon-error-alt", func: (val) => {hold(val)}};
        
        var onShelf = bookData.filter((book) => book.status==1)
        var reading = bookData.filter(book => book.status==2)
        var finished = bookData.filter(book => book.status==3)
        var onhold = bookData.filter(book => book.status==4)

        var books = [{name : "Na półce", data : onShelf}, {name: "Czytane", data: reading}, {name: "Przerwane", data : onhold}, {name: "Zakończone", data : finished}]
        
        return (
            <div>
                
                
                <div class='bookContainerUser'>
                    {
                        
                        books.map((bookers ) => {
                            if (bookers.data.length!=0)
                            return (<div class='bookContainerGrid'><div class='containerTitle'>{bookers.name} ({bookers.data.length})</div>{
                            (
                            bookers.data.map((book) => {
                            var buttons = [];
                            var color = "transparent";
                            switch(book.status)
                            {
                                case 1:
                                    buttons.push(readButt);
                                    color = "#444";
                                    break;
                                case 2:
                                    buttons.push(finishButt);
                                    buttons.push(holdButt);
                                    color = "#3b6354ff";
                                    break;
                                case 3:
                                    color = "#142b0a";
                                    break;
                                case 4:
                                    buttons.push(readButt);
                                    color = "#5e1414";
                                    break;
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
                            }))
                            }</div>)

                        })
                    }
                </div>
            </div>
        )
    }

    const getSelectors = async () => {
        const url = "https://librarby-backend.rogalrogalrogalrogal.online/getCategories/" + userID;
        const response = await fetch(url);
        const data  = await response.json();
        setCats(data.categories);
    }

    const printSelectors = () => {
        return (
            <div>
                <select style={{display:"block", margin: "auto"}} defaultValue={category} onChange={(e) => {setCat(e.target.value)}}>
                    <option value='0' >Wszystkie</option>
                    <option value='-1' >Nieskategoryzowane</option>
                    {categories.map((selector) => {
                        return (<option value={selector["ID"]}>{selector["nazwa"]}</option>)
                    })}
                </select>
                <button class='normalButt' onClick={() =>{setModal(true)}}>Dodaj więcej kategorii</button>
            </div>
        )
    }

    const getBooks = async (search="") => {

        const dane = {
            search: search
        }
        const options = {
            method: "POST",
            headers:  {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(dane)
        }
        const url = "https://librarby-backend.rogalrogalrogalrogal.online/getBooks/" + userID + "/" + category;
        const response = await fetch(url, options);
        const bookData = await response.json();
        setBooks(bookData.books);
        return callBack(bookData.books);
    }

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

    const modalRender = () => {
        return (
            <div class={(topModal)?"categoryAdd": "categoryAdd-hidden"}>
                <div class='divTitleMinor'>Dodaj nową kategorię książek</div>
                <input value={categoryName} onChange={(e) => {setCategory(e.target.value)}} type='text'></input>
                <button class='normalButt' onClick={(e) =>{newCategory(categoryName)}}>Dodaj kategorie</button>
            </div>
        )

    }

    useEffect(() => {
        getSelectors();
        getBooks();
    }, [booksFromOtherPart, category])

    return <div class='contentBox'>
        <div id='headerBox'>
            <div class='heading'>
                <div class='divTitleMinor'>Twoje książki</div>
                
                {printSelectors()}
                <SmolSearch callback={getBooks}></SmolSearch>
                {progress(books)}
                
                {modalRender()}
                
            </div>
            {callBack(books)}
        </div>
        <button onClick={wyloguj}>Wyloguj się</button>
    </div>
}
export default UserBoard