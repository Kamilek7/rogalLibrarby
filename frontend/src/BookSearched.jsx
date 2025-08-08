import { useState, useEffect} from 'react'
const BooksSearched = ({bookData, reset, userID}) => {
    
    const [fuck, react] = useState([])
    const addToCatalog = async (e, book) =>
    {
        e.preventDefault()
        const data = {
            data : book
        }
        const url = "https://librarby-backend.rogalrogalrogalrogal.online/addNewBookFromScratch/" + userID
        const options = {
            method: "POST",
            headers:  {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(data)
        }
        const response = await fetch(url, options)
        book["InDataBase"] = true;
        react(book);
    }

    return <div>
        <div class='divTitle'>Znalezione książki:</div>
        <div class='bookContainer'>
            {bookData["ksiazki"].map((book) => {
                var fontSize = 2 - Math.max((book["Title"].length)/190, 0);
                return (
                    <div class='bookFound'>
                        <img class='cover' src={book["Cover"]} ></img>
                        <div class='bookContent'>
                            <div class='title' style={{fontSize : `${fontSize}rem`}}>{book["Title"]}</div>
                            <div class='authors'>{book["Authors"].map((author)=> {return (<div class='author'>{author}</div>)})}</div>
                            <div class='bookData'>{book["Info"]}</div>
                        </div>
                        {userID ? (<div class='addToLibrary'>
                                        {book["InDataBase"] ?  (<button disabled>Już w katalogu</button>) :  (<button onClick={(e) => {addToCatalog(e, book)}}>Dodaj do katalogu</button>)}

                                    </div>) : ""}
                    </div>
                )
            })}
        </div>
        <button onClick={()=>{reset([])}}>Wróć</button>
    </div>
}

export default BooksSearched