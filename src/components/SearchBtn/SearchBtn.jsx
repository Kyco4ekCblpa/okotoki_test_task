import { useState, useRef } from 'react';
import ReactDOM from 'react-dom';

import SearchPanel from '../SearchPanel/SearchPanel';


import './searchBtn.css';
import icon from '../../assets/icons/search.svg';

const SearchBtn = () => {
    const [showSearchPanel, setShowSearchPanel] = useState(false);
    const buttonRef = useRef(null);

    const onSearchBtnClick = () => {
        setShowSearchPanel(!showSearchPanel);
    }

    return (
        <>
            <button
                className="search-btn"
                onClick={onSearchBtnClick}
                ref={buttonRef} >

                <img src={icon} alt="search-icon" className='search-icon' />
                <div className="search-btn-caption">Search</div>
            </button>

            {showSearchPanel && buttonRef.current && ReactDOM.createPortal(
                <SearchPanel
                    buttonRef={buttonRef}
                    showSearchPanel={showSearchPanel}
                    setShowSearchPanel={setShowSearchPanel} />,

                document.body)};
        </>
    )
}

export default SearchBtn;