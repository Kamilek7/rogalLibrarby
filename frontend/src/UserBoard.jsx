import { useState, useEffect } from 'react'

const UserBoard = ({setCookie, userID, booksFromOtherPart}) => {

    const [books, setBooks] = useState([])

    const wyloguj = () => {
        setCookie("loginID", "")
    }

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


    const callBack = (bookData) => {
        
        return (
        <div class='bookContainerUser'>
            {bookData.map((book) => {
                var autorzy =  book['autorzy'].replaceAll("\'", "").replace("(","").replace(")", "").split(",");
                var fontSize = 2 - Math.max((book["tytul"].length)/190, 0);
                var buttons = [];
                var color = "transparent";

                var finishButt = {class: 'read', icon: "icon-ok", func: (val) => {finish(val)}};
                var readButt = {class: 'read', icon: "icon-book-open", func: (val) => {read(val)}};
                var holdButt = {class: 'onHold', icon: "icon-error-alt", func: (val) => {hold(val)}};

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
                    <div class='bookFound' style={{"borderColor" : color}}>
                        <img class='cover' src={book["obraz"]} ></img>
                        <div class='vert-buttons'>
                            {buttons.map(button => {
                                return (<button onClick={ () =>{button.func(book["ID"])}} class={button.class}><i class={button.icon}></i></button>)
                            })}
                            <button class='remove' onClick={() => {remove(book.ID)}}><i class='icon-trash-empty' ></i></button>
                        </div>
                    </div>
                )
            })}
        </div>
        )
    }

    const getBooks = async () => {
        const url = "https://librarby-backend.rogalrogalrogalrogal.online/getBooks/" + userID
        const response = await fetch(url);
        const bookData = await response.json();
        setBooks(bookData.books);
        return callBack(bookData.books);
    }

    useEffect(() => {
        getBooks();
    }, [booksFromOtherPart])

    return <div class='contentBox'>
        <div class='divTitle'>Twoje książki</div>
        {callBack(books)}
        <button onClick={wyloguj}>Wyloguj się</button>
    </div>
}
export default UserBoard