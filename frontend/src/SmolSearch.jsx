import {useState} from 'react'

const SmolSearch = ({callback}) => {
    const [searchValue, setSearch] = useState("");
            return (
                <div id="searchBarSmol">
                    <input value={searchValue} onChange={(e) => {setSearch(e.target.value)}} type="text"></input><button onClick={() =>callback(searchValue)} ><i class='icon-search'></i></button>
                </div>
            )
    
}
export default SmolSearch