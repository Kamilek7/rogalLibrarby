import { useState } from 'react'

const SearchBar = ({callback, user}) => {
    const [title, setTitle] = useState("")
    const searchForTitle = async () => {
        var newTitle = title.replaceAll(" ", "+")
        if (typeof user == 'undefined')
            user = 0;
        const url = "https://librarby-backend.rogalrogalrogalrogal.online/booksSearchGoodReads/" + newTitle + "/" + user;
        const response = await fetch(url);
        if (response.status ==201)
        {
            const bookData = await response.json();
            callback(bookData);
        }
        else
        {
            callback(0);
        }
    }
    return <div class='searchBarModal'>
        <div class='divTitle'>{user ? "Wyszukaj książkę aby dodać ją do swojego zbioru" : "Wyszukaj dowolną książkę z bazy danych."}</div>
        <div id="searchBar">
            <input value={title} onChange={(e) => setTitle(e.target.value)} type="text"></input><button onClick={searchForTitle} ><i class='icon-search'></i></button>
        </div>
    </div>
}

export default SearchBar