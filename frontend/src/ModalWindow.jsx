import { useState, useEffect } from 'react'
import SearchBar from './SearchBar'
import UserSettings from './UserSettings'
import BookSearched from './BookSearched.jsx'

const ModalWindow = ({tryb, visibility, setVisibility, userID}) => {
    const [errorStateBooks, setErrorBook] = useState("");
    const [foundBooks, setBooks] = useState([])

  const fetchSearchedBooks = (bookData) => {
    setErrorBook("")
    if (bookData!=0)
      setBooks(bookData);
    else
      setErrorBook("Nie znaleziono żadnej książki o danej nazwie!");
  }

    console.log(visibility);
    return (
        <div class={(visibility) ? 'modalMain' : 'modalMain-hidden'}>
            <div class='contentBox'>
                {(tryb==1)&&<div>
                        <SearchBar callback={fetchSearchedBooks} user={userID}></SearchBar>
                        <span style={{"color":"red"}}>{errorStateBooks}</span>
                        {foundBooks.length!=0&& <BookSearched bookData={foundBooks} userID={userID}></BookSearched>}
                    </div>}
                {(tryb==2)&&<UserSettings></UserSettings>}
                <div class='navBottom'>
                    <button onClick={() => {setVisibility(false)}}>Wroc</button>
                </div>
            </div>

        </div>
    )
}

export default ModalWindow