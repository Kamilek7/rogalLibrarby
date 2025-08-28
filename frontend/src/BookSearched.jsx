import { useState, useEffect} from 'react'
const BooksSearched = ({bookData, userID}) => {
    
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
    var mobile = (window.innerHeight > window.innerWidth);

    return <div>
        <div class='divTitle'>Znalezione książki:</div>
        <div class='bookContainer'>
            {bookData["ksiazki"].map((book) => {
                var fontSize = 2 - Math.max((book["Title"].length)/190, 0);
                var fontSizeMobile = 4 - Math.max((book["Title"].length)/50, 0);

                var font = "";
                if (mobile)
                    font = `${fontSizeMobile}vh`;
                else
                    font = `${fontSize}rem`;
                return (
                    <div class='bookFound'>
                        <img class='cover' src={book["Cover"]} ></img>
                        <div class='bookContent'>
                            <div class='title' style={{fontSize :font }}>{book["Title"]}</div>
                            <div class='authors'>{book["Authors"].map((author)=> {return (<div class='author'>{author}</div>)})}</div>
                            <div class='bookData'>{book["Info"]}</div>
                        </div>
                        {userID ? (<div class='addToLibrary'>
                                        {book["InDataBase"] ?  (<button disabled><i class='icon-plus-squared'></i></button>) :  (<button onClick={(e) => {addToCatalog(e, book)}}><i class='icon-plus-squared'></i></button>)}

                                    </div>) : ""}
                    </div>
                )
            })}
        </div>
    </div>
}

export default BooksSearched